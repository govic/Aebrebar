const fs = require('fs');
const express = require('express');
const multer  = require('multer');
const formidable = require('formidable');
const http = require('http');
const stream = require('stream');

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const { BucketsApi, ObjectsApi, PostBucketsPayload,forgeSDK } = require('forge-apis');

const { getClient, getInternalToken, getPublicToken } = require('./common/oauth');
const config = require('../config');

let router = express.Router();



// Middleware for obtaining a token for each request.
router.use(async (req, res, next) => {
    const token = await getInternalToken();
    req.oauth_token = token;
    req.oauth_client = getClient();
    next();
});
var rawParser = bodyParser.raw({limit: '10mb'});
///////////////////////subida proyectos
router.post('/chunks', rawParser, async function (req, res) {
    // Uploading a file to app bucket
  
    var tokenSession =await getPublicToken() ;
  
    var fileName = req.headers['x-file-name'];
    var bucketName = req.headers.id
    var data = req.body;
    var range = req.headers.range;
    var sessionId = req.headers.sessionid;
  
    console.log("chunks with range " + range);
  
    // Upload the new file
    var objects = new forgeSDK.ObjectsApi();
    objects.uploadChunk(bucketName, fileName, data.length, range, sessionId, data, {}, tokenSession.getOAuth(), tokenSession.getCredentials())
      .then(function (objectData) {
        console.log(`uploadChunk with range ${range}: succeeded`);
        res.status(objectData.statusCode).json(objectData.body);
      })
      .catch(function (error) {
        console.log(`uploadChunk with range ${range}: failed`);
        if (error.statusCode && error.statusMessage) {
          res.status(error.statusCode ? error.statusCode : 500).end(error.statusMessage);
        } else {
          res.status(500).end("Unknown error");
        }
      });
  
  });



  router.get('/uploadurls', async function (req, res) {
    const query = req.query;
    console.log("LLAMADA A GET UPLOADS");
    console.log(req.query);
    var tokenSession =new Token(req.session); ;
    console.log(req.session);
    console.log(tokenSession);
    const options = {
      hostname: 'developer.api.autodesk.com',
      port: 443,
      path: `/oss/v2/buckets/${encodeURIComponent(query.bucketName)}/objects/${encodeURIComponent(query.objectName)}/signeds3upload?parts=${query.count}&firstPart=${query.index}`,
      headers: {
        Authorization: `Bearer ${tokenSession.getCredentials().access_token}`
      },
      method: 'GET'
    }
  
    if (query.uploadKey) {
      options.path += `&uploadKey=${query.uploadKey}`;
    }
    
    const req2 = http.request(options, res2 => {
      console.log(`statusCode: ${res2.statusCode}`)
    
      let str = '';
  
      res2.on('data', d => {
        str += d.toString();
      })
  
      res2.on('end', () => {
        let json = JSON.parse(str);
        res.json(json);
      })
    })  
  
    req2.on('error', (e) => {
      console.log(`GET uploadurls: ${e.message}`);
      res.status(500).end();
    });
  
    req2.end();
  });
  
  // Finishes the upload
  router.post('/uploadurls', jsonParser, async function (req, res) {
    const query = req.query;
    
    var tokenSession =await getPublicToken() ;
  
    const options = {
      hostname: 'developer.api.autodesk.com',
      port: 443,
      path: `/oss/v2/buckets/${encodeURIComponent(query.bucketName)}/objects/${encodeURIComponent(query.objectName)}/signeds3upload`,
      headers: {
        "Authorization": `Bearer ${tokenSession.getCredentials().access_token}`,
        "Content-Type": "application/json" 
      },
      method: 'POST'
    }
  
    const req2 = https.request(options, res2 => {
      console.log(`statusCode: ${res2.statusCode}`)
    
      let str = '';
  
      res2.on('data', d => {
        str += d.toString();
      })
  
      res2.on('end', () => {
        let json = JSON.parse(str);
        res.json(json);
      })
    })
  
    req2.on('error', (e) => {
      console.log(`POST uploadurls: ${e.message}`);
      res.status(500).end();
    });
  
    req2.write(JSON.stringify({
      uploadKey: req.body.uploadKey
    }));
    req2.end();  
  });
  
