var MyVars = {
  keepTrying: true,
  ajaxCalls: []
};
var  _this;
var urn_usada = "";
$(document).ready(function () {
  setTimeout(function () {
    prepareAppBucketTree();

  }, 3000);

  callProyectosSeleccion();
  // callProyectos2();
  $('#refreshBuckets').click(function () {
    $('#appBuckets').jstree(true).refresh();
  });

  $('#createNewBucket').click(function () {
    createNewBucket();
  });

  $('#createBucketModal').on('shown.bs.modal', function () {
    $("#newBucketKey").focus();
  })
  var url = new URL(window.location.href);
  MyVars.noHierarchy = (url.searchParams.get("nohierarchy") != null);
  MyVars.useSvf2 = (url.searchParams.get("usesvf2") != null);
  MyVars.uploadInParallel = (url.searchParams.get("uploadinparallel") != null);
  console.log("MYvars");
  console.log(MyVars);
  console.log(url.searchParams);
  function uptoBucket(){
    var node2 = $('#appBuckets').jstree(true);
    var arrObj = Object.keys(node2._model.data);
    var arr = $('#appBuckets').jstree(true).get_json('#', { no_state: true, flat: true });
    //console.log(node);
    console.log(arr);
    _this = this;
    if (_this.files.length == 0) return;
    var file = _this.files[0];
    if (arr[0].id == "p2_proyectos") {

      console.log("entró a la subida bucket");
      var formData = new FormData();
      formData.append('fileToUpload', file);
      formData.append('bucketKey', arr[0].id);

      $.ajax({
        url: '/api/forge/oss/objects',
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (data) {
         // $('#appBuckets').jstree(true).refresh();
         $('#appBuckets').jstree(true).destroy();
         prepareAppBucketTree();
          $("#notificaciones").empty();
          $("#notificaciones").html("Archivo " + "subido exitosamente");
          _this.value = '';
         

          callProyectosSeleccion();
          location.reload();

        },error:function(res){
            console.log("ERROR AL SUBIR");
            console.log(res);
            uptoBucket();
        }

      });

    }
  }

  
  function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function updateAccessToken() {
    return new Promise((resolve, reject) => {
      get2LegToken(function(token) {
        MyVars.token2Leg = token;
        resolve();
      });
    });
  }

  function uploadChunk(fileName, folderId, sessionId, range, readerResult) {
    return new Promise((resolve, reject) => {
      console.log(
        "uploadChunk [before]: sessionId = " + sessionId + ", range = " + range
      );

      MyVars.ajaxCalls.push(
        $.ajax({
          url: "/chunks",
          type: "POST",
          headers: {
            "Content-Type": "application/octet-stream",
            "x-file-name": fileName,
            id: folderId,
            sessionid: sessionId,
            range: range
          },
          processData: false,
          data: readerResult // d is the chunk got by readAsBinaryString(...)
        })
          .done(function(response) {
            // if 'd' is uploaded successfully then ->
            console.log(
              "uploadChunk [done]: sessionId = " +
                sessionId +
                ", range = " +
                range
            );
            resolve(response);
          })
          .fail(function(error) {
            console.log(
              "uploadChunk [fail]: sessionId = " +
                sessionId +
                ", range = " +
                range
            );
            reject(error);
          })
      );
    });
  }

  function uploadChunkAsync(fileName, folderId, sessionId, range, readerResult) {
    return new Promise((resolve, reject) => {
      console.log(
        "uploadChunk [before]: sessionId = " + sessionId + ", range = " + range
      );

      MyVars.ajaxCalls.push(
        $.ajax({
          url: "/chunks",
          type: "POST",
          headers: {
            "Content-Type": "application/octet-stream",
            "x-file-name": fileName,
            id: folderId,
            sessionid: sessionId,
            range: range
          },
          processData: false,
          data: readerResult // d is the chunk got by readAsBinaryString(...)
        })
          .done(function(response) {
            // if 'd' is uploaded successfully then ->
            console.log(
              "uploadChunk [done]: sessionId = " +
                sessionId +
                ", range = " +
                range
            );
            resolve(response);
          })
          .fail(function(error) {
            console.log(
              "uploadChunk [fail]: sessionId = " +
                sessionId +
                ", range = " +
                range
            );
            reject(error);
          })
      );
    });
  }

  async function readChunkAsync(file, start, end, total) {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      var blob = file.slice(start, end);

      reader.onload = function(e) {
        var currentStart = start;
        var currentEnd = start + e.loaded - 1;
        var range = "bytes " + currentStart + "-" + currentEnd + "/" + total;

        resolve({ readerResult: reader.result, range: range });
      };

      reader.readAsArrayBuffer(blob);
    });
  }

  async function uploadChunks(file) {
    const RETRY_MAX = 3;
    const CHUNK_SIZE = 2 * 1024 * 1024; // 2 MB suggested
    const total = file.size; // total size of file
    const folderId = MyVars.selectedNode.id;
    const fileName = file.name;
    const sessionId = uuidv4();
    const stepsMax = Math.floor(total / CHUNK_SIZE) + 1;
    let stepsCount = 0;

    let createPromise = function(start, end) {
      console.log(`createPromise: ${start} - ${end}`);
      return new Promise(async (resolve, reject) => {
        let retryCount = 0;

        console.log(`runPromise: ${start} - ${end}`);
        let resRead = await readChunkAsync(file, start, end, total);

        while (true) {
          try {
            if (!MyVars.keepTrying) {
              reject(false);
              return;
            }

            console.log(`before uploadChunk: retryCount =  ${retryCount}`);
            let resUpload = await uploadChunk(
              fileName,
              folderId,
              sessionId,
              resRead.range,
              resRead.readerResult
            );
            showProgress(
              "Uploading file... " +
                Math.ceil((++stepsCount / stepsMax) * 100).toString() +
                "%",
              "inprogress"
            );
            resolve(true);
            return;
          } catch {
            if (++retryCount > RETRY_MAX) {
              reject(false);
              return;
            }

            await updateAccessToken();
          }
        }
      });
    };

    MyVars.promises = [];
    for (let start = 0; start < total; start += CHUNK_SIZE) {
      MyVars.promises.push(createPromise(start, start + CHUNK_SIZE));
    }

    // Whether some failed or not, let's wait for all of them to return resolve or reject
    Promise.allSettled(MyVars.promises).then(results => {
      let failed = results.find(item => {
        return item.status === "rejected";
      });

      if (failed) {
        if (MyVars.keepTrying) {
          console.log("uploadChunks >> fail");
          showProgress("Upload failed", "failed");
        } else {
          console.log("uploadChunks >> cancelled");
          showProgress("Upload cancelled", "failed");
        }
      } else {
        console.log("uploadChunks >> done");
        showProgress("File uploaded", "success");
        $("#forgeFiles")
          .jstree(true)
          .refresh();
      }

      $("#forgeUploadHidden").val("");
      MyVars.keepTrying = true;
    });
  }

  async function uploadChunksAsync(file, options, callback) {
    const RETRY_MAX = 3;
    const CHUNK_SIZE = 5 * 1024 * 1024; // 5 MB suggested
    const BATCH_SIZE = 5; // how many upload URLs are requested at a time
    const bucketName = MyVars.selectedNode.id;
    const fileName = file.name;
    const stepsMax = Math.floor(file.size / CHUNK_SIZE) + 1;
    const finishedChunks = new Set();

    let getUrlsAsync = function(index, count, uploadKey) {
      console.log(`getUrlsAsync: index = ${index}, count = ${count}`);

      return new Promise(async (resolve, reject) => {
        console.log(`getUrlsPromises: index = ${index}`);

        // The lowest index accepted is 1 not 0, so I'm adding 1 to the indices used locally 
        let url = `/api/forge/oss/uploadurls?bucketName=${bucketName}&objectName=${fileName}&index=${index + 1}&count=${count}`;
        if (uploadKey)
          url += `&uploadKey=${uploadKey}`;

        console.log(`getUrlsPromises.fetch: url = ${url}`);
        try {
          let res = await fetch(url, {
            method: 'GET'
          })
          
          let data = await res.json();

          resolve(data);
        } catch {
          reject("failed");
        }
      });
    }
        
    let readChunkAsync = function(file, start, end, total) {
      return new Promise((resolve, reject) => {
        console.log(`readChunkAsync: ${start} - ${end}`);

        var reader = new FileReader();
        var blob = file.slice(start, end);
  
        reader.onload = function(e) {
          var currentStart = start;
          var currentEnd = start + e.loaded - 1;
          var range = "bytes " + currentStart + "-" + currentEnd + "/" + total;
  
          resolve({ readerResult: reader.result, range: range });
        };
  
        reader.readAsArrayBuffer(blob);
      });
    }

    let uploadChunkAsync = function(start, end, url) {
      console.log(`uploadChunkAsync: ${start} - ${end}`);
      return new Promise(async (resolve, reject) => {
        if (finishedChunks.has(start)) {
          resolve(200);
          return;
        }

        try {
          let resRead = await readChunkAsync(file, start, end, file.size);

          console.log(`uploadChunkAsync.fetch: url=${url}`);

          let res = await fetch(url, {
            method: 'PUT',
            body: resRead.readerResult
          })

          if (res.status !== 200) {
            reject(res.status);
          } else {
            resolve(200);
            finishedChunks.add(start);
            callback("inprogress", Math.ceil((finishedChunks.size / stepsMax) * 100).toString() + "%");
          }
        } catch {
          reject(500);
        }
      });
    };

    let uploadBatchAsync = function(step, count, uploadKey) {
      console.log(`uploadBatchAsync: index=${step}, uploadKey=${uploadKey}`);
      return new Promise(async (resolve, reject) => {
        try {
          let promises = [];
          
          let resUrls = await getUrlsAsync(step, count, uploadKey);
          uploadKey = resUrls.uploadKey

          for (let index = 0; index < count; index++) {
            const start = (step + index) * CHUNK_SIZE;
            const end = start + CHUNK_SIZE;
            promises.push(uploadChunkAsync(start, end, resUrls.urls[index]));

            if (!options.uploadInParallel)
              await promises[index];
          }

          // Whether some failed or not, let's wait for all of them resolve or one reject
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
          // It rejects immediately upon any of the input promises rejecting
          if (options.uploadInParallel)
            await Promise.all(promises);

          resolve(uploadKey);
        } catch {
          reject("failed");
        }
      });
    };

    let uploadKey;
    for (let step = 0; step < stepsMax; step += BATCH_SIZE) {
      let retryCount = 0;
      while (true) {
        try {
          const count = Math.min(stepsMax - step, BATCH_SIZE); 
          uploadKey = await uploadBatchAsync(step, count, uploadKey);

          break;
        } catch (ex) {
          if (MyVars.keepTrying && retryCount++ < RETRY_MAX) {
            console.log(`Wait for retry: retryCount=${retryCount}`);
            await new Promise(r => setTimeout(r, retryCount * 5000));
          } else {
            callback("cancelled");
            return;
          }
        }
      }
    }

    let res = await fetch(`/api/forge/oss/uploadurls?bucketName=${bucketName}&objectName=${fileName}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        uploadKey
      })
    })
    let data = await res.json();
    console.log(data);
    if (data.status === "error") {
      callback("failed");
    } else {
      callback("success");
    }
  }
  $('#hiddenUploadField').change(function () {
    // var node = $('#appBuckets').jstree(true).get_selected(true)[0];
    var node2 = $('#appBuckets').jstree(true);
    var arrObj = Object.keys(node2._model.data);
    var arr = $('#appBuckets').jstree(true).get_json('#', { no_state: true, flat: true });
    //console.log(node);
    console.log(arr);
    _this = this;
    if (_this.files.length == 0) return;
    var file = _this.files[0];
    if (arr[0].id == "p2_proyectos") {

      console.log("entró a la subida bucket");
      showProgress("Ha iniciado el Proceso de carga.. Puede tardar algunos minutos","inprogress");
      var formData = new FormData();
      formData.append('fileToUpload', file);
      formData.append('bucketKey', arr[0].id);
      MyVars.selectedNode = arr[0];/*
      uploadChunksAsync(this.files[0], {uploadInParallel: MyVars.uploadInParallel}, (state, message) => {
        switch (state) {
          case "inprogress":
            showProgress(
              "Uploading file... " + message,
              "inprogress"
            );
            break;
  
          case "failed":
            showProgress("Upload failed", "failed");
            $("#forgeUploadHidden").val("");
            MyVars.keepTrying = true;
            break;
  
          case "cancelled":
            showProgress("Upload cancelled", "failed");
            $("#forgeUploadHidden").val("");
            MyVars.keepTrying = true;
            break;
  
          case "success":
            let end = new Date().getTime();
            let diff = end - start; 
            console.log(`${this.files[0].size} byte uploaded in ${diff} ms (parallel: ${MyVars.uploadInParallel})`)  
  
            showProgress("File uploaded", "success");
            $("#forgeFiles")
              .jstree(true)
              .refresh();
  
            $("#forgeUploadHidden").val("");
            MyVars.keepTrying = true;
            break;
        }
        
      });*/

      $.ajax({
        url: '/api/forge/oss/objects',
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (data) {
         // $('#appBuckets').jstree(true).refresh();
         $('#appBuckets').jstree(true).destroy();
         prepareAppBucketTree();
          $("#notificaciones").empty();
         // $("#notificaciones").html("Archivo " + "subido exitosamente");
         showProgress("Cargado Exitosamente","inprogress");
         _this.value = '';
         

          callProyectosSeleccion();
          location.reload();

        },error:function(res){
            console.log("ERROR AL SUBIR");
            console.log(res);
            uptoBucket();
        }

      });

    }
  });
});

function savePoryecto() {

}
function closeAsignacion() {
  $('#modaldemo10').modal("toggle");
}
function callProyectos2() {
  $("#forgeViewer").empty();
  getForgeToken(function (access_token) {
    jQuery.get({
      url: '/listaProyecto',
      contentType: 'application/json',

      success: function (res) {
        //   alert(res);
        console.log("VISTA SELECCIONADA URN");
        console.log(res[0].nombre);
        openViewer(res[0].nombre);
      },
    });
   
  })
}
function cargarProyecto() {

  var q = document.getElementById("proyectos_disponibles").value;
   alert(q);

  console.log("DATA NOMBRE");
  console.log(q);
  console.log("DATA IDS");
  console.log(q);

  jQuery.post({
    url: '/vista',
    contentType: 'application/json',
    data: JSON.stringify({ 'nombre': q }),
    success: function (res) {
      $('#modaldemo10').modal("toggle");

    },
  });

}

function cargarUsuarios() {
 console.log("ENTRO A BUSCAR USUARIOS");
  
  jQuery.get({
    url: '/getUsers',
    contentType: 'application/json',
    success: function (res) {
      console.log("LISTADO DE USUARIOS");
      console.log(res);
      var opciones = "";
      for(let y =0; y <res.length;y++){
        opciones += "<option value='"+res[y].idUsu+"'>"+res[y].username+"</option>";
      }
      document.getElementById("usuariosAsignacion").innerHTML = "";
      document.getElementById("usuariosAsignacion").innerHTML = opciones;
      
    },
  });

}

function eliminarAsociacion(proyecto,usuario){
console.log("INGRESO A ELIMINACION")
  jQuery.post({
    url: '/eliminarAsignacion',
    contentType: 'application/json',
    data: JSON.stringify({ 'nameusuario': usuario,'namep':proyecto}),
    success: function (res) {
      console.log("Eliminado con Exito");
      console.log(res);
      window.location.href = window.location.href;
    },
  });
}
function guardarAsignación(){

  let proyectoAsig = $('#proyectosAsignacion').find(":selected").val();
  let nombreProyAsig =  $('#proyectosAsignacion').find(":selected").text();


  
  let usuarioAsig = $('#usuariosAsignacion').find(":selected").val();
  let nombreUsuAsig = $('#usuariosAsignacion').find(":selected").text();

  console.log("Asignaciones proyecto Uusuarios");
  console.log(usuarioAsig);
  console.log(proyectoAsig);
  console.log(nombreUsuAsig);
  console.log(nombreProyAsig);
  jQuery.post({
    url: '/CargarAsignacion',
    contentType: 'application/json',
    data: JSON.stringify({ 'nameusuario': nombreUsuAsig,'usuario':usuarioAsig,'urn':proyectoAsig,'namep':nombreProyAsig}),
    success: function (res) {
     console.log("okok");
     window.location.href = window.location.href;
    },
  });


}
function cerrarnoTransferencia(){
  
  $('#NoTransferenciaDatos').modal('hide');
}
function cerrarTransferenciaok(){
  
  $('#OkTransferenciaDatos').modal('hide');
}
function iniciarTransferencia(){
  
  let urn_emisor =  $('#proyectoEmisor').find(":selected").val();
  let urn_receptor =  $('#proyectoReceptor').find(":selected").val();
  $('#TransferenciaDatos').modal('hide');
  jQuery.post({
    url: '/transferenciaDatos',
    contentType: 'application/json',
    data: JSON.stringify({ 'emisor': urn_emisor,'receptor':urn_receptor}),
       success: function (res) {
         console.log(res);
         //window.location.href = window.location.href;
      
        $('#OkTransferenciaDatos').modal('show');
    } ,error: function (err) {
      console.log("error");
      console.log(err);
      $('#TransferenciaDatos').modal('hide');
      $('#NoTransferenciaDatos').modal('show');
    }
  });

}
function modalTransferencia(){
  //TransferenciaDatos
  let emisor =  $('#proyectoEmisor').find(":selected").text();
  let receptor =  $('#proyectoReceptor').find(":selected").text();
  $('#emisorDatos').empty();
  $('#receptorDatos').empty();
  $('#emisorDatos').append(''+emisor);
  $('#receptorDatos').append(''+receptor);
console.log("ProyectoEmisor :"+emisor +" receptor :"+receptor);
  $('#TransferenciaDatos').modal('show');
}
function cerrarTransferencia(){
  $('#TransferenciaDatos').modal('hide');
}
function cargaProyectosOpt(resultado) {
  console.log("ENTRO A BUSCAR USUARIOS");
   
  var opciones = "";
  for(let y =0; y <resultado.length;y++){
    opciones += "<option value='"+resultado[y].urn+"'>"+resultado[y].objectKey+"</option>";
  }
  document.getElementById("proyectosAsignacion").innerHTML = "";
  document.getElementById("proyectosAsignacion").innerHTML = opciones;
  document.getElementById("proyectoEmisor").innerHTML = opciones;
  document.getElementById("proyectoReceptor").innerHTML = opciones;

 
 }
 function showProgress(text, status) {
  var progressInfo = $("#progressInfo");
  var progressInfoText = $("#progressInfoText");
  var progressInfoIcon = $("#progressInfoIcon");

  var oldClasses = progressInfo.attr("class");
  var newClasses = "";
  var newText = text;

  if (status === "failed") {
    newClasses = "btn btn-danger";
    if (newText === "")
      newText = "Failed"
  } else if (status === "inprogress" || status === "pending") {
    newClasses = "btn btn-warning";
    newText += " Subiendo Paquetes";
  } else if (status === "success") {
    newClasses = "btn btn-success";
  } else {
    newClasses = "btn btn-info";
    newText = "Progress info";
  }

  // Only update if changed
  if (progressInfoText.text() !== newText) {
    progressInfoText.text(newText);
  }

  if (oldClasses !== newClasses) {
    progressInfo.attr("class", newClasses);

    if (newClasses === "btn btn-warning") {
      progressInfoIcon.attr(
        "class",
        "glyphicon glyphicon-refresh glyphicon-spin"
      );
    } else {
      progressInfoIcon.attr("class", "");
    }
  }
}
function callProyectosSeleccion() {
  cargarUsuarios();
  console.log("Llamo a proyectos");
  $("#forgeViewer").empty();
  getForgeToken(function (access_token) {
    jQuery.ajax({
      url: '/api/forge/oss/bucketsProyectos',
      headers: { 'Authorization': 'Bearer ' + access_token },
      success: function (res) {
        console.log("Llamo a proyectos2");
        if (res.length == 0) {
          callProyectosSeleccion();
         
        } else {
          cargaProyectosOpt(res)
          console.log(res);
          console.log(res);
          let dropdown = "";
          for (i = 0; i < res.length; i++) {

            dropdown = dropdown + "<option class='slide-item' href='#' value='" + res[i].urn + "'>" + res[i].objectKey + "</option>";
            // dropdown = dropdown+ "<a href='#' class='dropdown-item' onclick='openViewer("+"\""+res[i].urn+"\""+")'>"+res[i].objectKey+"</a>"

          }
        //  document.getElementById("proyectos_disponibles").innerHTML = dropdown;
        }

      },
      error: function (err) {
        console.log("error");
        console.log(err);
      }
    });
  })
}
function openViewer(urn) {
  launchViewer(urn);
  urn_usada = urn;
  getForgeToken(function (access_token) {
    jQuery.ajax({
      url: 'https://developer.api.autodesk.com/modelderivative/v2/designdata/' + urn + '/manifest',
      headers: { 'Authorization': 'Bearer ' + access_token },
      success: function (res) {
        if (res.status === 'success') launchViewer(urn);
        else $("#forgeViewer").html('La traducción está en curso: ' + res.progress + '. Por favor vuelva a intentarlo en unos minutos..');
      },
      error: function (err) {
        var msgButton = 'Este archivo no ha sido traducido aún! ' +
          '<button class="btn btn-xs btn-info" onclick="translateObject()"><span class="glyphicon glyphicon-eye-open"></span> ' +
          'Iniciar Traducción</button>'
        $("#forgeViewer").html(msgButton);
      }
    });
  })

}

function createNewBucket() {
  var bucketKey = $('#newBucketKey').val();
  jQuery.post({
    url: '/api/forge/oss/buckets',
    contentType: 'application/json',
    data: JSON.stringify({ 'bucketKey': bucketKey }),
    success: function (res) {
      $('#appBuckets').jstree(true).refresh();
      $('#createBucketModal').modal('toggle');
    },
    error: function (err) {
      if (err.status == 409)
        alert('Bucket already exists - 409: Duplicated')
      console.log(err);
    }
  });
}



function prepareAppBucketTree() {
  //console.log('Pasé por la carga');
  var k = [];
  var i;
  p1();
  
  
  function p1() {


    $.ajax({
      "url": "/api/forge/oss/bucketsProyectos",
      method: "GET",
      dataType: "json",
      success: function (result) {
        console.log(result);
      }
    }).then(function (data2) {
      console.log(data2);
      i = data2;
      console.log(i);
      i.forEach(function (object) {
        if (object.objectKey == "") {
          k.push({ "id": object.urn, "text": object.objectKey, "parent": object.bucketKey, "type": "object" })

        }
        k.push({ "id": object.urn, "text": object.objectKey, "parent": object.bucketKey, "type": "object" })

      });
      $('#appBuckets').jstree({

        'core': {
         
          'themes': { "stripes": true },
          'data': [
            {
              'id': 'p2_proyectos',
              'text': 'p2_proyectos',
              'state': { 'opened': true, 'selected': true },
              'children': k,
              success: function (res) {
                console.log(res);

              }
            }
          ]

         

        },
        'types': {
          'default': {
            'icon': 'glyphicon glyphicon-folder-open'
          },
          '#': {
            'icon': 'glyphicon glyphicon-folder-open'
          },
          'bucket': {
            'icon': 'glyphicon glyphicon-folder-open'
          },
          'object': {
            'icon': 'glyphicon glyphicon-folder-open'
          }
        },
        "plugins": ["contextmenu", "wholerow", "types", "sort"],
        contextmenu: { items: autodeskCustomMenu }
      }).on('loaded.jstree', function () {
        $('#appBuckets').jstree('open_all');

      }).bind("activate_node.jstree", function (evt, data) {
        if (data != null && data.node != null && data.node.type == 'object') {
          //console.log("que es?: "+data.node);
          $("#forgeViewer").empty();
          var urn = data.node.id;
          getForgeToken(function (access_token) {
            jQuery.ajax({
              url: 'https://developer.api.autodesk.com/modelderivative/v2/designdata/' + urn + '/manifest',
              headers: { 'Authorization': 'Bearer ' + access_token },
              success: function (res) {
                if (res.status === 'success') launchViewer(urn);
                else $("#forgeViewer").html('La traducción está en curso: ' + res.progress + '. Por favor vuelva a intentarlo en unos minutos..');
              },
              error: function (err) {
                var msgButton = 'Este Archivo no ha sido traducido aún! ' +
                  '<button class="btn btn-xs btn-info" onclick="translateObject()"><span class="glyphicon glyphicon-eye-open"></span> ' +
                  'Iniciar Traducción</button>'
                $("#forgeViewer").html(msgButton);
              }
            });
          })
        }
      });
    })
  }
}
function traduceObjeto() {

  var treeNode = $('#appBuckets').jstree(true).get_selected(true)[0];
  translateObject(treeNode);
}
function uploadArchivo() {
  items = {
    uploadFile: {
      label: "Upload file",
      action: function () {
        uploadFile();
      },
      icon: 'glyphicon glyphicon-cloud-upload'
    }
  };

}


function autodeskCustomMenu(autodeskNode) {
  var items;
  MyVars.selectedNode = autodeskNode;
  switch (autodeskNode.type) {
    case "bucket":
      items = {
        uploadFile: {
          label: "Upload file",
          action: function () {
            uploadFile();
          },
          icon: 'glyphicon glyphicon-cloud-upload'
        }
      };
      break;
    case "object":
      items = {

        translateFile: {
          label: "Traducir",
          action: function () {
            // BUSCA OBJETO SELECCIONADO
            var treeNode = $('#appBuckets').jstree(true).get_selected(true)[0];
            console.log("nodo seleccionado");
            console.log(treeNode);
            translateObject(treeNode);
          },
          icon: 'glyphicon glyphicon-eye-open'
        },
        deleteFile: {
          label: "Eliminar",
          action: function () {
            // BUSCA OBJETO SELECCIONADO
            var treeNode = $('#appBuckets').jstree(true).get_selected(true)[0];
            deleteFile(treeNode);
          },
          icon: 'glyphicon glyphicon-eye-open'
        }

      };
      break;
  }

  return items;
}


function uploadFile() {
  $('#hiddenUploadField').click();
  $("#notificaciones").empty();
  $("#notificaciones").html("");

}

function translateObject(node) {
  $("#notificaciones").empty();
  $("#forgeViewer").empty();
  if (node == null) node = $('#appBuckets').jstree(true).get_selected(true)[0];
  var bucketKey = node.parents[0];
  var objectKey = node.id;
  jQuery.post({
    url: '/api/forge/modelderivative/jobs',
    contentType: 'application/json',
    data: JSON.stringify({ 'bucketKey': bucketKey, 'objectName': objectKey }),
    success: function (res) {
      $("#forgeViewer").html('Traducción Iniciada, espere unos instantes..');
    },error:function(res){
        console.log("ERROR AL INTENTAR TRADUCIR");
        console.log(res);
    }
  });
}

function obtenerId(node) {
  console.log("id: " + node.id);
  console.log("nombre: " + node.text);
  console.log("parent: " + node.parents[0]);
  //console.log("proyecto: " + node.state.IsAdm);
  $.ajax({
    "url": "/api/forge/oss/bucketsProyectos",
    method: "GET",
    dataType: "json",
    success: function (result) {
      console.log(result);
    }
  })

}
function ocultarNodoPorData() {
  //Esto me trae un array de los datos del arbol
  var arr = $('#appBuckets').jstree(true).get_json('#', { no_state: true, flat: true });
  console.log(arr);
  arr.forEach(function (element) {
    if (element.text == "prueba4.rvt") {
      //este esconde el nodo seleccionado, pero cuando se refresca vuelve a aparecer, hay que pasarle un objeto
      $('#appBuckets').jstree(true).hide_node(element);
    }
  });
}

function borradoInterno(nombreProyecto){
  jQuery.post({
    url: '/eliminarAsignacionInterna',
    contentType: 'application/json',
    data: JSON.stringify({ 'namep':nombreProyecto}),
    success: function (res) {
        location.reload();
    },error:function(err){   location.reload();}
  });
}
function deleteObject(node) {
  $("#forgeViewer").empty();
  if (node == null) node = $('#appBuckets').jstree(true).get_selected(true)[0];
  var bucketKey = node.parents[0];
  var objectKey = node.id;


  jQuery.post({
    url: '/api/forge/oss/deleteObject',
    contentType: 'application/json',
    data: JSON.stringify({ 'bucketKey': bucketKey, 'objectName': objectKey }),
    success: function (res) {

     
      $("#forgeViewer").html('Por favor vuelva a intentarlo en unos minutos..');
    }, error: function (err) {
      console.log(err);
    }
  });
  

}
function deleteFile(node) {
  var objectKey = node.text;
  var bucketKey = node.parents[0];
  var objectID = node.id;

  console.log("data pre borrado");
  console.log(objectKey);
  console.log(objectID); // URN PROYECTO

  

  $("#notificaciones").html(" Se ha iniciado el proceso de  borrado para " + objectKey);

  getForgeToken(function (access_token) {
    jQuery.post({
      url: '/api/forge/oss/deleteObject',
      contentType: 'application/json',
      data: JSON.stringify({ 'bucketKey': bucketKey, 'objectName': objectKey }), function(data, textStatus) {
        $("#notificaciones").html("Gestionado Borrado " + objectKey);
      },
      success: function (res) {

        $("#notificaciones").empty();
        $("#notificaciones").html(objectKey + " Ha sido borrado exitosamente");
        borradoInterno(objectKey);
        window.location.href = window.location.href;
      }, error: function (err) {
        console.log(err);
        $("#notificaciones").empty();
        $("#notificaciones").html(objectKey + " Ha sido borrado exitosamente");
        $('#appBuckets').jstree(true).destroy();
        prepareAppBucketTree();
        borradoInterno(objectKey);
        $("#forgeViewer").empty();
        callProyectosSeleccion();
        location.reload();
      }
    });

  });

  function get2LegToken(onSuccess, onError) {
    if (onSuccess) {
    
      MyVars.ajaxCalls.push(
        fetch('/api/forge/oauth/token').then(res => {
          res.json().then(data => {
            onSuccess(data.access_token, data.expires_in);
          });
        })
      );
    } else {
      console.log(
        "Returning saved 3 legged token (User Authorization): " + MyVars.token2Leg
      );
  
      return MyVars.token2Leg;
    }
  
   
  }
}
