const fs = require('fs');
const express = require('express');
const multer = require('multer');
const { BucketsApi, ObjectsApi, PostBucketsPayload } = require('forge-apis');

const { getClient, getInternalToken } = require('./common/oauth');
const config = require('../config');

let router = express.Router();

// Middleware for obtaining a token for each request.
router.use(async (req, res, next) => {
    const token = await getInternalToken();
    req.oauth_token = token;
    req.oauth_client = getClient();
    next();
});

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
        } catch (err) {
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
        } catch (err) {
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
    payload.bucketKey = '"' + config.credentials.client_id.toLowerCase() + '- ' + req.body.bucketKey + '"';
    payload.policyKey = 'persistent'; // expires in 24h
    try {
        // Create a bucket using [BucketsApi](https://github.com/Autodesk-Forge/forge-api-nodejs-client/blob/master/docs/BucketsApi.md#createBucket).
        await new BucketsApi().createBucket(payload, {}, req.oauth_client, req.oauth_token);
        res.status(200).end();
    } catch (err) {
        next(err);
    }
});

router.get('/bucketsProyectos', async (req, res, next) => {
    const bucket_name = req.query.id;
    const opc = req.query.opc
    try {
        const buckets = await new BucketsApi().getBuckets({}, req.oauth_client, req.oauth_token);

        if (opc == "1") {
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
            } catch (err) {
                next(err);
            }
        } else {
            buckets.body.items.forEach(async (bucket) => {
                let lista = [];
                const objects = await new ObjectsApi().getObjects(bucket.bucketKey, {}, req.oauth_client, req.oauth_token);
                objects.body.items.forEach(item => {
                    let _item = {
                        urn: Buffer.from(item.objectId).toString('base64'),
                        bucketKey: item.bucketKey,
                        objectKey: item.objectKey,
                        size: item.size
                    }
                    lista.push(_item);
                });
                res.json(lista);
            });

        }


    } catch (err) {
        next(err);
    }

});
// POST /api/forge/oss/objects - uploads new object to given bucket.
// Request body must be structured as 'form-data' dictionary
// with the uploaded file under "fileToUpload" key, and the bucket name under "bucketKey".
router.post('/objects', multer({ dest: 'uploads/' }).single('fileToUpload'), async (req, res, next) => {
    fs.readFile(req.file.path, async (err, data) => {
        if (err) {
            console.error(`error on router.post /objects, error: ${err}, data?.length: ${data?.length}`);
            console.error(err);
            next(err);
        }
        try {
            // Upload an object to bucket using [ObjectsApi](https://github.com/Autodesk-Forge/forge-api-nodejs-client/blob/master/docs/ObjectsApi.md#uploadObject).
            await new ObjectsApi().uploadObject(req.body.bucketKey, req.file.originalname, data.length, data, {}, req.oauth_client, req.oauth_token);
            res.status(200).end();
        } catch (err) {
            console.error(`error on router.post /objects, ObjectsApi.uploadObject, error: ${err}, data?.length: ${data?.length}`);
            console.error(err);
            next(err);
        }
    });
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

    } catch (err) {
        next(err);
    }

});


module.exports = router;