/////////

// GET /api/forge/oss/buckets - expects a query param 'id'; if the param is '#' or empty,
// returns a JSON with list of buckets, otherwise returns a JSON with list of objects in bucket with given name.
router.get('/buckets', async (req, res, next) => {
    const bucket_name = req.query.id;
    if (!bucket_name || bucket_name === '#') {
        try {
            // Retrieve buckets from Forge using the [BucketsApi](https://github.com/Autodesk-Forge/forge-api-nodejs-client/blob/master/docs/BucketsApi.md#getBuckets)
            const buckets = await new BucketsApi().getBuckets({ limit: 64 }, req.oauth_client, req.oauth_token);
            res.json(buckets.body.items.map((bucket) => {
                return {
                    id: bucket.bucketKey,
                    // Remove bucket key prefix that was added during bucket creation
                    text: bucket.bucketKey.replace(config.credentials.client_id.toLowerCase() + '-', ''),
                    type: 'bucket',
                    children: true
                };
            }));
        } catch(err) {
            console.log("2");
            console.log(err);
            next(err);

        }
    } else {
        try {
            // Retrieve objects from Forge using the [ObjectsApi](https://github.com/Autodesk-Forge/forge-api-nodejs-client/blob/master/docs/ObjectsApi.md#getObjects)
            const objects = await new ObjectsApi().getObjects(bucket_name, {}, req.oauth_client, req.oauth_token);
            res.json(objects.body.items.map((object) => {
                return {
                    id: Buffer.from(object.objectId).toString('base64'),
                    text: object.objectKey,
                    type: 'object',
                    children: false
                };
            }));
        } catch(err) {
            console.log("1");
            console.log(err);
            next(err);
        }
    }
});

// POST /api/forge/oss/buckets - creates a new bucket.
// Request body must be a valid JSON in the form of { "bucketKey": "<new_bucket_name>" }.
router.post('/buckets', async (req, res, next) => {
    let payload = new PostBucketsPayload();
    payload.bucketKey = '"'+config.credentials.client_id.toLowerCase() + '- ' + req.body.bucketKey+'"';
    payload.policyKey = 'persistent'; // expires in 24h
    try {
        // Create a bucket using [BucketsApi](https://github.com/Autodesk-Forge/forge-api-nodejs-client/blob/master/docs/BucketsApi.md#createBucket).
        await new BucketsApi().createBucket(payload, {}, req.oauth_client, req.oauth_token);
        res.status(200).end();
    } catch(err) {
        next(err);
    }
});

router.get('/treeNode', function (req, res) {
    var regions = ["EMEA", "US"];
    var region = req.query.region;
    var id = decodeURIComponent(req.query.id);
    console.log("treeNode for " + id);

    var tokenSession = new token(req.session);

    if (id === '#') {
        // # stands for ROOT
        res.json([
            { id: "US", text: "US", type: "region", children: true },
            { id: "EMEA", text: "EMEA", type: "region", children: true }
        ]);
    }
    else if (regions.includes(id)) {
        var buckets =  new ObjectsApi().BucketsApi();
        var items = [];
        var getBuckets = function (buckets, tokenSession, options, res, items) {
            buckets.getBuckets(options, tokenSession.getOAuth(), tokenSession.getCredentials())
            .then(function (data) {
                console.log('body.next = ' + data.body.next);
                items = items.concat(data.body.items);
                if (data.body.next) {
                    var query = url.parse(data.body.next, true).query;
                    options.region = query.region;
                    options.startAt = query.startAt;
                    getBuckets(buckets, tokenSession, options, res, items);
                } else {
                    res.json(makeTree(items, true));
                }
            })
            .catch(function (error) {
                console.log(error);
                res.status(error.statusCode ? error.statusCode : 500).end(error.statusMessage);
            });
        }

        var options = { 'limit': 100, 'region': region };
        getBuckets(buckets, tokenSession, options, res, items);
    } else {
        var objects = new new ObjectsApi();

        var items = [];
        var options = { 'limit': 100 };
        var getObjects = function (objects, tokenSession, options, res, items) {
            objects.getObjects(id, options, tokenSession.getOAuth(), tokenSession.getCredentials())
            .then(function (data) {
                console.log('body.next = ' + data.body.next);
                items = items.concat(data.body.items);
                if (data.body.next) {
                    var query = url.parse(data.body.next, true).query;
                    options.region = query.region;
                    options.startAt = query.startAt;
                    getObjects(objects, tokenSession, options, res, items);
                } else {
                    res.json(makeTree(items, false));
                }
            })
            .catch(function (error) {
                console.log(error);
                res.status(error.statusCode ? error.statusCode : 500).end(error.statusMessage);
            });
        }

        getObjects(objects, tokenSession, options, res, items);
    }
});

