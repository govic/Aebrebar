
$(document).ready(function () {
  prepareAppBucketTree();
  callProyectosSeleccion();
   $('#refreshBuckets').click(function () {
     $('#appBuckets').jstree(true).refresh();
   });
 
   $('#createNewBucket').click(function () {
     createNewBucket();
   });
 
   $('#createBucketModal').on('shown.bs.modal', function () {
     $("#newBucketKey").focus();
   })
 
   $('#hiddenUploadField').change(function () {
     var node = $('#appBuckets').jstree(true).get_selected(true)[0];
     var _this = this;
     if (_this.files.length == 0) return;
     var file = _this.files[0];
     switch (node.type) {
       case 'bucket':
         var formData = new FormData();
         formData.append('fileToUpload', file);
         formData.append('bucketKey', node.id);
 
         $.ajax({
           url: '/api/forge/oss/objects',
           data: formData,
           processData: false,
           contentType: false,
           type: 'POST',
           success: function (data) {
             $('#appBuckets').jstree(true).refresh_node(node);
             _this.value = '';
           }
         });
         break;
     }
   });
 });
 
 function savePoryecto(){
 
 }
 function cargarProyecto(){
   
   var q =  document.getElementById("proyectos_disponibles").value;
  // alert(q);
 
   console.log("DATA NOMBRE");
   console.log(q);
   console.log("DATA IDS");
   console.log(q);
 
   jQuery.post({
     url: '/vista',
     contentType: 'application/json',
     data:  JSON.stringify({ 'nombre': q}),
     success: function (res) {
       
     },
   });
 
 }

 function cargarProyecto2(){
   
  //var q =  document.getElementById("proyectos_disponibles").value;
 // alert(q);

  console.log("DATA NOMBRE");
  console.log(q);
  console.log("DATA IDS");
  console.log(q);

  jQuery.post({
    url: '/vista',
    contentType: 'application/json',
    data:  JSON.stringify({ 'nombre': q}),
    success: function (res) {
      
    },
  });

}
 
 function callProyectosSeleccion(){
   $("#forgeViewer").empty();
     getForgeToken(function (access_token) {
        jQuery.ajax({
          url: '/api/forge/oss/bucketsProyectos',
          headers: { 'Authorization': 'Bearer ' + access_token },
          success: function (res) {
            console.log(res);
            let dropdown = "";
             for (i = 0; i < res.length; i++) {
               
              dropdown = dropdown+  "<option class='slide-item' href='#' value='"+res[i].urn+"'>"+res[i].objectKey+"</option>";
              // dropdown = dropdown+ "<a href='#' class='dropdown-item' onclick='openViewer("+"\""+res[i].urn+"\""+")'>"+res[i].objectKey+"</a>"
                
             }  
             document.getElementById("proyectos_disponibles").innerHTML = dropdown;
          },
          error: function (err) {
            console.log("error");
            console.log(err);
          }
        });
      })
 }
 function openViewer(urn){
    launchViewer(urn);
     getForgeToken(function (access_token) {
         jQuery.ajax({
           url: 'https://developer.api.autodesk.com/modelderivative/v2/designdata/' + urn + '/manifest',
           headers: { 'Authorization': 'Bearer ' + access_token },
           success: function (res) {
             if (res.status === 'success') launchViewer(urn);
             else $("#forgeViewer").html('La traducción está en curso: ' + res.progress + '. Por favor vuelva a intentarlo en unos minutos.');
           },
           error: function (err) {
             var msgButton = 'El archivo no ha sido traducido aún ' +
               '<button class="btn btn-xs btn-info" onclick="translateObject()"><span class="glyphicon glyphicon-eye-open"></span> ' +
               'Iniciar traducción</button>'
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
   $('#appBuckets').jstree({
     'core': {
       'themes': { "icons": true },
       'data': {
         "url": '/api/forge/oss/buckets',
         "dataType": "json",
         'multiple': false,
         "data": function (node) {
           return { "id": node.id };
         }
       }
     },
     'types': {
       'default': {
         'icon': 'glyphicon glyphicon-question-sign'
       },
       '#': {
         'icon': 'glyphicon glyphicon-cloud'
       },
       'bucket': {
         'icon': 'glyphicon glyphicon-folder-open'
       },
       'object': {
         'icon': 'glyphicon glyphicon-file'
       }
     },
     "plugins": ["types", "state", "sort"],
     //contextmenu: { items: autodeskCustomMenu }
   }).on('loaded.jstree', function () {
     $('#appBuckets').jstree('open_all');
   }).bind("activate_node.jstree", function (evt, data) {
     if (data != null && data.node != null && data.node.type == 'object') {
       $("#forgeViewer").empty();
       var urn = data.node.id;
       getForgeToken(function (access_token) {
         jQuery.ajax({
           url: 'https://developer.api.autodesk.com/modelderivative/v2/designdata/' + urn + '/manifest',
           headers: { 'Authorization': 'Bearer ' + access_token },
           success: function (res) {
             if (res.status === 'success'){ 
                console.log("activo new modelo");
              launchViewer(urn);}
             else {$("#forgeViewer").html('Traducción en curso: ' + res.progress + '. Por favor espere unos momentos.');}
           },
           error: function (err) {
             var msgButton = 'Este Archivo no ha sido traducido aún ' +
               '<button class="btn btn-xs btn-info" onclick="translateObject()"><span class="glyphicon glyphicon-eye-open"></span> ' +
               'Iniciar traducción</button>'
             $("#forgeViewer").html(msgButton);
           }
         });
       })
     }
   });
 }
 function traduceObjeto(){
 
     var treeNode = $('#appBuckets').jstree(true).get_selected(true)[0];
             translateObject(treeNode);
 }
 function uploadArchivo(){
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
 
   switch (autodeskNode.type) {
     case "bucket":
       items = {
         uploadFile: {
           label: "Subir nuevo Archivo",
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
           label: "Translate",
           action: function () {
             // BUSCA OBJETO SELECCIONADO
             var treeNode = $('#appBuckets').jstree(true).get_selected(true)[0];
             translateObject(treeNode);
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
 }
 
 function translateObject(node) {
   $("#forgeViewer").empty();
   if (node == null) node = $('#appBuckets').jstree(true).get_selected(true)[0];
   var bucketKey = node.parents[0];
   var objectKey = node.id;
   jQuery.post({
     url: '/api/forge/modelderivative/jobs',
     contentType: 'application/json',
     data: JSON.stringify({ 'bucketKey': bucketKey, 'objectName': objectKey }),
     success: function (res) {
       $("#forgeViewer").html('Traduciendo, vuelva a intentarlo en unos minutos.');
     },
   });
 }
 
 