/*
router.get('/bucketsProyectos', async(req,res,next)=>{
    const bucket_name = req.query.id;
    const opc = req.query.opc
   try{
    const forgeSDK = require('forge-apis');
    const { ObjectsApi } = forgeSDK;
    
    var getObjects = async function(bucket, options, tokenSession) {
        let lista = [];
        const objects = await new ObjectsApi().getObjects(bucket.bucketKey, options,req.oauth_client,req.oauth_token);
        console.log("OBJETOS DISPONIBLES");
        console.log(objects.body.next);
    
        objects.body.items.forEach(item => {
            let _item = {
                urn: Buffer.from(item.objectId).toString('base64'),
                bucketKey: item.bucketKey,
                objectKey: item.objectKey,
                size: item.size
            }
            lista.push(_item);
        });
    
        return lista;
    };
    
    var getBuckets = async function(buckets, tokenSession, options) {
        let items = [];
    
        const iterateBuckets = async function(options) {
            const data = await buckets.getBuckets(options, req.oauth_client,req.oauth_token);
           
            console.log('body.next = ' + data.body.next);
            console.log(data.body);
            console.log(data.body.items);
            console.log(data.body.items[0].bucketKey);
            items = items.concat(data.body.items);
            const objects = await getObjects(data.body.items[0].bucketKey, options, tokenSession);
            if (objects.body.next) {
                const query = new URL(objects.body.next).searchParams;
                options.region = query.get('region');
                options.startAt = query.get('startAt');
    
                await iterateBuckets(options);
            }
        };
    
        await iterateBuckets(options);
    
        return items;
    };
    
    // Uso
    const options = {};
    const tokenSession = req.oauth_client;
    
    getBuckets(new forgeSDK.BucketsApi(), tokenSession, options)
        .then(async buckets => {
            for (const bucket of buckets) {
                console.log("SOLICITADO");
                console.log(bucket);
                const objects = await getObjects(bucket, {}, tokenSession);
                console.log("Objetos resultado");
                console.log(objects);
                res.json(objects);
            }
        })
        .catch(error => {
            console.log(error);
            res.status(error.statusCode ? error.statusCode : 500).end(error.statusMessage);
        });
    
     
  }catch(err){
      next(err);
  }
  
  });*/
  router.get('/bucketsProyectos', async(req,res,next)=>{
    const bucket_name = req.query.id;
    const opc = req.query.opc
   try{
      const buckets = await new BucketsApi().getBuckets({},req.oauth_client,req.oauth_token);
      console.log("BUCKETS PREVIO REVISIÓN");
      console.log(buckets.body.items);
      if(opc =="1"){
          const bucket_name = req.query.bucketKey;
           const object_name = req.query.objName;
           
          try {
              // Retrieve objects from Forge using the [ObjectsApi](https://github.com/Autodesk-Forge/forge-api-nodejs-client/blob/master/docs/ObjectsApi.md#getObjects)
              const objects = await new ObjectsApi().deleteObject(bucket_name, object_name, req.oauth_client, req.oauth_token);
              res.json(objects.body.items.map((object) => {
                  return {
                      id: Buffer.from(object.objectId).toString('base64'),
                      text: object.objectKey,
                      type: 'object',
                      children: false
                  };
              }));
          } catch(err) {
              next(err);
          }
      }else{
        const buckets = await new BucketsApi().getBuckets({}, req.oauth_client, req.oauth_token);
        console.log("BUCKETS PREVIO REVISIÓN");
        console.log(buckets.body.items);
        
        // Función para obtener objetos de un bucket y agregarlos a la lista
        const obtenerObjetos = async (bucketKey, oauth_client, oauth_token, lista) => {
          let nextURL = null;
        
          do {
            const objects = await new ObjectsApi().getObjects(bucketKey, { limit: 100, startAt: nextURL }, oauth_client, oauth_token);
            console.log("OBJETOS DISPONIBLES");
            console.log(objects.body.next);
        
            // Agregar elementos a la lista
            objects.body.items.forEach(item => {
              let _item = {
                urn: Buffer.from(item.objectId).toString('base64'),
                bucketKey: item.bucketKey,
                objectKey: item.objectKey,
                size: item.size
              };
              lista.push(_item);
            });
        
            // Actualizar la URL para la próxima llamada
            nextURL = objects.body.next;
        
          } while (nextURL !== undefined);
        
          return lista;
        };
        
        // Procesar cada bucket
        const resultados = await Promise.all(buckets.body.items.map(async (bucket) => {
          let lista = [];
          await obtenerObjetos(bucket.bucketKey, req.oauth_client, req.oauth_token, lista);
          return lista;
        }));
        
        // Enviar resultados como respuesta JSON
        res.json(resultados.flat());
        
      }
      
     
  }catch(err){
      next(err);
  }
  
  });

  
/*
router.get('/bucketsProyectos', async(req,res,next)=>{
  const bucket_name = req.query.id;
  const opc = req.query.opc
 try{
    const buckets = await new BucketsApi().getBuckets({},req.oauth_client,req.oauth_token);
    console.log("BUCKETS PREVIO REVISIÓN");
    console.log(buckets.body.items);
    if(opc =="1"){
        const bucket_name = req.query.bucketKey;
         const object_name = req.query.objName;
         
        try {
            // Retrieve objects from Forge using the [ObjectsApi](https://github.com/Autodesk-Forge/forge-api-nodejs-client/blob/master/docs/ObjectsApi.md#getObjects)
            const objects = await new ObjectsApi().deleteObject(bucket_name, object_name, req.oauth_client, req.oauth_token);
            res.json(objects.body.items.map((object) => {
                return {
                    id: Buffer.from(object.objectId).toString('base64'),
                    text: object.objectKey,
                    type: 'object',
                    children: false
                };
            }));
        } catch(err) {
            next(err);
        }
    }else{
        buckets.body.items.forEach(async(bucket)=>{
            let lista = [];
             const objects = await new ObjectsApi().getObjects(bucket.bucketKey,{},req.oauth_client,req.oauth_token);
             console.log("OBJETOS DISPOSIBLES");
             console.log(objects.body.next);
             objects.body.items.forEach(item=>{
         
                     let _item ={
                        urn: Buffer.from(item.objectId).toString('base64'),
                        bucketKey: item.bucketKey,
                        objectKey:item.objectKey,
                        size:item.size
                    }
                     lista.push(_item);
                  });
                  
            res.json(lista);    
        });

    }
    
   
}catch(err){
    next(err);
}

});*/
// POST /api/forge/oss/objects - uploads new object to given bucket.
// Request body must be structured as 'form-data' dictionary
// with the uploaded file under "fileToUpload" key, and the bucket name under "bucketKey".

/**
 * router.post('/objects', multer({ dest: 'uploads/' }).single('fileToUpload'), async (req, res, next) => {
    fs.readFile(req.file.path, async (err, data) => {
        if (err) {
          
            console.log(err);
            next(err);
            
        }
        try {
            // Upload an object to bucket using [ObjectsApi](https://github.com/Autodesk-Forge/forge-api-nodejs-client/blob/master/docs/ObjectsApi.md#uploadObject).
            await new ObjectsApi().uploadObject(req.body.bucketKey, req.file.originalname, data.length, data, {}, req.oauth_client, req.oauth_token);
            res.status(200).end();
        } catch(err) {
             
            console.log(err);
            next(err);
        }
    });
});
 * 

router.post('/objects', multer({ dest: 'uploads/' }).single('fileToUpload'), async (req, res, next) => {
    fs.readFile(req.file.path, async (err, data) => {
        if (err) {
          
            console.log(err);
            next(err);
            
        }
        try {
            // Upload an object to bucket using [ObjectsApi](https://github.com/Autodesk-Forge/forge-api-nodejs-client/blob/master/docs/ObjectsApi.md#uploadObject).
            await new ObjectsApi().uploadObject(req.body.bucketKey, req.file.originalname, data.length, data, {}, req.oauth_client, req.oauth_token);
            
           
            res.status(200).end();
        } catch(err) {
             
            console.log(err);
            next(err);
        }
    });
});

 */
const storage = multer.memoryStorage();

function randomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

router.post('/objects',  multer({ storage: multer.memoryStorage() }).single('fileToUpload'), async (req, res, next) => {
    
    console.log("tamaño archivo");
    console.log(req.file.size);
    const fileSize = req.file.size;
    const chunkSize = 2 * 1024 * 1024;
    const nbChunks = Math.round(0.5 + fileSize / chunkSize);
    let finalRes = null;
    console.log(req.file);
    if (!req.file || !req.file.buffer) {
        return res.status(400).json({ error: 'No se ha proporcionado un archivo válido' });
    }
    const sessionId =  randomString(12);;
    console.log(sessionId);
    for (let i = 0; i < nbChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(fileSize, (i + 1) * chunkSize) - 1;
        const range = `bytes ${start}-${end}/${fileSize}`;
        const length = end - start + 1;

        const buffer = Buffer.from(req.file.buffer.slice(start, end + 1));
        const memoryStream = new stream.Readable(); // Cambio aquí
        memoryStream.push(buffer);
        memoryStream.push(null); // Marca el final del stream
        const { bucketKey } = req.body;
        const objectKey = req.file.originalname;
       
        try {
            const response = await new ObjectsApi().uploadChunk(
                                          bucketKey, objectKey,
                                          length, range, sessionId,
                                          memoryStream, {}, { autoRefresh: false }, req.oauth_token
                                    );
            finalRes = response;
            if (response.statusCode === 202) {
                console.log('Se ha subido una parte del archivo.');
                continue;
            } else if (response.statusCode === 200) {
                console.log('La última parte se ha subido.');
                res.redirect('/proyectos');
            } else {
                console.log('Error en la respuesta:', response.data); // Agregado para imprimir detalles
                console.log(response.statusCode);
               
                break;
            }
        } catch (error) {
            console.error('Error al subir el archivo:', error);
            break;
        }}
    
    ///******** */
   
    //******* */
});

router.delete('/files/:id', function (req, res) {
    var tokenSession = new token(req.session)

    var id = req.params.id
    var boName = getBucketKeyObjectName(id)

    var objects = new forgeSDK.ObjectsApi();
    objects.deleteObject(boName.bucketKey, boName.objectName, tokenSession.getOAuth(), tokenSession.getCredentials())
      .then(function (data) {
          res.json({ status: "success" })
      })
      .catch(function (error) {
          res.status(error.statusCode).end(error.statusMessage);
      })
})
router.post('/deleteObject', async (req, res, next) => {
    console.log("LLEGA");
    console.log(req.body);
    
    const bucket_name = req.body.bucketKey;
    const object_name = req.body.objectName;

        try {
            // Retrieve objects from Forge using the [ObjectsApi](https://github.com/Autodesk-Forge/forge-api-nodejs-client/blob/master/docs/ObjectsApi.md#getObjects)
            const objects = await new ObjectsApi().deleteObject(bucket_name, object_name, req.oauth_client, req.oauth_token);
            console.log("Borro llama objs");
            console.log(objects);
            res.json({ status: "success" })
            res.redirect('/proyectos');
           
        } catch(err) {
            next(err);
        }
    
});

     
module.exports = router;
