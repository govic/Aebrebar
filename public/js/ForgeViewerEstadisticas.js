var viewer;
var regex = /(\d+)/g;
var filtro_a;
var pedidosTotalarr =[];
var resultadoCVS = [];
var resultadoPesosDiametros =[];
var contador_pedidos = 0;
var matriz_largos =[];
var  largosDiametro =[];
var arr_pedidos = [];
var totalTabla1 =[];
var matriz_pedidos =[];
var listado_largosDiametro = [];
var registro_ultimo_filtro ;
var resultadoLargodiametrosPedido = Array();
var resultadoActual = Array();
var PedidosLargoDiametro = Array();
var id_pedidos_guardados =[];
var sumatoria_pesos =0;
var nombre_add_actual;
var pesos_piso1,pesos_piso2,pesos_piso3,pesos_piso4,pesos_piso5,pesos_piso6 =0;
var pesos_ha1=0 ;
var pesos_ha2=0 ;
var pesos_ha3 =0 ;
var pesos_ha4=0 ;
var pesos_ha5=0 ;
var pesos_ha6 =0 ;
var labels_graf = Array();
  var valores_pesos_pedidos = Array();
var pesoTotal = 0;
//var datos;
var filtro1 = false;
var filtro2 = false;
var filtro3 = false;
var referencia2 = Array();
var valor_fil1;
var valor_fil2;
var diametros = [];
var filtros_selec_piso = [];
var filtros_selec_ha = [];
var filtros_general =[];
var ids_task = [];
var ids_subtask = [];
var cont_id_task = 1000;
var cont_id_subtask = 10000;
var hoy = 18 + '-' +10 + '-' +2021;
var  idsSeleccionados =[];
var filtros_pintura;
var estado_filtro = 0;
var ids_plan =[];
var ids_bd =[];
var ids_db_update =[];
var ids_db_insert =[];
var listado_pesos = "";
var listado_largos = "";
var red = new THREE.Vector4(1, 0, 0, 0.5);


function generarCVS(ar,nombre) {
	//comprobamos compatibilidad
	if (window.Blob && (window.URL || window.webkitURL)) {
		var contenido = "",
			d = new Date(),
			blob,
			reader,
			save,
			clicEvent;
		//creamos contenido del archivo
		for (var i = 0; i < ar.length; i++) {
			//construimos cabecera del csv
			if (i == 0) contenido += Object.keys(ar[i]).join(";") + "\n";
			//resto del contenido
			contenido +=
				Object.keys(ar[i])
					.map(function (key) {
						return ar[i][key];
					})
					.join(";") + "\n";
		}
		//creamos el blob
		blob = new Blob(["\ufeff", contenido], { type: "text/csv" });
		//creamos el reader
		var reader = new FileReader();
		reader.onload = function (event) {
			//escuchamos su evento load y creamos un enlace en dom
			save = document.createElement("a");
			save.href = event.target.result;
			save.target = "_blank";
			//aquí le damos nombre al archivo
			save.download =
      nombre +
				".csv";
			try {
				//creamos un evento click
				clicEvent = new MouseEvent("click", {
					view: window,
					bubbles: true,
					cancelable: true
				});
			} catch (e) {
				//si llega aquí es que probablemente implemente la forma antigua de crear un enlace
				clicEvent = document.createEvent("MouseEvent");
				clicEvent.initEvent("click", true, true);
			}
			//disparamos el evento
			save.dispatchEvent(clicEvent);
			//liberamos el objeto window.URL
			(window.URL || window.webkitURL).revokeObjectURL(save.href);
		};
		//leemos como url
		reader.readAsDataURL(blob);
	} else {
		//el navegador no admite esta opción
		alert("Su navegador no permite esta acción");
	}
}

function savePlan(){
  let valores = document.getElementById("id_seleccionados2").value;
  console.log('IDS SELECCIONADOS PLAN SAVE()');
  console.log(valores);
  let arr_vals = valores.split(',');
  let plan = document.getElementById("plan2").value;
  let base = document.getElementById("dateMask2").value;
  for(let r =0; r< arr_vals.length;r++){
    let ac = parseInt(''+ arr_vals[r],0);
    // guarda valor actual de id A INSERTAR O UPDATEAR
    console.log("valor ac :"+ac);
    console.log(existeId(ac));
    if(existeId(ac)== false){
      console.log('INSERTO OBJETO NO EXISTENTE');
      console.log(plan+" "+base+" "+ac);
      getDBIds_insert(plan,base,ac);
      ids_bd =[];
      getDBIds();
      getPlanObj();
     
    }
    else{
      console.log('UPDATE OBJETO  EXISTENTE');
      console.log(plan+" "+base+" "+ac);
      getDBIds_update(plan,base,ac);
      ids_bd =[];
      getDBIds();
      getPlanObj();
    }
  }
}
function consultaPlan(idBuscado){
  for(var e = 0 ; e<ids_plan.length;e++){
    if(ids_plan[e][0]==idBuscado){
      console.log('FECHA ENCONTRADA ID : '+idBuscado);
      console.log(ids_plan[e][2]);
      return ""+ids_plan[e][2];
    }
  }
  return -1;
}


function getPlanObj(){
 // ids_plan = [];
  ids_plan.splice(0, ids_plan.length);
  jQuery.get({
    url: '/listaDBIDSPlan',
    contentType: 'application/json',
    success: function (res) {
      console.log("RESULTADO Get server");
     console.log(res);
     console.log(typeof res);
     console.log(res.length);
     console.log(typeof res[0]);
    // $('#vistas_previas').innerHTML = "";
     console.log("RESULTADO Get PLAN SERVER");

     for(let r = 0; r<res.length; r++){
        ids_plan.push(Object.values(res[r]));
        
    }
    console.log("PLAN OBJETOS LISTADO")
    console.log(ids_plan);
}
});
}
function saveHormigonado(){
  let valores = document.getElementById("id_seleccionados2").value;

  console.log('selecccionados ids');
  console.log(valores);
  let arr_vals = valores.split(',');
  let plan = document.getElementById("plan1").value;
  let base = document.getElementById("dateMask2").value;
  for(let r =0; r< arr_vals.length;r++){
    let ac = parseInt(''+ arr_vals[r],0);
    // guarda valor actual de id A INSERTAR O UPDATEAR
    console.log("valor ac :"+ac);
    console.log(existeId(ac));
    if(existeId(ac)== false){
      console.log('INSERTO OBJETO NO EXISTENTE');
      console.log(plan+" "+base+" "+ac);
      getDBIds_insert(plan,base,ac);
      ids_bd =[];
      getDBIds();
      getPlanObj();
     
    }
    else{
      console.log('UPDATE OBJETO  EXISTENTE');
      console.log(plan+" "+base+" "+ac);
      getDBIds_update(plan,base,ac);
      ids_bd =[];
      getDBIds();
      getPlanObj();
    }
  }
  
}

function isValidDate(date) {
  var temp = date.split('/');
  var d = new Date(temp[1] + '/' + temp[0] + '/' + temp[2]);
   return (d && (d.getMonth() + 1) == temp[1] && d.getDate() == Number(temp[0]) && d.getFullYear() == Number(temp[2]));
}
function validarFormatoFecha_slach(campo) {
  var RegExPattern = /(0[1-9]|1\d|2\d|3[01])\/^(0[1-9]|1[0-2])\/(19|20)\d{2}$/;

  
  if ((campo.match(RegExPattern)) && (campo!='')) {
       
      let v = campo.split("/");
      let dd = parseInt(v[0]);
      let mm = parseInt(v[1]);
      let yy = parseInt(v[2]);
      
      if(!(v[0].match(/^([0-9])*$/) && dd<=32 && dd>=0)){
        return true;
      }else{
        return false;
      }
        
  } else {
        return false;
  }
}
function validarFormatoFecha_guion(campo) {
  var RegExPattern = /^\d{1,2}\-\d{1,2}\-\d{2,4}$/;
  if ((campo.match(RegExPattern)) && (campo!='')) {
        return true;
  } else {
        return false;
  }
}

function getDBIds(){
  jQuery.get({
    url: '/listaDBIDS',
    contentType: 'application/json',
    success: function (res) {
      console.log("RESULTADO Get server");
     console.log(res);
     console.log(typeof res);
     console.log(res.length);
     console.log(typeof res[0]);
    // $('#vistas_previas').innerHTML = "";
     console.log("RESULTADO Get server2");

     for(let r = 0; r<res.length; r++){
        ids_bd.push(Object.values(res[r]));
        
    }


    
      console.log( ids_bd.length);
     
      console.log( ids_bd);
    
  
  
    },
  });
}

function getDBIds_update(plan,base,id){

  jQuery.post({
    url: '/updateDBIDS',
    contentType: 'application/json',
    data:  JSON.stringify({ 'fecha_plan': ''+plan+'','fecha_base':''+base+'', 'dbId': ''+id+'' }),
    success: function (res) {
      console.log('RESULTADO UPDATE BD');
      console.log(res);
    },
  });


}

function getDBIds_insert(plan,base,id){
  jQuery.post({
    url: '/insertDBIDS',
    contentType: 'application/json',
    data:  JSON.stringify({ 'fecha_plan': ''+plan+'','fecha_base':''+base+'', 'dbId': ''+id+'' }),
    success: function (res) {
      console.log('RESULTADO UPDATE BD');
      console.log(res);
    },
    error: function( jqXHR, textStatus, errorThrown ) {
      console.log('ERROR AL INSERTAR');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    }

  });
}

function existeId(idBuscado){
  let b = parseInt(idBuscado+'',0);
  //console.log('BUSCADO');
  //console.log(b);
 // console.log(ids_bd.length);
  if(ids_bd.length>0){
    for(var a = 0; a<ids_bd.length;a++){
    //  console.log('BUSCAnDO');
    //  console.log(ids_bd[a]);
    //  console.log(b +' comp '+ ids_bd[a][0]);
    //  console.log(typeof b +' comp '+ typeof ids_bd[a][0]);
      if(b == ids_bd[a][0]){
   //     console.log('ENCONTRE ID BUSCADO OBSJET')
        return ids_bd[a];
      }
    }
    return false;
  }
  else{
    return false;
  }
}

function handleObjectLoaded(){


}

function getFiltros() {

  console.log("MUESTRA GET FILROS!!!!");
 
      let filtrado = [filtro_1];
      let filtro_boton = "['"+filtro_1+"' ]";
      Pintar_Categorias_reflow();
      consulta_filtro(filtrado).then((data) => {
                let keys = Object.keys(data);
                let datos = keys;
                console.log("vienen datos");
                console.log("Filtro 1 y 2:"+ datos);
               console.log("keys iniciales");
                console.log(keys);
                var i;
                var botones =botones+ "<option value=\"'sin valor' \" >Sin Valor</option>";
                
                for (i = 0; i < datos.length; i++) {
                    var botones =botones+ "<option value=\""+datos[i]+"\" >"+datos[i]+"</option>";
                //    var botones =botones+ "<option value=\" "+datos[i]+"\" onclick=\"selecciona("+"\'"+datos[i]+"\'"+ ","+filtro_boton+" );\">"+datos[i]+"</a>";

                }
              
           });

/**************************************************************
 * INICIO CREACIÓN DE GANTT
 * 
 * 
 * AEC PISO
 * 
 * 
 */

// BUSCA FILTROS PARA AEC PISO Y CONSTRUYE ESTRUCTURA GANTT APROVECHA QUE ESTE FILTRO SEPARA POR PISOS
     // filtrado = ['AEC Piso'];
     filtrado = [filtro_2]; 
   //  filtro_boton = "['AEC Piso']";
     filtro_boton = "['"+filtro_2+"']";
      var resultado_ids;
      var elementos;
     
      var pesoTotal = 0;
      var largoTotal = 0;
      var xTotal = 0;
     
      var tableTotales = document.getElementById('tabla_total');
      var tableRef = document.getElementById('tabla_fierro');


      consulta_filtro(filtrado).then((data) => {
                let keys = Object.keys(data);
                let datos = keys;
               console.log("Filtro 2:"+ datos);
             //   filtro_gantt( [keys[0]]);
               filtros_pintura=[keys[0]];
              filtros_pintura=[keys[0],keys[1]];
              filtros_general = [keys[0]];
              // filtro_gantt_inicio( [keys[0]]);
               

             //   console.log("keys iniciales");
             //   console.log(keys);
                var i;
                var botones= "";
                let filtros_sel = Object.values(keys[0]);
                console.log("");
                elementos = buscaKeys(filtros_sel ,keys);
             //   var botones =botones+ "<option value=\"'sin valor' \" >Sin Valor</option>";
                for (i = 0; i < datos.length; i++) {
                  
                
                 
                    botones =botones+ "<option value=\""+datos[i]+"\" >"+datos[i]+"</option>";
                }

               console.log("Idsss");
                console.log(ids_task);
             
          
           });

      
}

async function generaEstadisticas(){

}


function getFiltros_2() { 
      
      let filtrado = [filtro_1];
      let filtro_boton = "['"+filtro_1+"' ]";

      consulta_filtro(filtrado).then((data) => {
                let keys = Object.keys(data);
                let datos = keys;
              //  console.log("vienen datos");
              //  console.log("Filtro 1 y 2:"+ datos);
              //  console.log("keys iniciales");
              //  console.log(keys);
                var i;
                var botones =botones+ "<option value=\"'sin valor' \" >Sin Valor</option>";
                
                for (i = 0; i < datos.length; i++) {
                     botones =botones+ "<option value=\""+datos[i]+"\" >"+datos[i]+"</option>";
                //    var botones =botones+ "<option value=\" "+datos[i]+"\" onclick=\"selecciona("+"\'"+datos[i]+"\'"+ ","+filtro_boton+" );\">"+datos[i]+"</a>";

                }
                // inserta opciones de filtro  para AEC PARTICIÓN HA
                document.getElementById("ha_option").innerHTML = botones;
           });
         
/**************************************************************
 * INICIO CREACIÓN DE GANTT
 * 
 * 
 * AEC PISO
 * 
 * 
 */

// BUSCA FILTROS PARA AEC PISO Y CONSTRUYE ESTRUCTURA GANTT APROVECHA QUE ESTE FILTRO SEPARA POR PISOS
     // filtrado = ['AEC Piso'];
     filtrado = [filtro_2]; 
   //  filtro_boton = "['AEC Piso']";
     filtro_boton = "['"+filtro_2+"']";
      var resultado_ids;
      var elementos;
     
 
      consulta_filtro(filtrado).then((data) => {
                let keys = Object.keys(data);
                let datos = keys;
            //   console.log("Filtro 2:"+ datos);
               // filtro_gantt( [keys[0]]);
               filtro_gantt_inicio( [keys]);
           //    console.log("keys iniciales");
           //    console.log(keys);
                var i;
                var botones= "";
                let filtros_sel = Object.values(keys[0]);
                elementos = buscaKeys(filtros_sel ,keys)
                for (i = 0; i < datos.length; i++) {
                  
                
                 ///// CREA ESTRUCTURA INICIAL////////////////////////////
                  //////////////////////////////////MUROS -////////////////////////////
                  var taskId = gantt.addTask({
                    id:cont_id_task,
                    text:datos[i],
                    start_date:hoy,
                    type: gantt.config.types.project,
                    duration:1
                  },13,1);
                  ids_task.push(cont_id_task);
                  cont_id_task++;
               
                             
                  
                  ////////////////////////////////VIGAS/////////////////////////
                  
                
                  var taskId = gantt.addTask({
                    id:cont_id_task,
                    text:datos[i],
                    start_date:hoy,
                    type: gantt.config.types.project,
                    duration:1
                  },14,1);
                  ids_task.push(cont_id_task);
                  cont_id_task++;
               
                   ////////////////////////////////LOSAS/////////////////////////
                  
                  var taskId = gantt.addTask({
                    id:cont_id_task,
                    text:datos[i],
                    start_date:hoy,
                    type: gantt.config.types.project,
                    duration:1
                  },15,1);  
                  ids_task.push(cont_id_task);
                  cont_id_task++;
               
                   ////////////////////////////////LOSAS/////////////////////////
                  
                  var taskId = gantt.addTask({
                          id:cont_id_task,
                          text:datos[i],
                          start_date:hoy,
                          type: gantt.config.types.project,
                          duration:1
                        },20,1);  
                        ids_task.push(cont_id_task);
                        cont_id_task++;

                   ////////////////////////////////REBAR/////////////////////////   
               //    console.log("valor estructrura!!!!!! "+ datos[i]);     
                        var taskId = gantt.addTask({
                          id:cont_id_task,
                          text:datos[i],
                          start_date:hoy,
                          type: gantt.config.types.project,
                          duration:1
                        },24,1);  
                        ids_task.push(cont_id_task);
                        cont_id_task++;                         

                   // var botones =botones+ "<a class=\"dropdown-item\" onclick=\"selecciona2("+"\'"+filtro_boton+"\'"+ ","+filtro_boton+" );\">"+datos[i]+"</a>";
                   var botones =botones+ "<option value=\""+datos[i]+"\" >"+datos[i]+"</option>";
                }

            //    console.log("Idsss");
            //    console.log(ids_task);
             
           //     gantt.render();
                document.getElementById("piso_option").innerHTML = botones;
                //  document.getElementById("selectores2").innerHTML = botones;

                // PEGA LOS BOTONES PARA FILTRAR SEGUN PARÁMETROS
           });

           // ELIGE LOS NIVELES PARA EL PARÁMETRO ELEGIDO (PISO ) CREE LA GANTT 
         //  filtros_selec_piso =    ["00.- Radier EDA","01.- Cielo 1° Piso EDA","03.- Cielo 3° Piso EDA","04.- Cielo 4° Piso EDA",,"05.- Cielo 5° Piso EDA"]; 
}

function savePedido(){

  var ids_pedido = $("#id_seleccionados4").val();
 
  var q =  $("#fecha_pedido_fierro").val();
  var nombre_pedido = $("#nombre_pedido").val();

  var largos_pedidos = $("#listado_largo").val();
  var pesos_pedidos = $("#listado_pesos").val();

  var total_largo = $("#largo_total_pedido").val();
  var total_peso= $("#peso_total_pedido").val();
  var total_resultado = $("#resultado_total_pedido").val();
   console.log("VALOR PREVIO ENVIO ORDENES");
   console.log(pesos_pedidos);
   console.log(largos_pedidos);
   let datas = JSON.stringify({ 'ids': ids_pedido, 'fecha': q,'pesos':total_peso,'largo':total_largo,'listado_largos':largos_pedidos,'listado_pesos':pesos_pedidos,'nombre_pedido':nombre_pedido });
   const listadoIds = ids_pedido.split(",");
   var encontro_elemento = 0;
   jQuery.get({
    url: '/getOrdenes',
    contentType: 'application/json',
    success: function (res) {
      $list_pedidos = "";
      $fila = "";
     for(let r = 0; r<res.length; r++){
          //   ids_bd.push(Object.values(res[r]));
         $fila = "";
         console.log("VALOR EXISTE");
          console.log(res[r].ids);
          let ids_buscados = res[r].ids.split(",");
          for(var t=0;t<ids_buscados.length-1 ;t++){
             
              let existe = listadoIds.includes(ids_buscados[t]);
              
              console.log(existe);
              console.log(ids_buscados[t]);
              if(existe){
                console.log("si existe");
                console.log(existe);
                console.log(ids_buscados[t]);
                encontro_elemento = 1;
                $("#modaldemo15").modal("toggle")
                break;
              }
          }
          if(encontro_elemento== 1){
            
            break;
          }
         
       
       
    }
    if(encontro_elemento == 0){
    
      guardarPostRevision();
      $('#modaldemo15').modal('toggle');

      $("#id_seleccionados4").val('');
      $("#fecha_pedido_fierro").val('');
      $("#nombre_pedido").val('');

      $("#listado_largo").val('');
      $("#listado_pesos").val('');

      $("#largo_total_pedido").val('');
      $("#peso_total_pedido").val('');
      $("#resultado_total_pedido").val();
    }
   
  
    }, error: function (res) {
        console.log("ERROR GET ORDENES");
        console.log(res);
    
    }
  });


  
}
function closeNegacionOrden(){
  $('#modaldemo15').modal('toggle');
}
function guardarPostRevision(){
  $('#modaldemo15').modal('toggle');
  var ids_pedido = $("#id_seleccionados4").val();
  var q =  $("#fecha_pedido_fierro").val();
  var nombre_pedido = $("#nombre_pedido").val();

  var largos_pedidos = $("#listado_largo").val();
  var pesos_pedidos = $("#listado_pesos").val();

  var total_largo = $("#largo_total_pedido").val();
  var total_peso= $("#peso_total_pedido").val();
  var total_resultado = $("#resultado_total_pedido").val();
   console.log("VALOR PREVIO ENVIO ORDENES");
   console.log(pesos_pedidos);
   console.log(largos_pedidos);
   let datas = JSON.stringify({ 'ids': ids_pedido, 'fecha': q,'pesos':total_peso,'largo':total_largo,'listado_largos':largos_pedidos,'listado_pesos':pesos_pedidos,'nombre_pedido':nombre_pedido });
 
  jQuery.post({
    url: '/saveOrdenes',
    contentType: 'application/json',
    data:  JSON.stringify({ 'ids': ids_pedido, 'fecha': q,'pesos':total_peso,'largo':total_largo,'listado_largos':largos_pedidos,'listado_pesos':pesos_pedidos,'nombre_pedido':nombre_pedido }),
  
    success: function (res) {
      console.log("ingreso ordenesA exitoso");
      console.log(res);
      loadPrevisualizaciones();
      getOrdenes();
    },error:function(res){
      
      console.log("ingreso ordenesA fallo");
      console.log(datas);
      console.log(res);
    }
  }); 
  getOrdenes();

}

function saveAddPedido(){

  var cantidad_pedido_add = $("#cantidad_pedido_add").val();
  var nombre_pedido       = nombre_add_actual;
  
  var diametro_pedido_add = $("#diametro_pedido_add").val();
  var largo_pedido_add    = $("#largo_pedido_add").val();
 
  
   console.log("VALOR PREVIO ENVIO ADD ORDENES ORDENES "+nombre_pedido);
 
   let datas = JSON.stringify({ 'nombre_pedido': nombre_pedido, 'cantidad': cantidad_pedido_add,'diametro':diametro_pedido_add,'largo':largo_pedido_add });
   console.log( datas);

   jQuery.post({
    url: '/saveAddOrdenes',
    contentType: 'application/json',
    data:  JSON.stringify({'nombre_pedido': nombre_pedido, 'cantidad': cantidad_pedido_add,'diametro':diametro_pedido_add,'largo':largo_pedido_add}),
  
    success: function (res) {
      console.log("ingreso ordenes ADICIONALES exitoso");
      console.log(res);
      loadPrevisualizaciones();
      getOrdenes();
    },error:function(res){
      
      console.log("ingreso ordenesA fallo");
      console.log(datas);
      console.log(res);
    }
  }); 
  getOrdenes();
}
function saveOrdenes(){


  jQuery.get({
    url: '/saveOrdenes',
    contentType: 'application/json',
    success: function (res) {
      console.log("RESULTADO Get server");
     console.log(res);
     console.log(typeof res);
     console.log(res.length);
     console.log(typeof res[0]);
    // $('#vistas_previas').innerHTML = "";
     console.log("RESULTADO Get server2");

     for(let r = 0; r<res.length; r++){
        ids_bd.push(Object.values(res[r]));
        
    }
    getOrdenes();

    
      console.log( ids_bd.length);
     
      console.log( ids_bd);
    
  
  
    },
  });
}
function eliminar_orden(indice){
  jQuery.post({
    url: '/deleteOrdenes',
    contentType: 'application/json',
    data:  JSON.stringify({ 'ids': id_pedidos_guardados[indice] }),
    success: function (res) {
    
    },
  }); 
  getOrdenes();
}
function pintar_all_orden(){
  var general_ordenes = [];
  let z = "";
  for(let y =0; y<id_pedidos_guardados.length;y++){
      z = z+","+id_pedidos_guardados[y];
  }
  var c = z.split(',').map(function(item) {
    return parseInt(item, 10);
});
 console.log("total id ordenes pintado");
 console.log(c);
 const color10 = new THREE.Vector4(0.0235, 0.1961,0.9765, 0.5);
  // alert(id_para_pintar);
  for(g=1; g<c.length;g++){
    if(c[g]){
      viewer.setThemingColor(parseInt(c[g]+'',0),color10, null,true);
    }
  
  }
  
}
function filtrar_all_orden(){
  var general_ordenes = [];
  let z = "";
  for(let y =0; y<id_pedidos_guardados.length;y++){
      z = z+","+id_pedidos_guardados[y];
  }
  var c = z.split(',').map(function(item) {
    return parseInt(item, 10);
});
 console.log("total id ordenes");
 console.log(c);
 console.log(id_pedidos_guardados);
 
   viewer.isolate(c);
   viewer.fitToView(c, viewer.model);
}
function filtra_orden(indice){
 var general_ordenes = [];


  var c = id_pedidos_guardados[indice].split(',').map(function(item) {
    return parseInt(item, 10);});
  console.log("ACTIVADO");
  viewer.isolate(c);
  viewer.fitToView(c, viewer.model);
  var nombre_actual =  nombre_pedidos[indice];
  nombre_add_actual = nombre_pedidos[indice];
  var fecha_actual  =  fecha_pedidos[indice];
  var ids_actual    =  id_pedidos_guardados[indice];
  $("#nombre_pedido_resumen").html("");
  $("#nombre_pedido_resumen").html(nombre_actual);
  $("#nombre_pedido_resumen2").html(nombre_actual);
  document.getElementById("nombre_pedido_resumen2").value = nombre_actual;
  //$("#nombre_pedido_resumen2").html(nombre_actual);
  

  $("#fecha_pedido_resumen").html("");
  $("#fecha_pedido_resumen").html(fecha_actual);

  jQuery.post({
    url: '/getAdicionalesOrdenes',
    contentType: 'application/json',
    data:  JSON.stringify({'nombre_actual': nombre_actual}),
  
    success: function (res) {
      console.log("RESULTADO ADD ORDENES");
      console.log(res);
      $2 = "";
      $fila = "";
      $('#body_adicionales').innerHTML = "";
      $fila = "";
      var $list_pedidos2 ="<tr><th>Cantidad</th><th>Largo</th><th>Diametro</th></tr>";
      for(let r = 0; r<res.length; r++){
      //   ids_bd.push(Object.values(res[r]));
         $fila = "";
         console.log("nombre pedido A");
        // console.log(Object.values(res[r]));
         $fila =  "<tr>"+"<td>"+res[r].cantidad+"</td>" +"<td>"+res[r].largo+"</td>" + "<td>"+res[r].diametro+"</td>" +"</tr>";
         $list_pedidos2 = $list_pedidos2 +$fila;
         console.log(res[r].nombre_pedido);
        
     }
     console.log("pedidos adicionales");
     console.log($list_pedidos2 );
     
     


    
    $("#body_adicionales").html($list_pedidos2);

    
       console.log( ids_bd.length);
     
       console.log( ids_bd);
    
  
  
    }, error: function (res) {
        console.log("ERROR GET ORDENES");
        console.log(res);
    
    }
  });

 
}
function getOrdenes(){
  id_pedidos_guardados = [];
  nombre_pedidos = [];
  fecha_pedidos =[];
  labels_graf.length = 0;
  valores_pesos_pedidos.length = 0;
  jQuery.get({
    url: '/getOrdenes',
    contentType: 'application/json',
    success: function (res) {
    
      console.log("RESULTADO Get server GeT oRDENES");
     console.log(res);
     console.log(typeof res);
     console.log(res.length);
     console.log(typeof res[0]);
    // $('#vistas_previas').innerHTML = "";
    

    $list_pedidos = "";
    $fila = "";
     for(let r = 0; r<res.length; r++){
        labels_graf.push("'"+res[r].fecha+"'");
        valores_pesos_pedidos.push(res[r].pesos);
     //   ids_bd.push(Object.values(res[r]));
        $fila = "";
        console.log("nombre pedido A");
        console.log(Object.values(res[r]));
      //  $fila =  "<tr>"+"<th scope='row'>"+res[r].fecha+"</th>"+"<td>"+res[r].pesos+"</td>"+"<td>"+res[r].nombre_pedido+"</td>"+"<td><button class='btn btn-success btn-block'onclick='filtra_orden("+r+")'>Visualizar</button><button class='btn btn-danger btn-block' onclick=eliminar_orden("+r+")>Borrar</button></td>" + "</tr>";
      //  $list_pedidos = $list_pedidos +$fila;
         console.log("ORDENES PARA GRAFICO");  
         console.log(res[r].nombre_pedido);
       
        //id_pedidos_guardados.push(res[r].ids);
        //nombre_pedidos.push(res[r].nombre_pedido);
        //fecha_pedidos.push(res[r].fecha);
    }
    console.log("VALORES PARA GRAFICO PEDIDOS");
    console.log( labels_graf);
    console.log(valores_pesos_pedidos);
    /*
    var ctx56 = document.getElementById('chartBar56').getContext('2d');
                          new Chart(ctx56, {
                              type: 'bar',
                              data: {
                                  labels: labels_graf,
                                  datasets: [{
                                      label: '# Kgs',
                                      data: valores_pesos_pedidos,
                                      backgroundColor: '#285cf7'
                                  }]
                              },
                              options: {
                                  maintainAspectRatio: false,
                                  responsive: true,
                                  legend: {
                                      display: false,
                                      labels: {
                                          display: false
                                      }
                                  },
                                  scales: {
                                      yAxes: [{
                                          ticks: {
                                              beginAtZero: true,
                                              fontSize: 10,
                                              max: 1500,
                                              fontColor: "rgba(171, 167, 167,0.9)",
                                          },
                                          gridLines: {
                                              display: true,
                                              color: 'rgba(171, 167, 167,0.2)',
                                              drawBorder: false
                                          },
                                      }],
                                      xAxes: [{
                                          barPercentage: 0.6,
                                          ticks: {
                                              beginAtZero: true,
                                              fontSize: 11,
                                              fontColor: "rgba(171, 167, 167,0.9)",
                                          },
                                          gridLines: {
                                              display: true,
                                              color: 'rgba(171, 167, 167,0.2)',
                                              drawBorder: false
                                          },
                                      }]
                                  }
                              }
                            });
  */
  
    }, error: function (res) {
        console.log("ERROR GET ORDENES");
        console.log(res);
    
    }
  });
}
function getOrdenesURN(urnEnvio){
  id_pedidos_guardados = [];
  nombre_pedidos = [];
  fecha_pedidos =[];
  labels_graf.length = 0;
  valores_pesos_pedidos.length = 0;
  jQuery.get({
    url: '/getOrdenes',
    contentType: 'application/json',
    success: function (res) {
    
      console.log("RESULTADO Get server GeT oRDENES");
     console.log(res);
     console.log(typeof res);
     console.log(res.length);
     console.log(typeof res[0]);
    // $('#vistas_previas').innerHTML = "";
    

    $list_pedidos = "";
    $fila = "";
     for(let r = 0; r<res.length; r++){
        
        if(res[r].urn_actual== urnEnvio){
          labels_graf.push("'"+res[r].fecha+"'");
          let val_peso = parseFloat(res[r].pesos);
          valores_pesos_pedidos.push(val_peso);
          //   ids_bd.push(Object.values(res[r]));
             $fila = "";
           //  console.log("nombre pedido A");
            // console.log(Object.values(res[r]));
           //  $fila =  "<tr>"+"<th scope='row'>"+res[r].fecha+"</th>"+"<td>"+res[r].pesos+"</td>"+"<td>"+res[r].nombre_pedido+"</td>"+"<td><button class='btn btn-success btn-block'onclick='filtra_orden("+r+")'>Visualizar</button><button class='btn btn-danger btn-block' onclick=eliminar_orden("+r+")>Borrar</button></td>" + "</tr>";
           //  $list_pedidos = $list_pedidos +$fila;
              console.log("ORDENES PARA GRAFICO");  
              console.log(res[r].nombre_pedido);
            
             //id_pedidos_guardados.push(res[r].ids);
             //nombre_pedidos.push(res[r].nombre_pedido);
             //fecha_pedidos.push(res[r].fecha);
        }
       
    }
    console.log("VALORES PARA GRAFICO PEDIDOS");
    console.log( labels_graf);
    console.log(valores_pesos_pedidos);
    //alert(valores_pesos_pedidos);
    let valor_maximo = Math.max.apply(null,valores_pesos_pedidos);
    valor_maximo = valor_maximo*1.5;
    valor_maximo = parseInt(valor_maximo);
    console.log("VALOR MAXIMO "+valor_maximo);
    var ctx56 = document.getElementById('chartBar56').getContext('2d');
                          new Chart(ctx56, {
                              type: 'bar',
                              data: {
                                  labels: labels_graf,
                                  datasets: [{
                                      label: '# Kgs',
                                      data: valores_pesos_pedidos,
                                      backgroundColor: '#285cf7'
                                  }]
                              },
                              options: {
                                  maintainAspectRatio: false,
                                  responsive: true,
                                  legend: {
                                      display: false,
                                      labels: {
                                          display: false
                                      }
                                  },
                                  scales: {
                                      yAxes: [{
                                          ticks: {
                                              beginAtZero: true,
                                              fontSize: 10,
                                              max: valor_maximo,
                                              fontColor: "rgba(171, 167, 167,0.9)",
                                          },
                                          gridLines: {
                                              display: true,
                                              color: 'rgba(171, 167, 167,0.2)',
                                              drawBorder: false
                                          },
                                      }],
                                      xAxes: [{
                                          barPercentage: 0.6,
                                          ticks: {
                                              beginAtZero: true,
                                              fontSize: 11,
                                              fontColor: "rgba(171, 167, 167,0.9)",
                                          },
                                          gridLines: {
                                              display: true,
                                              color: 'rgba(171, 167, 167,0.2)',
                                              drawBorder: false
                                          },
                                      }]
                                  }
                              }
                            });
  
  
    }, error: function (res) {
        console.log("ERROR GET ORDENES");
        console.log(res);
    
    }
  });
}
async function getPedidosLago(urnEnvio){
  id_pedidos_guardados = [];
  nombre_pedidos = [];
  fecha_pedidos =[];
  labels_graf.length = 0;
  valores_pesos_pedidos.length = 0;
  identificadores = [];
  jQuery.get({
    url: '/getOrdenes',
    contentType: 'application/json',
    success: function (res) { }, error: function (res) {
      console.log("ERROR GET ORDENES");
      console.log(res);
    //  identificadores =res["ids"]; // filtrar Ids de elementos
      if(identificadores.length > 0){
           viewer.getProperties( identificadores[a], (result) => { 
        console.log("RESPUESTA para A lvl "+ a + " && "+identificadores.length);
        console.log(result);
        contador_lg = contador_lg+1;
        for(i=0 ;i< 60;i++){
          if(result.properties[i] && result.properties[i].displayName){
            let nombre_actual = ""+result.properties[i].displayName;
            if(nombre_actual ==="Category"){
              categoria_actual_obj = result.properties[i].displayValue;
              console.log("valor categoria actual5: "+categoria_actual_obj); 
               
              if(categoria_actual_obj==parametro_fierro){
                for(t=0;t<result.properties.length;t++){
                
                  let val_actual = result.properties[t].displayName;
                  if( val_actual == "RS Peso Lineal (kg/m)"){
                    console.log("ENTRO A PESO LINEAL HA");
                    let peso = parseFloat(result.properties[t].displayValue);
                    
                    console.log("ANTES PESO BUSCADO HA");
                    console.log(peso);
                    console.log(result.properties[t].displayValue);
                    console.log(result);
                  
                    peso = parseFloat(peso);
                    pesoActual = peso;
                    console.log("PESO BUSCADO HA");
                    console.log(peso);
                
             
        
                  }
                  //LARGO DE LAS BARRAS
                  if(val_actual == "Total Bar Length"){
                    console.log("TOTAL LENGTH BAR HA");
                    
                    let largo = parseFloat(result.properties[t].displayValue);
                    largo = largo.toFixed(0);
                    console.log(largo );
                    
                    largo = parseFloat(largo,0);
                    largo = largo /100;
                    largoActual = largo;
                    console.log("convertido HA "+largo);
              
                  }
                  if((t+1 )==result.properties.length){ // termina de recorrer todas las propiedades
                    let resultado_mul = pesoActual*largoActual;
                    resultado_mul.toFixed(0);
                    pesoActual = 0;
                    largoActual = 0;
                   // document.getElementById('largo').innerHTML = '' +largoTotal.toFixed(2)+ ' mtrs';
                    console.log("ANTES DE PISO");
                  
                    //   pesos_piso1 = pesoTotal;
                       pesos_ha1 =  pesos_ha1 + resultado_mul;
                       console.log("Peso ha 1 "+pesos_ha1);
                       resultado_mul = 0;
                       identificadores = Array();
                       contador_lg = 0;
                  
                   
                     if(piso == '2'){
                      
                       pesos_ha2 =  pesos_ha2 + resultado_mul;
                       console.log("Peso piso ha 2 "+pesos_ha2 +"   "+ resultado_mul );
                      // pesoTotal = 0;
                       identificadores = Array();
                       contador_lg = 0;
                     }
                     if(piso == '3'){
                      pesos_ha3 =  pesos_ha3 + resultado_mul;
                       console.log("Peso piso ha 3 "+pesos_ha3);
                     //  pesoTotal = 0;
                       identificadores = Array();
                       contador_lg = 0;
                     }
                     if(piso == '4'){
                      pesos_ha4 =  pesos_ha4 + resultado_mul;
                       console.log("Peso piso 4 "+pesos_ha4);
                      //  pesoTotal = 0;
                       identificadores = Array();
                       contador_lg = 0;
                     }
                     if(piso == '5'){
                      pesos_ha5 = pesos_ha5 + resultado_mul;
                      console.log("Peso piso ha 5 "+pesos_ha5);
                     //  pesoTotal = 0;
                      identificadores = Array();
                      contador_lg = 0;
                    }
                    if(piso == '6'){
                      pesos_ha6 = pesos_ha6 + resultado_mul;
                      console.log("Peso piso ha 6 "+pesos_ha6);
                     //  pesoTotal = 0;
                      identificadores = Array();
                      contador_lg = 0;
                    }    
                  
                   
                 }
                }
          
      
              }
            
            }
          
          }
         
        }
        
      }) 
      }
   
  }
  });

}
function getOrdenesTotalPedidos(urnEnvio){
  id_pedidos_guardados = [];
  nombre_pedidos = [];
  fecha_pedidos =[];
  labels_graf.length = 0;
  valores_pesos_pedidos.length = 0;
  var dataPedidos2 = [];
  jQuery.get({
    url: '/getOrdenes',
    contentType: 'application/json',
    success: function (res) {
    
      console.log("RESULTADO Get server GeT oRDENES");
      console.log(res);
      console.log(typeof res);
      console.log(res.length);
      console.log(typeof res[0]);

    $list_pedidos = "";
    $fila = "";
    var total_acumulado=0;

    var ListadoPedidos=[];
    let dona2 ={};
   
    console.log("PEDIDOS DONA /TOTAL");
    console.log(dataPedidos2);
    dataPedidos2 = [];
    var pedidos=[];
     for(let r = 0; r<res.length; r++){
      dona2 ={};
      let actpedido = [];
        if(res[r].urn_actual== urnEnvio){
       
          let val_peso = parseFloat(res[r].pesos);
          total_acumulado =val_peso+ total_acumulado;
         
          //   ids_bd.push(Object.values(res[r]));
             $fila = "";
 
           if(res[r].nombre_pedido !="" && val_peso !="" ){
              console.log("ORDENES PARA GRAFICO 2");  
              console.log(res[r].nombre_pedido);
              console.log(val_peso);
              dona2["label"]=res[r].nombre_pedido;
              dona2["value"]=val_peso;
              actpedido.push(res[r].nombre_pedido);
              actpedido.push(val_peso);
              pedidos.push(actpedido);
           }
           dataPedidos2.push(dona2);
        }
        
        
       
    }
    console.log("PEDIDOS DONA /TOTAL2");
    console.log(dataPedidos2);
    var valorResto = total_acumulado;
    document.getElementById('Total').innerHTML ="Peso Total Pedido : "+valorResto.toFixed(1)+" KgS";
   
    for(let e = 0;e<pedidos.length;e++){
      document.getElementById('Total').innerHTML +="<br>"+"Pedido : "+pedidos[e][0]+" - Peso "+pedidos[e][1] +"KgS";
   
    }


    pedidosTotalarr = dataPedidos2;
    document.getElementById('morrisDonut2').innerHTML ="";
    new Morris.Donut({
      element: 'morrisDonut2',
      data: dataPedidos2,
      colors: ['#FF4C33', '#F3FF33','#5BFF33','#FF33FC','#334FFF','#33FF8A','#FFB833','#33FFAC','#33CEFF'],
      resize: true,
      labelColor:"#8c9fc3"
      
    });

    
  
  
    }, error: function (res) {
        console.log("ERROR GET ORDENES");
        console.log(res);
    
    }
  });
}

function getPedidosTotal(urnEnvio){
  id_pedidos_guardados = [];
  nombre_pedidos = [];
  fecha_pedidos =[];
  labels_graf.length = 0;
  valores_pesos_pedidos.length = 0;
  jQuery.get({
    url: '/getOrdenes',
    contentType: 'application/json',
    success: function (res) {
    
      console.log("RESULTADO Get server GeT oRDENES");
     console.log(res);
     console.log(typeof res);
     console.log(res.length);
     console.log(typeof res[0]);
  
    $list_pedidos = "";
    $fila = "";
    var total_acumulado=0;
    var dataPedidos = [];
    var ListadoPedidos=[];
     for(let r = 0; r<res.length; r++){
        let dona ={};
        if(res[r].urn_actual== urnEnvio){
        
          let val_peso = parseFloat(res[r].pesos);
          let actual = [res[r].nombre_pedido,val_peso];
          ListadoPedidos.push(actual);
          total_acumulado =val_peso+ total_acumulado;
         
          //   ids_bd.push(Object.values(res[r]));
             $fila = "";
           //  console.log("nombre pedido A");
            // console.log(Object.values(res[r]));
           //  $fila =  "<tr>"+"<th scope='row'>"+res[r].fecha+"</th>"+"<td>"+res[r].pesos+"</td>"+"<td>"+res[r].nombre_pedido+"</td>"+"<td><button class='btn btn-success btn-block'onclick='filtra_orden("+r+")'>Visualizar</button><button class='btn btn-danger btn-block' onclick=eliminar_orden("+r+")>Borrar</button></td>" + "</tr>";
           //  $list_pedidos = $list_pedidos +$fila;
              console.log("ORDENES PARA GRAFICO 2");  
              console.log(res[r].nombre_pedido);
              dona["label"]=res[t].nombre_pedido;
              dona["value"]=val_peso;
             //id_pedidos_guardados.push(res[r].ids);
             //nombre_pedidos.push(res[r].nombre_pedido);
             //fecha_pedidos.push(res[r].fecha);
        }
        dataPedidos.push(dona);
       
    }

    labels_graf2 = [];
    labels_graf2.push("Acumulado");
    valores_pesos_pedidos.push(total_acumulado);
    console.log("VALORES PARA GRAFICO PEDIDOS");
    console.log( labels_graf2);
    console.log(valores_pesos_pedidos);
    //alert(valores_pesos_pedidos);
    let valor_maximo = Math.max.apply(null,valores_pesos_pedidos);
    valor_maximo = valor_maximo*1.5;
    valor_maximo = parseInt(valor_maximo);
    console.log("VALOR MAXIMO "+valor_maximo);

    document.getElementById("morrisDonut2").innerHTML = "";
    new Morris.Donut({
      element: 'morrisDonut2',
      data: dataPedidos,
      colors: ['#FF4C33', '#F3FF33','#5BFF33','#FF33FC','#334FFF','#33FF8A','#FFB833','#33FFAC','#33CEFF'],
      resize: true,
      labelColor:"#8c9fc3"
      
    });

    }, error: function (res) {
        console.log("ERROR GET ORDENES");
        console.log(res);
    
    }
  });
}
function setFechaActualPedido(){
  let date = new Date()

let day = date.getDate()
let month = date.getMonth() + 1
let year = date.getFullYear()
let fecha = ''
    if(month < 10){
      console.log(`${day}/0${month}/${year}`);
      fecha = `${day}/0${month}/${year}`;
    }else{
      console.log(`${day}/${month}/${year}`);
      fecha = `${day}/${month}/${year}`;
    }
    return fecha;
}
function getFecha(id_objeto){ 

  // BUSCA LAS FECHAS DE CADA OBJETO EN EL PARAMETRO DESIGNADO, INICIALMENTE CONSIDERAO " AEC SECUENCIA DE HORMIGONADO"

  viewer.getProperties(id_objeto, (result) => { 

    for(i=0 ;i< 60;i++){
      let nombre_actual = ""+result.properties[i].displayName;
      
      if(nombre_actual  === parametro_fecha){

        fecha_hormigonado = result.properties[i].displayValue;
        let formato_hormigonado_1 = fecha_hormigonado.indexOf("/");
        let formato_hormigonado_2 = fecha_hormigonado.indexOf("-");

        if(formato_hormigonado_1 != -1){
              let elementos_fecha = fecha_hormigonado.split("/");
            if(elementos_fecha.length>0){
              var today = new Date();
              var dd = String(today.getDate()).padStart(2, '0');
              var mm = String(today.getMonth() + 1).padStart(2, '0'); //
              var yyyy = today.getFullYear();
              if(mm>0){
                mm = mm-1; 
              }
              today = '0'+mm + '/' + dd + '/' + yyyy;
              if(elementos_fecha[1] >0){
                elementos_fecha[1] = elementos_fecha[1]-1;
              }

              var d3=  '0'+elementos_fecha[1]+"-"+elementos_fecha[0]+"-"+elementos_fecha[2]; // FECHA PLAN
              // let compara = dates.compare(today,d2);
          
              let resultado  = [result.name,d3];
        
              console.log("NombreInterno" + resultado[0]);
              return resultado;
            }
        }
        if(formato_hormigonado_2 != -1){
          let elementos_fecha = fecha_hormigonado.split("-");
          if(elementos_fecha.length>0){
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //
            var yyyy = today.getFullYear();
            if(mm>0){
               mm = mm-1; 
            }
            today = '0'+mm + '/' + dd + '/' + yyyy;
            if(elementos_fecha[1] >0){
              elementos_fecha[1] = elementos_fecha[1]-1;
            }
  
            var d3=  '0'+elementos_fecha[1]+"-"+elementos_fecha[0]+"-"+elementos_fecha[2]; // FECHA PLAN
            // let compara = dates.compare(today,d2);
         
            let resultado  = [result.name,d3];
       
            console.log("NombreInterno" + resultado[0]);
             return resultado;
          }
        }
        

       }
    }

  })  

}

function generateFile(){
  setTimeout(() => {
    exportToCsv("ReporteEstadisticas.csv",[totalTabla1]);
  },19500);
  
}


function exportToCsv(filename, rows) {

  var processRow = function (row) {
  var finalVal = '';
  for (var j = 0; j < row.length; j++) {
    var innerValue = '';
    if(row[j] === 0){
    innerValue = row[j].toString();
    }
    if(row[j]){
    innerValue = row[j].toString();
    }
    if (row[j] instanceof Date) {
    innerValue = row[j].toLocaleString();
    };
    var result = innerValue.replace(/"/g, '""');
    if (result.search(/("|,|\n)/g) >= 0)
    result = '"' + result + '"';
    if (j > 0)
    finalVal += ',';
    finalVal += result;
  }
  return finalVal + '\n';
  };

  var csvFile = '';
  for (var i = 0; i < rows.length; i++) {
    csvFile += processRow(rows[i]);
  }

  var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) { // IE 10+
  navigator.msSaveBlob(blob, filename);
  } else {
  var link = document.createElement("a");
  if (link.download !== undefined) { // feature detection
    // Browsers that support HTML5 download attribute
    var url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  }

  }


function set_visor(){
  d = document.getElementById("vistas_previas").value;
   // // // // // // // // // // // alert(d);
}
function eliminar_vista(){
  let selector = document.getElementById("tabla_vistas").value;
  jQuery.get({
    url: '/deleteVista/'+selector,
    contentType: 'application/json',
    success: function (res) {
      console.log("RESULTADO GET VISTASasssss");
     console.log(res);
    // console.log(typeof res);
    // console.log(res.length);
    // console.log(res[0]);
    $('#vistas_previas').empty();
    $('#tabla_vistas').empty();
    loadPrevisualizaciones();
    //$('#resultado_borrado_vista').append( "<b>Borrado Exitoso</b>" );
    
  
    },
  });
}
function set_clave(q){
  d = q;
  console.log("selección");
  console.log(d);
  let mensaje_1;
  let mensaje_2;
  var elem = [0];
  var referencia = Array();
  var elem  = Array();
  
  //// // // // // // // // // // alert("Valor Parámetro 1: "+valor_fil1 + "   Val. Parámetro 2: "+valor_fil2 );
 /******************************************************************************
  * 
  * 
  * CASO 1 - FILTRO PISO 
  * 
  */
  
      let filt = [parametro_nivel];
      var resultado_ids;
      consulta_filtro2([parametro_nivel]).then((data) => {
      let keys = Object.keys(data);
    
      let elementos = buscaKeys(filtros_general,keys)
      var identificadores =0;
      let dbIds =0;
     

      if(d == "1"){
        
        if(keys.length == 0 && keys){
            alert("No hay resultados");
        }
            else{
              for(var a = 0; a<keys.length;a++){
                   if(a==0){
                     dbIds = data[keys[a]].dbIds;              
                     referencia.push(dbIds);
                     identificadores = dbIds;
                   }
                   else{
                     referencia.push((data[keys[a]].dbIds));
                     identificadores = dbIds.concat(data[keys[[a]]].dbIds);
      
                     dbIds = identificadores;
                   }
              }
      
              resultado_ids = referencia;
      
            }
            console.log("IDS GENERAL");
           console.log(resultado_ids);
            let c =1;
           
            var cat_count=1;
            var esta =0;
            var categorias = Array();
            var categoria_actual;
            var indice_actual = 0;
            var id_tareas_objetos = 10000;
            var activo_hormigonado = 0;
            var fecha_objeto ="";
            var valor_aec_piso = "";
            var nivel_actual = "";
            var nombre_actua_objeto ="" ;
            for(t=0; t<resultado_ids.length;t++){
              for(var a=0; a< resultado_ids[t].length;a++){
                //  console.log("cantidad   "+resultado_ids[0].length);
                  let categoria_actual_obj ="";
                //  console.log("RESULTADO IDS");
                //  console.log(resultado_ids[0][a]);
                  let id_actual_tarea_1 = resultado_ids[t][a];
                  let id_para_pintar = parseInt(resultado_ids[t][a]);

                 let fecha_consultada =  consultaPlan(resultado_ids[t][a]);
                 if(fecha_consultada == -1){   // El 
                  console.log("NO EXISTE");
                  viewer.getProperties( resultado_ids[t][a], (result) => { 
                    console.log("PROPIEDADES OBJETO");
                    let nombre_actua_objeto  =  result.name;
                  for(i=0 ;i< 50;i++){
                  let nombre_actual = "";
               //   console.log("PROPIEDAD ACTUAL  "+result.properties[i].displayName);
          //     console.log('control error');
          //       console.log(result); 
                  if(result.properties[i].displayName != undefined || result.properties[i].length != 0|| result.properties.length != 0  ){
                      nombre_actual = ""+result.properties[i].displayName;
                   }
                    
                    if(nombre_actual ==="Category"){  // reconoce categoria a la que pertenece el elemento
                      categoria_actual_obj = result.properties[i].displayValue;
           //           console.log("CATEGORIA ACTUAL pintado: "+categoria_actual_obj);
                     
                        
                    }
                  
                    if(nombre_actual ===parametro_fecha){
                   
                   console.log("VALOR PARA HORMIGONADO: "+  result.properties[i].displayValue);
                   console.log("VALOR PARA  ID: " );
                      if( result.properties[i].displayValue != "" && result.properties[i].displayValue != "XX"   && result.properties[i].displayValue != "XXXX"  && result.properties[i].displayValue != "X"  && result.properties[i].displayValue != "xx"  && result.properties[i].displayValue != "xxxx"){
                          activo_hormigonado = 1;
                          let  fecha_hormigonado = result.properties[i].displayValue;
                          let formato_hormigonado_1 = fecha_hormigonado.indexOf("/");
                          let formato_hormigonado_2 = fecha_hormigonado.indexOf("-");
                  
                          console.log("Pinto OK"+  id_para_pintar);
                            const colorConFormato = new THREE.Vector4(0.098, 1,0.078, 1);
                         // alert(id_para_pintar);
                          viewer.setThemingColor(parseInt(id_para_pintar+'',0),colorConFormato, null,true);
                          
                        
                         // console.log("FECHA OBJETO: "+  fecha_objeto);
                      }
                      else{
                        console.log("Pinto no OK"+  id_para_pintar);
                        const color10 = new THREE.Vector4(1,0.0580,0.0235, 0.078);
                        viewer.setThemingColor(parseInt(id_para_pintar+'',0),color10, null,true);
                         console.log("NO ENTRE A HORMIGONADO: "+  fecha_objeto);
                        activo_hormigonado = 0;
                        fecha_objeto = "";
                      }
                   }
               
                   
                    }
                   
                  }) 

                 }else{
                    console.log("FECHA CONSULTADA: "+fecha_consultada);
                    console.log("respuesta parse date NUevo : "+isValidDate(fecha_consultada));
                    console.log("respuesta parse date gion : "+validarFormatoFecha_guion(fecha_consultada));
                    console.log("FECHA CONSULTADA_RECIBIDA "+ fecha_consultada +"  ///  "+resultado_ids[t][a]);  
                  

                   if(isValidDate(fecha_consultada) || validarFormatoFecha_guion(fecha_consultada)){
                    console.log("FECHA CONSULTADA: "+fecha_consultada);
                    console.log("Pinto OK "+  id_para_pintar);
                    const colorConFormato = new THREE.Vector4(0.098, 1,0.078, 1);
                    // alert(id_para_pintar);
                        viewer.setThemingColor(parseInt(id_para_pintar+'',0),colorConFormato, null,true);
                   }else
                   {
                    console.log("FECHA CONSULTADA: "+fecha_consultada);
                    console.log("Pinto no OK "+  id_para_pintar);
                    const color10 = new THREE.Vector4(1,0.0580,0.0235, 1);
                    viewer.setThemingColor(parseInt(id_para_pintar+'',0),color10, null,true);
                   }
                   
                     
                 }
                
                  id_tareas_objetos++;
                }
            }

      }
      if(d== "2"){
        console.log("ELEMENTOS VENCIDOS");
        if(keys.length == 0 && keys){
         
        }
        else{
              for(var a = 0; a<keys.length;a++){
                   if(a==0){
                     dbIds = data[keys[a]].dbIds;              
                     referencia.push(dbIds);
                     identificadores = dbIds;
                   }
                   else{
                     referencia.push((data[keys[a]].dbIds));
                     identificadores = dbIds.concat(data[keys[[a]]].dbIds);
      
                     dbIds = identificadores;
                   }
              }
      
              resultado_ids = referencia;
      
            }
            
        
            let c =1;
           
            var cat_count=1;
            var esta =0;
            var categorias = Array();
            var categoria_actual;
            var indice_actual = 0;
            var id_tareas_objetos = 10000;
            var activo_hormigonado = 0;
            var fecha_objeto ="";
            var valor_aec_piso = "";
            var nivel_actual = "";
            var nombre_actua_objeto ="" ;
            for(t=0; t<resultado_ids.length;t++){
              for(var a=0; a< resultado_ids[t].length;a++){
                //  console.log("cantidad   "+resultado_ids[0].length);
                  let categoria_actual_obj ="";
                //  console.log("RESULTADO IDS");
                //  console.log(resultado_ids[0][a]);
                  let id_actual_tarea_1 = resultado_ids[t][a];
                  viewer.getProperties( resultado_ids[t][a], (result) => { 
                    console.log("PROPIEDADES OBJETO");
                    console.log(result);
                    let nombre_actua_objeto  =  result.name;
                 // console.log("actual name  "+nombre_actua_objeto);
                 // BUSCA LAS PROPIEDADES DEL OBJETO SELECCIONADO / APROXIMA LA CANTIDAD DE PROPIEDADES DISPONIBLES A 60 
                 for(i=0 ;i< 50;i++){
                  let nombre_actual = "";
               //   console.log("PROPIEDAD ACTUAL  "+result.properties[i].displayName);
                //   console.log('control error');
              //   console.log(result); 
                  if(result.properties[i].displayName != undefined || result.properties[i].length != 0|| result.properties.length != 0  ){
                      nombre_actual = ""+result.properties[i].displayName;
                   }
                    
               
                    if(nombre_actual ===parametro_fecha){
                   
               //    console.log("VALOR PARA HORMIGONADO: "+  result.properties[i].displayValue);
                 //  console.log("VALOR PARA  ID: "+ );
                      if( result.properties[i].displayValue != "" && result.properties[i].displayValue != "XX"  ){
                          activo_hormigonado = 1;
                       //   let elementos_fecha = result.properties[i].displayValue.split("-");
                        //  fecha_objeto = elementos_fecha[0]+"-"+elementos_fecha[1]+"-"+elementos_fecha[2]; // FECHA PLAN
                         
                         /////////////calcula fecha///////////////
                         
                         
                         fecha_hormigonado = result.properties[i].displayValue;
                        let elementos_fecha = fecha_hormigonado.split("/");
                        console.log("FECHA HORMIGONADO PRECONSULTA: "+elementos_fecha);
                        var today = new Date();
                        var dd = String(today.getDate()).padStart(2, '0');
                        var mm = String(today.getMonth() + 1).padStart(2, '0'); //
                        var yyyy = today.getFullYear();
                        if(mm>0){
                          mm = mm-1; 
                        }
                        today = '0'+mm + '/' + dd + '/' + yyyy;
                        if(elementos_fecha[1] >0){
                         // elementos_fecha[1] = elementos_fecha[1]-1;
                        }
         
                        var d2 = '0'+elementos_fecha[1]+"/"+elementos_fecha[0]+"/"+elementos_fecha[2]; // FECHA PLAN
                        var d3=  '0'+elementos_fecha[1]+"-"+elementos_fecha[0]+"-"+elementos_fecha[2]; // FECHA PLAN
                        console.log("FECHAS 123456789");
                        console.log(d2);
                        console.log(d3);
                        console.log(today);
                        
                        let compara = dates.compare(today,d2);
                        console.log("valor comparado : "+compara);
                        if(compara == 1){
                        // boton_fecha ="<button data-toggle='dropdown' class='btn btn-primary btn-block'>Vencido <i class='icon ion-ios-arrow-left tx-11 mg-l-6'></i></button>";

                     //     console.log("PINTO VENCIDO");

                          const color10 = new THREE.Vector4(0.9765,0.0549,0.0235, 1);
                          viewer.setThemingColor(parseInt(result.dbId+'',0),color10, null,true);
                
                    }else{
                      if(compara == -1){
                     //   boton_fecha ="<button data-toggle='dropdown' class='btn btn-success btn-block'>No Vencido <i class='icon ion-ios-arrow-left tx-11 mg-l-6'></i></button>";
                  //   console.log("PINTO OK"); 
                     const colorConFormato = new THREE.Vector4(0.0235, 0.1961,0.9765, 1);
                        viewer.setThemingColor(parseInt(result.dbId+'',0),colorConFormato, null,true);
                 
                      }else{
                        if(compara == 0){
                    //      console.log("PINTO HOY"); 
                        //  boton_fecha ="<button data-toggle='dropdown' class='btn btn-primary btn-block'>Vence Hoy <i class='icon ion-ios-arrow-left tx-11 mg-l-6'></i></button>";
                          const color10 = new THREE.Vector4(0.9451,0.9765,0.0235, 1);
                          viewer.setThemingColor(parseInt(result.dbId+'',0),color10, null,true);
    

                        }
                        else{
                          console.log("VALOR DE COMPARA PARA FORMATO FECHA");
                          console.log(compara);
                          boton_fecha ="FECHA SIN FORMATO 1";

                          const color10 = new THREE.Vector4(0.9765,0,0.2549, 1);
                          viewer.setThemingColor(parseInt(result.dbId+'',0),color10, null,true);
                         
                        }
                      }
                    }
                     
                      }
                      else{
                        const color10 = new THREE.Vector4(0.9765,0.0549,0.0235, 1);
                        viewer.setThemingColor(parseInt(result.dbId+'',0),color10, null,true);
                    //    console.log("NO ENTRE A HORMIGONADO: "+  fecha_objeto);
                        activo_hormigonado = 0;
                        fecha_objeto = "";
                      }
                   }
               
                   
                    }
                   
                  }) 
                  id_tareas_objetos++;
                }
            }

      }
      if(d == "3"){

        Pintar_Categorias_reflow();
      }
   
     
      

    });

    
  
 
}
function loadPrevisualizaciones(){
  $('#vistas_previas').empty();
  $('#resultado_borrado_vista').empty();
  jQuery.get({
    url: '/prueba',
    contentType: 'application/json',
    success: function (res) {
      console.log("RESULTADO GET VISTASasssss");
     console.log(res);
    // console.log(typeof res);
    // console.log(res.length);
    // console.log(res[0]);
    $('#vistas_previas').empty();
    $('#tabla_vistas').empty();
     for(let i =0 ; i<res.length;i++){
      
      $('#vistas_previas').append($('<option>', {value:res[i].ids, text:res[i].nombre}));
     
     $('#tabla_vistas').append($('<option>', {value:res[i].idVS, text:res[i].nombre}));
     
     // newCell2.appendChild(newText2);

 
     }
     
  
  
    },
  });
}

function cargarVista(){
  
  var q =  document.getElementById("id_seleccionados").value;
  var a = document.getElementById("nombre_objeto").value;

  var formData = new FormData();
  formData.append('nombre', a);
  formData.append('ids', q);

  console.log("DATA NOMBRE");
  console.log(a);
  console.log("DATA IDS");
  console.log(q);

  jQuery.post({
    url: '/prueba',
    contentType: 'application/json',
    data:  JSON.stringify({ 'nombre': a, 'ids': q }),
    success: function (res) {
      loadPrevisualizaciones();
    },
  });
/*  $.ajax({
    url: '/prueba',
    data: JSON.stringify({ 'nombre': a, 'ids': q }),
    dataType: 'application/json',
    processData: true,
   
    type: 'POST',
    success: function (data) {
      console.log("RRESULTADO");
      console.log(data);
      $('#appBuckets').jstree(true).refresh_node(node);
      _this.value = '';
    }
  });*/
}

async function getOrdenes(urn){

  
}
function comparar(a, b) {
  return a - b;
}
async function getValFiltro(filtro_name,urn){

  let filtrado = [filtro_name];
  let arr_resp = [];
  var referencia =[];
    referencia2 = [];
    
  let filtros = new Promise((resolve, reject) => {
        consulta_filtro(filtrado).then((data) => {
          let keys = Object.keys(data);
          let datos = keys;
          console.log("NOMBRES KEYS 2023");
          console.log(datos);
          var i;
        
          for (let i = 0; i < datos.length; i++) {
            arr_resp.push(datos[i]) ;
          }
          // inserta opciones de filtro  para AEC PARTICIÓN HA
          console.log("VALORES AEC PISO 2023! PRE CONSULTAS");
          console.log(arr_resp);
          filtro_a = arr_resp;
          resolve(arr_resp);},(error) => {
            reject(error);
    });

    });

    let diametros = new Promise((resolve, reject) => {
      let filtrado = ['Bar Diameter'];
      consulta_filtro(filtrado).then((data) => {
      let keys = Object.keys(data);
      let datos = keys;
      console.log("Diametros");
      console.log(datos);
      let d = datos;
      
      for(let t =0; t<d.length;t++){
        let r3 = parseFloat(d[t]);
        d[t] = Math.round(r3);
      }
        resolve(d);},(error) => {
          reject(error);
     });

     });

   
  var valores = await filtros;
  var diametrosTotal = await diametros;
  diametrosTotal.sort(comparar);
  var resultado_ids = [];
  console.log("Diametros 1");
  console.log(diametrosTotal);
  console.log("Pisos 1");
  console.log(valores);
  valores.sort();
  console.log(valores);
  var posicion_actual =0;
  let resultados = new Promise((resolve, reject) => {
  var matriz_resultados=[];


  



  for(let p = 0; p<valores.length;p++){
      let diametros_barras = [];
      for(let r =0; r<diametrosTotal.length;r++){
        diametros_barras.push(0);
      }
     // a.push(diametros_barras); 
      matriz_resultados.push(diametros_barras);
      console.log("VALORES PISOS resultados");
      console.log(matriz_resultados);
 
 
  }

  for(let p = 0; p<valores.length;p++){
    let diametros_barras = [];
    for(let r =0; r<diametrosTotal.length;r++){
      diametros_barras.push(0);
    }
   // a.push(diametros_barras); 
    matriz_largos.push(diametros_barras);
    
    console.log("VALORES largos resultados 1");
    console.log(matriz_largos);
    console.log(valores);


}
  console.log("MATRIZ RESULTADOS");
  console.log(matriz_resultados);
  console.log("MATRIZ LARGOS");
  console.log(matriz_largos);
  console.log("dimensiones");
  console.log(valores.length+"  "+diametrosTotal.length);
  
  for(let h=0; h<valores.length;h++){
    if( valores[h] !=""){
        let valorFiltro = [valores[h]];
        console.log("PREGUNTA _"+h);
        console.log(valorFiltro);
        console.log("parametro nivel");
      //  console.log(parametro_nivel);
       consulta_filtro2([parametro_nivel]).then((data) => {
          let keys = Object.keys(data);
          let elementos =Array();
          elementos.length = 0;
          elementos = buscaKeys(valorFiltro,keys);
       //   console.log("ELEMENTOS PREVIO PROCESO");
       //   console.log(keys);
       //   console.log(valorFiltro);
      //    console.log(elementos);
          var identificadores=Array();
          identificadores.length = 0;
          referencia.length = 0;
          referencia2.length = 0;
          let dbIds = Array();
          dbIds.length = 0;
          if(elementos.length == 0 && elementos.length && elementos){
            //    // // // // // // // // // alert("No hay resultados");
              }else{
        //          console.log("FILTRADOS IDS"+elementos.length);
                  for(var a = 0; a<elementos.length;a++){
                      if(a==0){
                        dbIds = data[keys[elementos[a]]].dbIds;              
                        referencia.push(dbIds);
                        referencia2.push(dbIds);
                        identificadores = dbIds;
                      }
                      else{
                        referencia.push((data[keys[elementos[a]]].dbIds));
                        referencia2.push((data[keys[elementos[a]]].dbIds));
                        identificadores = dbIds.concat(data[keys[elementos[a]]].dbIds);
      
                        dbIds = identificadores;
                      }
                  }
                  resultado_ids = referencia;
              }
            
            //  console.log("IDENTIFICADORES");
      
           //   console.log(identificadores);
        // obtener tipo-diámetro de la barra
          for(d=0;d<diametros.length;d++){
            if(result.properties[t].displayValue== diametros[d] ){
              posicion_actual = d;
            }
          }

          for (var a = 0; a <= identificadores.length; a++) {
        //    console.log("valor de A FINAL " + a + "valor de LARGO " + identificadores.length);
            if (a == identificadores.length) {
            //  console.log("FINALIZADO ");
            //  console.log(pesos_piso3 + "  " + pesos_piso4);
            } else {
              let actual = identificadores;
    
              viewer.getProperties(identificadores[a], (result) => {
              //  console.log("RESPUESTA para A lvl " + a + " && " + identificadores.length);
              //  console.log(result);
        //        contador_lg = contador_lg + 1;
                let pos_diametro =0;
                for (let i = 0; i < 60; i++) {
                  if (result.properties[i] && result.properties[i].displayName) {
                    let nombre_actual = "" + result.properties[i].displayName;
                    if (nombre_actual === "Category") {
                      categoria_actual_obj = result.properties[i].displayValue;
                     // console.log("valor categoria actual5: " + categoria_actual_obj);
    
                      if (categoria_actual_obj == "Revit Structural Rebar") {
                        for (t = 0; t < result.properties.length; t++) {
    
                          let val_actual = result.properties[t].displayName;
                          if (val_actual == "RS Peso Lineal (kg/m)") {
                          //  console.log("ENTRO A PESO LINEAL HA");
                            let peso = parseFloat(result.properties[t].displayValue);
    
                          //  console.log("ANTES PESO BUSCADO HA");
                          //  console.log(peso);
                          //  console.log(result.properties[t].displayValue);
                          //  console.log(result);
    
                            peso = parseFloat(peso);
                            pesoActual = peso;
                           // console.log("PESO BUSCADO HA");
                           // console.log(peso);
    
                          }
                         
                          if(val_actual =="Model Bar Diameter"){
                            let diametroFormato =result.properties[t].displayValue;
                    //        console.log("Diametro actual");
                   //        console.log(result.properties[t].displayValue);
                          //  console.log(typeof(result.properties[t].displayValue));
                            for(let j =0;j<diametrosTotal.length;j++){
                          //    console.log(diametrosTotal[j]);
                              if(diametrosTotal[j] == diametroFormato){
                             //   console.log(" es igual");
                                pos_diametro = j;
                              }else{
                              //  console.log("no  es igual");
                              }
                            }
                          }
                          if (val_actual == "Total Bar Length") {
                          //  console.log("TOTAL LENGTH BAR HA");
    
                            let largo = parseFloat(result.properties[t].displayValue);
                            largo = largo.toFixed(0);
                           // console.log(largo);
    
                            largo = parseFloat(largo, 0);
                            largo = largo / 100;
                            largoActual = largo;
                           // console.log("convertido HA22 " + largo+" // "+ largoActual);
                           // console.log("posicion " + pos_diametro);
                           

                           // console.log("MATRIZ DE RESULTADOS");
                           // console.log(matriz_resultados);
                           
                          }
                          if ((t + 1) == result.properties.length) { // termina de recorrer todas las propiedades
                            let resultado_mul = pesoActual * largoActual;
                            resultado_mul.toFixed(0);
                            pesoActual = 0;
                            
                        //    console.log("VALOR ACTUAL MATRIZ LARGOS");
                         //   console.log(matriz_largos[h][pos_diametro]);
                        //    console.log(h);
                       //     console.log(largoActual);
                           
                            matriz_largos[0][pos_diametro] =  largoActual  + matriz_largos[0][pos_diametro] ;
                            let mult_actual  = parseFloat( matriz_resultados[h][pos_diametro]);
                            largoActual = 0;
                            matriz_resultados[h][pos_diametro] =  mult_actual  +resultado_mul ;
                          //  console.log("MATRIZ DE RESULTADOS");
                          //  console.log(matriz_resultados);
                           // console.log("MATRIZ DE LARGOS");
                          //  console.log(matriz_largos);
                             
    
                          }
                        }
                     
    
                      }
    
                    }
    
                  }
    
                }
    
              })
            }
          }
          console.log("finaliza matriz");
          console.log(matriz_resultados);
          resolve(matriz_resultados);},(error) => {
            reject(error);
      });
    }
  
  }
// Piso / d1,d2,...,dn
 //   console.log("resuelve ");
  resolve(matriz_resultados);},(error) => { 
  reject(error);
   });

  
const jj = await resultados;
// jj matriz de resutados
// valores arreglo de nombres-piso
// diametros arregle de diametros por proyecto
  let ordenes =  new Promise((resolve, reject) => {
    jQuery.get({
      url: '/getOrdenes',
      contentType: 'application/json',
      success: function (res) {
        let resultado =[]; // resultado = {"nombrePedido",{arrayIds}}
        for(let r = 0; r<res.length; r++){
          let dona2 = {};
          if( res[r].urn_actual== urn){
            let actual = [];
              actual.push(res[r].nombre_pedido);
              let actualPedido = res[r].ids.split(',');
              actual.push(actualPedido);
              resultado.push(actual);
            //  dona2["label"]=res[r].nombre_pedido;
            //  dona2["value"]=val_peso.toFixed(1);
              //PedidosLargoDiametro.push(res[r].nombre_pedido);
             
            }
        }
      
      resolve(resultado);
        
      }, error: function (res) {
            reject(res);

      }
    });
  }).then(function(result) { //  result (nombre pedido , {ids}))
      
    
     // console.log(result[0][1]);
      let arrayPedidos = Array();
      for(let q=0;q<result.length;q++){
      
        for(let q2=0;q2<result[q][1].length;q2++){
          console.log("id actual");
          console.log(result[q][1][q2]);
          viewer.getProperties( parseInt(result[q][1][q2]), (result) => { 
           
          
            for (let i = 0; i < 60; i++) {
              if (result.properties[i] && result.properties[i].displayName) {
                let nombre_actual = "" + result.properties[i].displayName;
                if (nombre_actual === "Category") {
                  categoria_actual_obj = result.properties[i].displayValue;
                // console.log("valor categoria actual5: " + categoria_actual_obj);
    
                  if (categoria_actual_obj == "Revit Structural Rebar") {
                    for (t = 0; t < result.properties.length; t++) {
    
                      let val_actual = result.properties[t].displayName;
                      if (val_actual == "RS Peso Lineal (kg/m)") {
                      //  console.log("ENTRO A PESO LINEAL HA");
                        let peso = parseFloat(result.properties[t].displayValue);
    
                      //  console.log("ANTES PESO BUSCADO HA");
                      //  console.log(peso);
                      //  console.log(result.properties[t].displayValue);
                      //  console.log(result);
    
                        peso = parseFloat(peso);
                        pesoActual = peso;
                      // console.log("PESO BUSCADO HA");
                      // console.log(peso);
    
                      }
                    
                      if(val_actual =="Model Bar Diameter"){
                        let diametroFormato =result.properties[t].displayValue;
                      //  console.log("Diametro actual");
                    //   console.log(result.properties[t].displayValue);
                      //  console.log(typeof(result.properties[t].displayValue));
                        for(let j =0;j<diametrosTotal.length;j++){
                      //    console.log(diametrosTotal[j]);
                          if(diametrosTotal[j] == diametroFormato){
                        //   console.log(" es igual");
                            pos_diametro = j;
                          }else{
                          //  console.log("no  es igual");
                          }
                        }
                      }
                      if (val_actual == "Total Bar Length") {
                      //  console.log("TOTAL LENGTH BAR HA");
    
                        let largo = parseFloat(result.properties[t].displayValue);
                        largo = largo.toFixed(0);
                      // console.log(largo);
    
                        largo = parseFloat(largo, 0);
                        largo = largo / 100;
                        largoActual = largo;
                      // console.log("convertido HA22 " + largo+" // "+ largoActual);
                      // console.log("posicion " + pos_diametro);
                      
    
                      // console.log("MATRIZ DE RESULTADOS");
                      // console.log(matriz_resultados);
                      
                      }
                      if ((t + 1) == result.properties.length) { // termina de recorrer todas las propiedades
                        //   console.log( resultadoPedido);  
                          console.log("POSICIONES ACTUALES");
                          console.log(" Pedido :"+q);
                          console.log(" diametro :"+pos_diametro);
                          console.log(" Largo :"+largoActual);
                        
                         // let a1 = matrizLargosDiametros[q][1][pos_diametro];
                       //   a1 = a1 + largoActual;
                         // matrizLargosDiametros[q][1][pos_diametro]=a1;
                         // console.log( matrizLargosDiametros[q][1][pos_diametro]);
                          let arr2 = Array(q,pos_diametro,largoActual);
                          arrayPedidos.push(arr2);
                          //  console.log("VALOR ACTUAL MATRIZ PEDIDOS");
                        // console.log( matriz_pedidos[contador_pedidos][1][pos_diametro]);
                        //  console.log(matriz_pedidos);
                        //  console.log(h);
                      //   console.log(largoActual);
                        
                        //  matriz_largos[0][pos_diametro] =  largoActual  + matriz_largos[0][pos_diametro] ;
                        // let mult_actual  = parseFloat( matriz_resultados[h][pos_diametro]);
                          largoActual = 0;
                      //    matriz_resultados[h][pos_diametro] =  mult_actual  +resultado_mul ;
                      //  console.log("MATRIZ DE RESULTADOS");
                      //  console.log(matriz_resultados);
                      // console.log("MATRIZ DE LARGOS");
                      //  console.log(matriz_largos);
                        
    
                      }
                    }
                
    
                  }
    
                }
    
              }
    
            }
    
          
            
          }) 
        }
       

      }
     
      setTimeout(() => {

        if(!(typeof result=== 'undefined')){
              
            console.log("Ordenes solicitadas");
            console.log(result);
            console.log(typeof result);
            let u = arrayPedidos[0].length-1;
            console.log(u);
           
            var matrizLargosDiametros = [];
            console.log("VALOR D");
            console.log(d);
            for(let p =0;p<result.length;p++){
              var d =Array();
              for(let w=0; w< u;w++){
                d.push(0);  
              } 
                matrizLargosDiametros.push(d);
            }
            console.log("matriz Resultados Preparada");
            console.log(matrizLargosDiametros);
            console.log("VALOR ACTUAL MATRIZ PEDIDOS3");
          console.log( matrizLargosDiametros);
          console.log(arrayPedidos);
          console.log(diametrosTotal);
          console.log(arrayPedidos.length);
          //matrizLargosDiametros[l][1][o] = matrizLargosDiametros[l][1][o]+
          var pedidosDiametros =[];
          for(let l =0; l<arrayPedidos.length;l++){
          
              pedidoActual = arrayPedidos[l][0];
              
              console.log("Posicion Actual Arreglo resultados");
              console.log(arrayPedidos[l][0]);
              console.log(arrayPedidos[l][1]);
              console.log(arrayPedidos[l][2]);
              console.log( matrizLargosDiametros[arrayPedidos[l][0]][arrayPedidos[l][1]]);
          
            matrizLargosDiametros[arrayPedidos[l][0]][arrayPedidos[l][1]] =  parseInt(matrizLargosDiametros[arrayPedidos[l][0]][arrayPedidos[l][1]])+parseInt(arrayPedidos[l][2]);
          }
          console.log("VALOR ACTUAL MATRIZ PEDIDOS4");
          console.log( matrizLargosDiametros);
          console.log( result);
         
          
                var barraLargos = [];
                for(let f=0;f<result.length;f++){
                  let pedDiametrosLargos = {};
                
                  for(var k=0; k< diametrosTotal.length;k++){
                    let lactual = [];
                    let hw = parseFloat(diametrosTotal[k]);
                    hw = Math.round(diametrosTotal[k]);
                    lactual.push(hw);
                    lactual.push(matrizLargosDiametros[f][k]);
                    lactual.push(result[f][0]);
                    pedidosDiametros.push(lactual);
                    pedDiametrosLargos[hw]= matrizLargosDiametros[f][k];
                  }
                 
                 
                  pedDiametrosLargos["y"]=result[f][0];
                  console.log( pedDiametrosLargos);
                  barraLargos.push(pedDiametrosLargos);
                }
           
                console.log("BARRA LARGOS");
                console.log(barraLargos);
                console.log(barraLargos[0][0]);
                document.getElementById('PedidoDiametro').innerHTML ="";
                for(let q=0; q<pedidosDiametros.length;q++){
                  let pesoAc = pedidosDiametros[q][1];
                  let diametroAct = pedidosDiametros[q][0];
                  diametroAct = parseFloat(diametroAct,1);
                  diametroAct = Math.round(diametroAct);
                  console.log( "DIAMETRO ACTUAL LISTADO");
                  console.log( diametroAct);
                  if( (pedidosDiametros[q][1] === undefined) || isNaN(pedidosDiametros[q][1])){pesoAc=0;}
                  document.getElementById('PedidoDiametro').innerHTML +="<div class='col-4'> "+pedidosDiametros[q][2]+"</div>";
                  document.getElementById('PedidoDiametro').innerHTML +="<div class='col-4'>Diametro: "+diametroAct+"</div>";
                  document.getElementById('PedidoDiametro').innerHTML +="<div class='col-4'>Peso: "+pesoAc+" Kgs</div>";
                }
                console.log(pedidosDiametros);
                document.getElementById('morrisBar1').innerHTML ="";
      //    console.log("DATOS MORRIS");
        //   console.log(morrisData3)
              largosDiametro = barraLargos;
              new Morris.Bar({
                element: 'morrisBar1',
                data: barraLargos,
                xkey: 'y',
                ykeys: diametrosTotal,
                labels: diametrosTotal,
                barColors: ['#334FFF','#33FF8A','#FFB833','#FF4C33', '#F3FF33','#5BFF33','#FF33FC','#33FFAC','#33CEFF'],
                stacked: true,
                gridTextSize: 11,
                hideHover: 'auto',
                resize: true
              });

     
         
        }
        
      },15000);
      
  })

  const resultadoOrdenes = await ordenes;
  

  setTimeout(() => {

    var morrisData3 = [];
    var donaData = [];
    
    var barraPesosNivel =[];
    sumatoria_pesos=0;
    var dataPesos = [];
    var dataPesosDiametros =[];
  // Lista de elementos por valor/filtro
    for(let g=0;g<valores.length;g++){
      let qj = {};
      let dn = {};
      let dataPesoActual = [];
      let pesoNivelActual ={};

      if(valores[g] !=""){
        pesoNivelActual['y'] = valores[g];
       
        qj['y'] = valores[g];
        dn['label'] = valores[g];
        dataPesoActual.push(valores[g]);
        let cont = 0;
        let ww1 = [];
        
        for(var f=0; f< diametrosTotal.length;f++){
          let ww = [];
          qj[diametrosTotal[f]]= jj[g][f].toFixed(1);


          ww.push(valores[g]);
          ww.push(diametrosTotal[f]);
          ww.push(jj[g][f].toFixed(1));
          ww1.push(ww);
     //     console.log("datos pre morris 2");
     //    console.log(jj[g][f]);
          cont =  cont +jj[g][f];
     //     console.log(diametrosTotal[f]);
        }
        dn['value'] = cont.toFixed(1);
        pesoNivelActual[valores[g]] = cont.toFixed(1);

        dataPesosDiametros.push(ww1);
        dataPesoActual.push(cont.toFixed(1));
        dataPesos.push( dataPesoActual);
        sumatoria_pesos = sumatoria_pesos+cont;
        morrisData3.push(qj);
        barraPesosNivel.push( pesoNivelActual);
        donaData.push(dn);
        console.log("graficos construidos");
        console.log(morrisData3);
        console.log(donaData);
        console.log(barraPesosNivel);
      }

    
      console.log("DATOS GRAFICO");
      console.log( dataPesosDiametros);
      totalTabla1  = dataPesosDiametros;
  //    console.log("Dona!");
  //    console.log(dn);
     
    }
    document.getElementById("PedidosNivel").innerHTML = "";
    for(let w=0;w<dataPesosDiametros.length;w++){
      for(let d=0;d<dataPesosDiametros[w].length;d++){
        diametroAct = parseFloat(dataPesosDiametros[w][d][1],1);
        diametroAct = Math.round(diametroAct);
        console.log( "DIAMETRO ACTUAL LISTADO");
        console.log( diametroAct);
        
        document.getElementById("PedidosNivel").innerHTML += "<div class='col-4'>Piso: "+dataPesosDiametros[w][d][0]+" </div>";
        document.getElementById("PedidosNivel").innerHTML += "<div class='col-4'>Diametro: "+diametroAct+" </div>";
        document.getElementById("PedidosNivel").innerHTML += "<div class='col-4'>Peso: "+dataPesosDiametros[w][d][2]+" Kgs</div>";
     
      }
     
    }
   // console.log("VALORES BASE");
  //  console.log(diametrosTotal);
  //  console.log(valores);
   // console.log(jj);
   
    var arr_diametrosTotales =[];
    for(let q =0;q<diametrosTotal.length;q++){
      let labelDiametro ={};
      let valorDiametro ={}; // valor diametro acumulado
      labelDiametro['y']= diametrosTotal[q];
      let cont = 0;
     
      for(let d=0;d< jj.length;d++){
    //    console.log("suma por diametro");
    //    console.log("q: "+q+"  d: "+d);
    //    console.log(jj[d][q]);
        cont =  cont +jj[d][q];
      }
     
      arr_diametrosTotales.push(cont);
    }
  //  console.log("sumatoria total de pesos Diametros");
  //  console.log(arr_diametrosTotales);
    
  //  PesosTotales
    document.getElementById("dataPisoTotalNivel").innerHTML = "Peso Total Proyecto :"+sumatoria_pesos.toFixed(1)+" Kgs";
    for(let w=0;w<dataPesos.length;w++){
      document.getElementById("dataPisoTotalNivel").innerHTML += "<br>"+dataPesos[w][0]+" :"+dataPesos[w][1]+" Kgs";
   
    }
    document.getElementById("morrisDonut2").innerHTML = "";
    getOrdenesTotalPedidos(urn);

    id_pedidos_guardados = [];
    nombre_pedidos = [];
    fecha_pedidos =[];
    labels_graf.length = 0;
    valores_pesos_pedidos.length = 0;
    //var dataPedidos2 = [];
    //var largoTotalPedido=0;
    matriz_pedidos = Array();
  
    document.getElementById('morrisBar4').innerHTML ="";
 //    console.log("DATOS MORRIS");
  //   console.log(morrisData3)
    new Morris.Bar({
      element: 'morrisBar4',
      data: morrisData3,
      xkey: 'y',
      ykeys: diametrosTotal,
      labels: diametrosTotal,
      barColors: ['#338AFF','#5833FF','#382F61', '#0D7CF3','#36107D','#041BFC','#33FFAC','#33CEFF','#FF4C33'],
      stacked: true,
      gridTextSize: 11,
      hideHover: 'auto',
      resize: true
    });
    // console.log("Dona 2");
    // console.log(donaData);
    document.getElementById("morrisDonut1").innerHTML = "";


    new Morris.Bar({
      element: 'morrisDonut1',
      data: barraPesosNivel,
      xkey: 'y',
      ykeys: valores,
      labels: valores,
      barColors: ['#338AFF','#5833FF','#382F61', '#0D7CF3','#36107D','#041BFC','#33FFAC','#33CEFF','#FF4C33'],
      stacked: true,
      gridTextSize: 11,
      hideHover: 'auto',
      resize: true
    });
    /*
  new Morris.Donut({
		element: 'morrisDonut1',
		data: donaData,
		colors: ['#FF4C33', '#F3FF33','#5BFF33','#FF33FC','#334FFF','#33FF8A','#FFB833','#33FFAC','#33CEFF'],
		resize: true,
		labelColor:"#8c9fc3"
	});

*/
resultadoCVS =barraPesosNivel;
resultadoPesosDiametros = morrisData3;



  document.getElementById("precarga").style.display = "none";

  }, 35000);

  

}

function dwCVS(){
    resultadoCVS.unshift({Nombre:"BarraPesosPorNivel"});
    resultadoCVS.push({"  ":""});
    resultadoCVS.push({Nombre:"Pesos Diámtro/Nivel"});
    
    for(let q=0;q<resultadoPesosDiametros.length;q++){
      resultadoCVS.push(resultadoPesosDiametros[q]);
    }
    resultadoCVS.push({"":""});
    resultadoCVS.push({Nombre:"Total Pedidos"});
    for(let q=0;q<pedidosTotalarr.length;q++){
      resultadoCVS.push(pedidosTotalarr[q]);
    } 
    resultadoCVS.push({"":""});
    resultadoCVS.push({Nombre:"Largos Pedido / Diámetro"});
    for(let q=0;q<largosDiametro.length;q++){
      resultadoCVS.push(largosDiametro[q]);
    }

    generarCVS(resultadoCVS,"ResultadosEstadisticas&Datos");
}

function getDiametros(){
   
}

function generaGrafico(pisos){
  getDiametros();
  
}

 function launchViewer(urn) {
  var options = {
    env: 'AutodeskProduction',
    getAccessToken: getForgeToken
  };
  
  Autodesk.Viewing.Initializer(options, () => {
    
    viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById('forgeViewer'), { extensions: ['Autodesk.DocumentBrowser', 'HandleSelectionExtension'] });
    viewer.start();
    //cargarProyecto();
    
    var documentId = 'urn:' + urn;
   // getOrdenesURN(urn);
   
    Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
   

   
    viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, (event) => { 
    console.log("REICIO APP");
 
     // loadPrevisualizaciones();
   //   getDBIds();
 //     getPlanObj();
 console.log("Entro 1 vez");
        getValFiltro(parametro_nivel,urn);
       // getOrdenes(urn)
   //getOrdenesTotalPedidos(urn);
 
 //AEC Piso
    
    //  console.log('DB IDS DESDE SERVER');
   //   console.log(ids_bd);
   //   this.getDBIds_update('1515','1515','125');
   //  this.getDBIds_insert('1515','1515','225');
   //   console.log("ENTRO A CARGA - SE TERMINO DE LOAD");
      /**
      if(idsSeleccionados !="" && idsSeleccionados.lenght>0 ){
        console.log("IDS SELECCIONADOS");
        console.log(idsSeleccionados);
        viewer.isolate(idsSeleccionados);
        viewer.fitToView(idsSeleccionados, viewer.model);
      }
       */
      if(estado_filtro != 0){
       // filtro_visual();
      }
     
          // document.getElementById("selectores").innerHTML = "<a class=\"dropdown-item\" >Seleccione Filtro</a>";
        //  getFiltros();
          
          // Pintar_Categorias();
   
        });

// Detección de selección de elementos
    viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT,(event)=>{
        console.log("Seleccion!!!!!!!!!!!!!!!!!!!!!!!!");
        console.log(event);
        console.log(event.dbIdArray);
        var a= event.dbIdArray;
        for(let r =0; r<a.length;r++){
        // const color = new THREE.Vector4(1.0, 0.0, 0.0, 0.5);
        /// viewer.setThemingColor(a[r], color, null, true);
        
        }
        let selects = event.dbIdArray;
          let dbId = viewer.getSelection(); 
        // this.existeId(125);
          //idsSeleccionados = dbId;
          //  console.log("toco");
        //    console.log(dbId);
            document.getElementById("propiedades_id").innerHTML = "";
        
        // console.log("ID PROPIEDAD");
      //  console.log(dbId.dbId);
        // console.log(dbId);
            let busqueda = existeId(dbId[0]); 
            console.log('RESULTADO BUSQUEDA ID - FN');
            console.log(busqueda);
            if(busqueda == false){
              viewer.getProperties(dbId[0], (result) => { 
                console.log('RESULTADO SELECCION'); 
                document.getElementById("propiedades_id").innerHTML = "";
                  console.log(result); 
                  document.getElementById("edicion_data").innerHTML = "";
                  document.getElementById("edicion_data2").innerHTML = "";
                  //<a class='btn ripple btn-info' data-target='#modaldemo3' data-toggle='modal' href=''>Editar Datos</a>
                  document.getElementById("edicion_data").innerHTML = "<a class='btn ripple btn-info' data-target='#modaldemo3' data-toggle='modal' href=''>Fecha Instalación</a>";
                  document.getElementById("edicion_data2").innerHTML = "<a class='btn ripple btn-info' data-target='#modaldemo5' data-toggle='modal' href=''>Ver Fecha Plan</a>";
                  
                  let fecha_hormigonado = "";
                  if(result.name){
                    var categoria_actual = result.name.split("[");
                    document.getElementById("propiedades_id").innerHTML += "<li><b> Nombre</b> :"+result.name+"</li>";
                    // nombre_objeto
                    $("#nombre_objeto").val(result.name);
                    let boton_fecha = "";
          
                  }
                  
              //   console.log(result.name.split("["));
                  if(categoria_actual){
                    if(categoria_actual[0] === "Floor "){
                      console.log("si es flooor");
                      for(i=0 ;i< 60;i++){
                      
                      switch(i){
                          case 0:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 1:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 4:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 11:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                          case 12:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 13:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>"; 
                          break;
                          case 16:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 17:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 18:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 21:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 24:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 28:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 29:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 30:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 31:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                        case 32:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                        case 39:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 43:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;                  
                      }
                      
                      }
                  }
        
                  if(categoria_actual[0] === "RS VHA. "){
                    console.log("si es RS VHA");
                    for(i=0 ;i< 60;i++){
                    
                    switch(i){
                        case 0:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 1:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 4:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 11:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                        case 12:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 13:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>"; 
                        break;
                        case 16:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 17:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 18:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 21:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 24:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 28:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 29:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 30:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                      case 31:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                      break;
                      case 32:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                      break;
                      case 39:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                      case 43:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;                  
                    }
                    
                    }
                  }
                  if(categoria_actual[0] === "Basic Wall "){
              //    console.log("si es Basic Wall ");
                  for(i=0 ;i< 60;i++){
                  
                  switch(i){
                      case 0:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                      case 1:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                      case 5:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                      case 10:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                      break;
                      case 19:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                      case 20:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>"; 
                      break;
                      case 21:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                      case 22:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                      case 23:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                    case 24:
                      document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                    case 25:
                      document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                    case 27:
                      document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                    case 31:
                      document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                    case 32:
                      document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                      break;
                    case 33:
                      document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                    break;
                    case 34:
                      document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                    break;
                    case 42:
                      document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                      break;
                    case 46:
                      document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                      break;                  
                  }
                  
                  }
                  }
                  if(categoria_actual[0] === "Wall Foundation "){
                    console.log("si es Wall Foundation ");
                    for(i=0 ;i< 60;i++){
                    
                    switch(i){
                        case 0:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 1:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 5:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 6:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                        case 7:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 8:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>"; 
                        break;
                        case 9:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 10:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 11:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 12:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 13:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 14:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 20:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 21:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                      case 22:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                      break;
                      case 23:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>123"+result.properties[i].displayValue+"</li>";
                      break;
                      case 30:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>123"+result.properties[i].displayValue+"</li>";
                      break;
                                    
                    }
                    
                    }
                  }
                  if(categoria_actual[0] === "RS Fundacion Aislada Tipo "){
                    console.log("si es RS Fundacion Aislada Tipo ");
                    for(i=0 ;i< 60;i++){
                    
                    switch(i){
                        case 0:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 1:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 3:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 8:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                        case 10:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 11:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>"; 
                        break;
                        case 12:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 13:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 16:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 22:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 23:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 24:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 25:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 35:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                      case 36:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                      break;
                      case 37:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                      break; 
                                    
                    }
                    
                    }
                  }  
                  if(categoria_actual[0] === "Foundation Slab "){
                    console.log("si es Foundation Slab ");
                    for(i=0 ;i< 60;i++){
                    
                    switch(i){
                        case 0:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 1:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 4:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 10:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                        case 11:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 12:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>"; 
                        break;
                        case 14:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 15:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 16:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 19:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 20:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 21:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 24:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 28:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                      case 29:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                      break;
                      case 30:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                      break;
                      case 31:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                      case 37:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;   
                        case 40:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;                
                    }
                    
                    }
                  }
                  if(categoria_actual[0] === "Rebar Bar "){
                    console.log("si es Rebar Bar ");
                    for(i=0 ;i< 60;i++){
                    
                    switch(i){
                        case 0:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 1:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 3:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 4:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                        case 6:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 20:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>"; 
                        break;
                        case 22:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 23:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 24:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 25:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 26:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 36:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 45:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 46:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                      case 47:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                      break;
                      case 48:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                      break;
                      case 60:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                      case 61:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;   
                        case 63:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 64:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break; 
                      case 65:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                      break;
                      case 66:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 67:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                      break;               
                    }
                    
                    }
                  }
                  }
                  console.log("tipo resultado propiedades "+typeof result.properties);
                  for(i=0 ;i< 50;i++){
               
                    if(result.properties[i].displayName){
                      let nombre_actual = ""+result.properties[i].displayName;
                      if(nombre_actual  === parametro_fecha){
                    
        
                    
                        fecha_hormigonado = result.properties[i].displayValue;
                        let elementos_fecha = fecha_hormigonado.split("/");
                        if(elementos_fecha.length<=1){
                           elementos_fecha = fecha_hormigonado.split("-");
                        }
                        var today = new Date();
                        var dd = String(today.getDate()).padStart(2, '0');
                        var mm = String(today.getMonth() + 1).padStart(2, '0'); //
                        var yyyy = today.getFullYear();
                        if(mm>0){
                          mm = mm-1; 
                        }
                        today = '0'+mm + '/' + dd + '/' + yyyy;
                        if(elementos_fecha[1] >0){
                          elementos_fecha[1] = elementos_fecha[1];
                        }
                      // // // // // // // // // // // alert(elementos_fecha[1]+"/"+elementos_fecha[0]+"/"+elementos_fecha[2]);
                        //// // // // // // // // // // alert(today);
                        if(elementos_fecha[1].length ==0){
                          var d2 = '0'+elementos_fecha[1]+"/"+elementos_fecha[0]+"/"+elementos_fecha[2]; // FECHA PLAN
                          var d3=  '0'+elementos_fecha[1]+"-"+elementos_fecha[0]+"-"+elementos_fecha[2]; // FECHA PLAN
                       
                        }else{
                          var d2 = elementos_fecha[1]+"/"+elementos_fecha[0]+"/"+elementos_fecha[2]; // FECHA PLAN
                          var d3   = elementos_fecha[1]+"-"+elementos_fecha[0]+"-"+elementos_fecha[2]; // FECHA PLAN
                       
                        }
                         let compara = dates.compare(today,d2);
                        if(compara == 1){
                          boton_fecha ="<button data-toggle='dropdown' class='btn btn-primary btn-block'>Vencido <i class='icon ion-ios-arrow-left tx-11 mg-l-6'></i></button>";
          
          
                    
          
          
                        }else{
                          if(compara == -1){
                            boton_fecha ="<button data-toggle='dropdown' class='btn btn-success btn-block'>No Vencido <i class='icon ion-ios-arrow-left tx-11 mg-l-6'></i></button>";
          
                       
                          }else{
                            if(compara == 0){
                              boton_fecha ="<button data-toggle='dropdown' class='btn btn-primary btn-block'>Vence Hoy <i class='icon ion-ios-arrow-left tx-11 mg-l-6'></i></button>";
       
          
                            }
                            else{
                              boton_fecha ="FECHA SIN FORMATO 2";
                             
                            }
                          }
                        }
                        
                      }
                    }
                  
                   
                }
        
                  
                  document.getElementById("propiedades_id").innerHTML += " AEC Secuencia Hormigonado <li><b>"+" :</b>"+fecha_hormigonado+" Estado: "+boton_fecha+"</li>";
                $("#dateMask1").val(fecha_hormigonado);
                $("#plan1").val(fecha_hormigonado);
                $("#dateMask2").val(fecha_hormigonado);
                $("#plan2").val(fecha_hormigonado);
                  
              //    console.log("VALORES");
              //   console.log(result);
                  
              }) ;
            }else{
                let base = busqueda[1];
                let plan = busqueda[2];
                viewer.getProperties(dbId[0], (result) => { 
                  console.log('RESULTADO SELECCION'); 
                  document.getElementById("propiedades_id").innerHTML = "";
                    console.log(result); 
                    //<a class='btn ripple btn-info' data-target='#modaldemo3' data-toggle='modal' href=''>Editar Datos</a>
                    document.getElementById("edicion_data").innerHTML = "<a class='btn ripple btn-info' data-target='#modaldemo3' data-toggle='modal' href=''>Editar Fecha Instalación</a>";
                    document.getElementById("edicion_data2").innerHTML = "<br><a class='btn ripple btn-info' data-target='#modaldemo5' data-toggle='modal' href=''>Ver Fecha Plan</a>";
                    
                    let fecha_hormigonado = "";
                    if(result.name){
                      var categoria_actual = result.name.split("[");
                      document.getElementById("propiedades_id").innerHTML += "<li><b> Nombre</b> :"+result.name+"</li>";
                      // nombre_objeto
                      $("#nombre_objeto").val(result.name);
                      let boton_fecha = "";
            
                    }
                    
                //   console.log(result.name.split("["));
                
                    if(categoria_actual[0] === "Floor "){
                        console.log("si es flooor");
                        for(i=0 ;i< 60;i++){
                        
                        switch(i){
                            case 0:
                              document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                              break;
                            case 1:
                              document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                              break;
                            case 4:
                              document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                              break;
                            case 11:
                              document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                            case 12:
                              document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                              break;
                            case 13:
                              document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>"; 
                            break;
                            case 16:
                              document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                              break;
                            case 17:
                              document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                              break;
                            case 18:
                              document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                              break;
                          case 21:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                              break;
                          case 24:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                              break;
                          case 28:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                              break;
                          case 29:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                              break;
                          case 30:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 31:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                          case 32:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                          case 39:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 43:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;                  
                        }
                        
                        }
                    }
          
                    if(categoria_actual[0] === "RS VHA. "){
                      console.log("si es RS VHA");
                      for(i=0 ;i< 60;i++){
                      
                      switch(i){
                          case 0:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 1:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 4:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 11:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                          case 12:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 13:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>"; 
                          break;
                          case 16:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 17:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 18:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 21:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 24:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 28:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 29:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 30:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 31:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                        case 32:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                        case 39:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 43:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;                  
                      }
                      
                      }
                    }
                    if(categoria_actual[0] === "Basic Wall "){
                //    console.log("si es Basic Wall ");
                    for(i=0 ;i< 60;i++){
                    
                    switch(i){
                        case 0:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 1:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 5:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 10:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                        case 19:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 20:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>"; 
                        break;
                        case 21:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 22:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 23:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 24:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 25:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 27:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 31:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 32:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                      case 33:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                      break;
                      case 34:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                      break;
                      case 42:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                      case 46:
                        document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;                  
                    }
                    
                    }
                    }
                    if(categoria_actual[0] === "Wall Foundation "){
                      console.log("si es Wall Foundation ");
                      for(i=0 ;i< 60;i++){
                      
                      switch(i){
                          case 0:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 1:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 5:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 6:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                          case 7:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 8:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>"; 
                          break;
                          case 9:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 10:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 11:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 12:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 13:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 14:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 20:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 21:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 22:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                        case 23:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>123"+result.properties[i].displayValue+"</li>";
                        break;
                        case 30:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>123"+result.properties[i].displayValue+"</li>";
                        break;
                                      
                      }
                      
                      }
                    }
                    if(categoria_actual[0] === "RS Fundacion Aislada Tipo "){
                      console.log("si es RS Fundacion Aislada Tipo ");
                      for(i=0 ;i< 60;i++){
                      
                      switch(i){
                          case 0:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 1:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 3:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 8:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                          case 10:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 11:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>"; 
                          break;
                          case 12:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 13:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 16:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 22:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 23:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 24:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 25:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 35:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 36:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                        case 37:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break; 
                                      
                      }
                      
                      }
                    }  
                    if(categoria_actual[0] === "Foundation Slab "){
                      console.log("si es Foundation Slab ");
                      for(i=0 ;i< 60;i++){
                      
                      switch(i){
                          case 0:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 1:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 4:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 10:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                          case 11:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 12:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>"; 
                          break;
                          case 14:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 15:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 16:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 19:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 20:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 21:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 24:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 28:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 29:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                        case 30:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                        case 31:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 37:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;   
                          case 40:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;                
                      }
                      
                      }
                    }
                    if(categoria_actual[0] === "Rebar Bar "){
                      console.log("si es Rebar Bar ");
                      for(i=0 ;i< 60;i++){
                      
                      switch(i){
                          case 0:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 1:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 3:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 4:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                          case 6:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 20:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>"; 
                          break;
                          case 22:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 23:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 24:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 25:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 26:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 36:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 45:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 46:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 47:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                        case 48:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                        case 60:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 61:
                          document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;   
                          case 63:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 64:
                              document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break; 
                        case 65:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                        case 66:
                            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 67:
                              document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;               
                      }
                      
                      }
                    }
                
                         let nombre_actual = ""+result.properties[i].displayName;
                      
                        fecha_hormigonado = base;
                        let elementos_fecha = fecha_hormigonado.split("/");
                        if(elementos_fecha.length <=1){
                          elementos_fecha = fecha_hormigonado.split("-");
                        }
                     
                        var today = new Date();
                        var dd = String(today.getDate()).padStart(2, '0');
                        var mm = String(today.getMonth() + 1).padStart(2, '0'); //
                        var yyyy = today.getFullYear();
                        if(mm>0){
                          mm = mm-1; 
                        }
                        today = '0'+mm + '/' + dd + '/' + yyyy;
                        if(elementos_fecha[1] >0){
                          elementos_fecha[1] = elementos_fecha[1];
                        }
                      // // // // // // // // // // // alert(elementos_fecha[1]+"/"+elementos_fecha[0]+"/"+elementos_fecha[2]);
                        //// // // // // // // // // alert(today);
                        var d2 = '0'+elementos_fecha[1]+"/"+elementos_fecha[0]+"/"+elementos_fecha[2]; // FECHA PLAN
                        var d3=  '0'+elementos_fecha[1]+"-"+elementos_fecha[0]+"-"+elementos_fecha[2]; // FECHA PLAN
                        let compara = dates.compare(today,d2);
                        let compara2 = dates.compare(today,d3);

                        if(compara == 0){
                          if(compara2 != 0){compara = compara2;}
                        }
                        if(compara == 1){
                          boton_fecha ="<button data-toggle='dropdown' class='btn btn-primary btn-block'>Vencido <i class='icon ion-ios-arrow-left tx-11 mg-l-6'></i></button>";
          
          
                    
          
          
                        }else{
                          if(compara == -1){
                            boton_fecha ="<button data-toggle='dropdown' class='btn btn-success btn-block'>No Vencido <i class='icon ion-ios-arrow-left tx-11 mg-l-6'></i></button>";
          
                        /*    gantt.parse({
                              data: [
                                  { id: 1, text: result.name, start_date: d3, duration: 5, progress: 0.4, open: true },
                                  { id: 2, text: "Inicio", start_date: d3, duration: 1, progress: 0.6, parent: 1 }
                              ],
                              links: [
                                  {id: 1, source: 1, target: 2, type: "1"},
                                  
                              ]
                          });
          
          */
                          }else{
                            if(compara == 0){
                              boton_fecha ="<button data-toggle='dropdown' class='btn btn-primary btn-block'>Vence Hoy <i class='icon ion-ios-arrow-left tx-11 mg-l-6'></i></button>";
          /*
                              gantt.parse({
                                data: [
                                    { id: 1, text: result.name, start_date: d3, duration: 5, progress: 0.4, open: true },
                                    { id: 2, text: "Inicio", start_date: d3, duration: 1, progress: 0.6, parent: 1 }
                                ],
                                links: [
                                    {id: 1, source: 1, target: 2, type: "1"},
                                    
                                ]
                            });
          */
          
                            }
                            else{
                              boton_fecha =" Fecha Sin Formato";
                              /*
                              gantt.parse({
                                data: [
                                    { id: 1, text: "Seleccione Un objeto", start_date: "25-05-2021", duration:1, progress: 0.4, open: true },
                                    { id: 2, text: "Inicio", start_date: "25-05-2021", duration: 1, progress: 0.6, parent: 1 }
                                ],
                                links: [
                                    {id: 1, source: 1, target: 2, type: "1"}
                                  
                                ]
                            });
                            */
                            }
                          }
                        }
                        
                    
                 
          
                    
                    document.getElementById("propiedades_id").innerHTML += " AEC Secuencia Hormigonado <li><b>"+" :</b>"+base+" Estado: "+boton_fecha+"</li>";
                 
                    
                //    console.log("VALORES");
                //   console.log(result);
                    
                }) ;
           
                $("#dateMask1").val(base);
                $("#plan1").val(plan);
                $("#dateMask2").val(base);
                $("#plan2").val(plan);
            }
          
            document.getElementById("id_seleccionados").value =selects.join();
            document.getElementById("id_seleccionados2").value =selects.join();
            document.getElementById("id_seleccionados3").value =selects.join();
            document.getElementById("id_seleccionados4").value =selects.join();
            
            document.getElementById("elementos_seleccionados").innerHTML = "";
            let boton_guardar = "<a class='btn ripple btn-info' data-target='#modaldemo4' data-toggle='modal' href=''>Guardar Selección</a>";
          
            document.getElementById("elementos_seleccionados").innerHTML = " Selección Activa "+"\n"+boton_guardar;
            
        //   gantt.selectTask(dbId);
          

          
            

            viewer.model.getBulkProperties(dbId, ['Name','Level','Area','Volume','Thickness'], (result) => {
                let test = result.filter(x => x.properties[0].displayValue !== '');
                let data = {};
                test.forEach(elements => {
                  console.log('Elementos');
                  console.log(elements);
                  if(elements.length >=5){
                    let name= elements.properties[0].displayValue;
                      let level= elements.properties[1].displayValue;
                      let struct= elements.properties[2].displayValue;
                      let area= elements.properties[3].displayValue;
                      let vol= elements.properties[4].displayValue;
                  }
                  else{
                    if(elements.properties[0]){
                      let name= elements.properties[0].displayValue;
                    }
                    if(elements.properties[1]){
                      let level= elements.properties[1].displayValue;
                    }
                   
                  } 
                  
                
                  });
                  
              }, (error) => {
                  reject(error);
              });
    });
     
    
  });

}



$('#ha_option').change(function() {
  var selected_ha_option = $('#ha_option').val();
  console.log("Selección filtro 1");
  console.log(selected_ha_option);  
  filtros_selec_ha= Object.values(selected_ha_option);

  
 // // // // // // // // // // alert(filtros_selec_ha[0]);
});

$('#piso_option').change(function() {
  var  selected_piso_option = $('#piso_option').val();
 // console.log("Selección filtro 2");
 // console.log(selected_piso_option);
 
  filtros_selec_piso= Object.values(selected_piso_option);
  
 
  //// // // // // // // // // alert(filtros_selec_piso[0]);
});

function selecciona(clave,filt){

  //  // // // // // // // // // alert( "Valor Seleccionado " +clave);

    valor_fil1 = clave;
/*    consulta_filtro(filt).then((data) => {
           let keys = Object.keys(data);
           
           let dbIds = data[clave].dbIds;                        
              viewer.isolate(dbIds);
              viewer.fitToView(dbIds, viewer.model);
    });
    
*/
}

function selecciona2(clave,filt){
//    // // // // // // // // // alert( "Valor Seleccionado " +clave);

    valor_fil2 = clave;
  /*  consulta_filtro(filt).then((data) => {
           let keys = Object.keys(data);
           
           let dbIds = data[clave].dbIds;                        
              viewer.isolate(dbIds);
              viewer.fitToView(dbIds, viewer.model);
    });
    
  */
}

function quitar_filtros(){
  estado_filtro = 0;
  filtros_selec_piso = [];
  filtros_selec_ha =[];
  $("#ha_option").select2("val", "0");
  $("#piso_option").select2("val", "0");
  viewer.isolate();
 // viewer.fitToView( viewer.model);
//	gantt.clearAll(); 

 // gantt.init("gantt_here");
  //location.reload();

  /* gantt.config.columns = [
        {name: "text", tree: true, width: 180, resize: true},
        {name: "start_date", align: "center", resize: true},
        {name: "duration", align: "center"},
        {name: "buttons", label: "Actions", width: 120, template: function(task){
          var buttons = 
          '<input type=button value="Filtrar" onclick=seleccion_modelo('+task.id+')>';
          return buttons; 
        }}
      ];*/
  /*    gantt.parse({
        "data": [
          {"id": 11, "text": "PROYECTO", type: gantt.config.types.project, "progress": 0.6, "open": true},
          {"id": 13, "text": "Walls", "start_date": "01-04-2021",  type: gantt.config.types.project,"parent": "11", "progress": 1, "open": true},
          {"id": 14, "text": "Columns", "start_date": "01-04-2021",  type: gantt.config.types.project, "parent": "11", "progress": 1, "open": true},
          {"id": 15, "text": "Framing", "start_date": "01-04-2021",  type: gantt.config.types.project, "parent": "11", "progress": 1, "open": true},
          {"id": 20, "text": "Foundation - Wall", "start_date": "01-04-2021",  type: gantt.config.types.project, "parent": "11", "progress": 1, "open": true},
          {"id": 21, "text": "Foundation - Aislada", "start_date": "01-04-2021",  type: gantt.config.types.project, "parent": "11", "progress": 1, "open": true},
          {"id": 22, "text": "Foundation - Slab", "start_date": "01-04-2021",  type: gantt.config.types.project, "parent": "11", "progress": 1, "open": true},
          {"id": 23, "text": "Floors", "start_date": "01-04-2021",  type: gantt.config.types.project, "parent": "11", "progress": 1, "open": true},
        ]
      });*/
      console.log("CLEAR !!");
    
    //  document.getElementById('largo').innerHTML = '';
    //  document.getElementById('acum').innerHTML = '' ;
    //  document.getElementById('peso').innerHTML = '' ;
     // document.getElementById('btn').innerHTML = '' ;
      
      var tableHeaderRowCount = 1;
      var tableRef = document.getElementById('tabla_fierro');
      var tableTotales = document.getElementById('tabla_total');
      
      var rowCount = tableRef.rows.length;
      for (var i = tableHeaderRowCount; i < rowCount; i++) {
        tableRef.deleteRow(tableHeaderRowCount);
      }
     
 // gantt.refreshData();


 // gantt.init("gantt_here");

 getFiltros();

  //getFiltros_2();
  //gantt.render();
}


function buscaKeys(arr_objetivos,arr_listado){
  var resultado_busqueda = [];
  var cont = 0;
  console.log("ARRAY LISTADO");
  console.log(arr_listado);
 if(arr_listado.length && arr_objetivos.length){
    for(var i =0; i<arr_listado.length;i++){
      for(var j = 0; j<arr_objetivos.length; j++){
        console.log("valores arr y keys : "+arr_listado[i]+"  "+arr_objetivos[j]);
        if(arr_listado[i] === arr_objetivos[j] ){
          
          if(cont ==0){
            resultado_busqueda = [i];
            cont++;
          }
          else{
            resultado_busqueda.push(i);

          }
        }
      }
  }
 }

  console.log("RESULTADO BUSQUEDA BUSCA KEYS");
  console.log(resultado_busqueda);
  return resultado_busqueda;
}

function filtro_visual2(nombre_cat_filtro,valor_filtro,piso){
  
  




}

function filtro_visual_ha(nombre_cat_filtro,valor_filtro,piso){
  console.log("FILTRO VISUAL HA");
  console.log(nombre_cat_filtro);
  //console.log(valor);
  //console.log(valor_aec_piso);
  viewer.isolate();
  var contador_lg = 0;
  identificadores = Array();
  contador_lg = 0;
  peso = 0;
  pesoTotal = 0;
 
  estado_filtro = 1;
  let mensaje_1;
  let mensaje_2;
  var elem = [0];
  var referencia = Array();
  referencia2 = Array();
  var elem  = Array();
  pesoTotal = 0;

  filtros_selec_piso.length =0;
  filtros_selec_ha.length =0;

  //filtros_selec_piso.push(valor_filtro);
  filtros_selec_ha.push(valor_filtro);

  parametro_nivel1 = "";
  parametro_nivel = nombre_cat_filtro;
  if(piso == '1'){
    parametro_nivel1 = nombre_cat_filtro;
  }
  if(piso == '2'){
    parametro_nivel2 = nombre_cat_filtro;
  }
  if(piso == '3'){
    parametro_nivel3 = nombre_cat_filtro;
  }
  if(piso == '4'){
    parametro_nivel4 = nombre_cat_filtro;
  }
  if(piso == '5'){
    parametro_nivel5 = nombre_cat_filtro;
  }
  if(piso == '6'){
    parametro_nivel6 = nombre_cat_filtro;
  }

  console.log("VALORES FILTROS VER");
  console.log(filtros_selec_piso);
  console.log(filtros_selec_ha[0]);
  valor_fil2 = filtros_selec_piso[0];
  valor_fil1 = filtros_selec_ha[0];
  if(typeof(valor_fil2) ==="undefined"){
    valor_fil2 = "sinvalor";
  }
  if(typeof(valor_fil1) ==="undefined"){
    valor_fil1 = "sinvalor";
  }
  console.log("VALORES FILTROS VER");
  console.log(filtros_selec_piso);
  console.log(filtros_selec_ha[0]);
  valor_fil2 = filtros_selec_piso[0];
  valor_fil1 = filtros_selec_ha[0];

  if(typeof(valor_fil2) ==="undefined"){
    valor_fil2 = "sinvalor";
  }
  if(typeof(valor_fil1) ==="undefined"){
    valor_fil1 = "sinvalor";
  }
//// // // // // // // // // alert("Valor Parámetro 1: "+valor_fil1 + "   Val. Parámetro 2: "+valor_fil2 );
/******************************************************************************
* 
* 
* CASO 1 - FILTRO PISO  AEC
* 
*/
if(( valor_fil2=== 'sinvalor' || valor_fil2 === "") && valor_fil1 !=="" ){ //AEC
  console.log("VALORES AEC COMPROBACION");
  console.log(valor_fil2+"  "+valor_fil2+"  "+valor_fil1);
     let filt = [parametro_nivel];
     var resultado_ids =Array();
     resultado_ids.length = 0;
     consulta_filtro2([parametro_nivel]).then((data) => {
     let keys = Object.keys(data);
     let elementos =Array();
     elementos.length = 0;
     elementos = buscaKeys(filtros_selec_ha,keys);
     console.log("ELEMENTOS PREVIO PROCESO");
     console.log(elementos);
     var identificadores=Array();
     identificadores.length = 0;
     referencia.length = 0;
     referencia2.length = 0;
     let dbIds = Array();
     dbIds.length = 0;

    if(elementos.length == 0 && elementos.length && elementos){
  //    // // // // // // // // // alert("No hay resultados");
    }else{
        console.log("FILTRADOS PINTAR "+elementos.length);
        for(var a = 0; a<elementos.length;a++){
            if(a==0){
              dbIds = data[keys[elementos[a]]].dbIds;              
              referencia.push(dbIds);
              referencia2.push(dbIds);
              identificadores = dbIds;
            }
            else{
              referencia.push((data[keys[elementos[a]]].dbIds));
              referencia2.push((data[keys[elementos[a]]].dbIds));
              identificadores = dbIds.concat(data[keys[elementos[a]]].dbIds);

              dbIds = identificadores;
            }
        }
        resultado_ids = referencia;
    }
    viewer.isolate(identificadores);
    console.log("IDENTIFICADORES");
    console.log(identificadores);
    viewer.fitToView(identificadores, viewer.model);
    idsSeleccionados.length = 0;
    idsSeleccionados = identificadores;     
    var largoTotal = 0;
    var xTotal = 0;
    console.log("RESULTADOS DE IDS FILTRO");
    console.log(resultado_ids);
    console.log(resultado_ids[0]);
    peso = 0;
    pesoTotal = 0;
    for(var a=0; a<= identificadores.length;a++){
      console.log("valor de A FINAL " +a + "valor de LARGO " +identificadores.length);
      if(a == identificadores.length){
         console.log("FINALIZADO ");
         console.log( pesos_piso3+"  "+pesos_piso4);
      }else{
          let actual =  identificadores;

          viewer.getProperties( identificadores[a], (result) => { 
          console.log("RESPUESTA para A lvl "+ a + " && "+identificadores.length);
          console.log(result);
          contador_lg = contador_lg+1;
          for(i=0 ;i< 60;i++){
            if(result.properties[i] && result.properties[i].displayName){
              let nombre_actual = ""+result.properties[i].displayName;
              if(nombre_actual ==="Category"){
                categoria_actual_obj = result.properties[i].displayValue;
                console.log("valor categoria actual5: "+categoria_actual_obj); 
                 
                if(categoria_actual_obj==parametro_fierro){
                  for(t=0;t<result.properties.length;t++){
                  
                    let val_actual = result.properties[t].displayName;
                    if( val_actual == "RS Peso Lineal (kg/m)"){
                      console.log("ENTRO A PESO LINEAL HA");
                      let peso = parseFloat(result.properties[t].displayValue);
                      
                      console.log("ANTES PESO BUSCADO HA");
                      console.log(peso);
                      console.log(result.properties[t].displayValue);
                      console.log(result);
                    
                      peso = parseFloat(peso);
                      pesoActual = peso;
                      console.log("PESO BUSCADO HA");
                      console.log(peso);
                  
               
              //    pesoTotal  = parseFloat(pesoTotal).toFixed(2);
                  //   console.log( pesoTotal);
                    }
                    if(val_actual == "Total Bar Length"){
                      console.log("TOTAL LENGTH BAR HA");
                      
                      let largo = parseFloat(result.properties[t].displayValue);
                      largo = largo.toFixed(0);
                      console.log(largo );
                      
                      largo = parseFloat(largo,0);
                      largo = largo /100;
                      largoActual = largo;
                      console.log("convertido HA "+largo);
                     // listado_largos = listado_largos+","+largo;
                      //listado_pesos = listado_pesos + ","+peso;
                      //largoTotal = largoTotal+ largo;
                     // largoTotal = largoTotal;
                      //console.log( "SUMATORIA LARGO");
                      //console.log( largoTotal);
                      //console.log( "Listado largos");
                      //console.log(listado_largos);
                     
                    }
                    if((t+1 )==result.properties.length){ // termina de recorrer todas las propiedades
                      let resultado_mul = pesoActual*largoActual;
                      resultado_mul.toFixed(0);
                      pesoActual = 0;
                      largoActual = 0;
                     // document.getElementById('largo').innerHTML = '' +largoTotal.toFixed(2)+ ' mtrs';
                      console.log("ANTES DE PISO");
                     if(piso == '1'){
                      //   pesos_piso1 = pesoTotal;
                         pesos_ha1 =  pesos_ha1 + resultado_mul;
                         console.log("Peso ha 1 "+pesos_ha1);
                         resultado_mul = 0;
                         identificadores = Array();
                         contador_lg = 0;
                    
                       }
                       if(piso == '2'){
                        
                         pesos_ha2 =  pesos_ha2 + resultado_mul;
                         console.log("Peso piso ha 2 "+pesos_ha2 +"   "+ resultado_mul );
                        // pesoTotal = 0;
                         identificadores = Array();
                         contador_lg = 0;
                       }
                       if(piso == '3'){
                        pesos_ha3 =  pesos_ha3 + resultado_mul;
                         console.log("Peso piso ha 3 "+pesos_ha3);
                       //  pesoTotal = 0;
                         identificadores = Array();
                         contador_lg = 0;
                       }
                       if(piso == '4'){
                        pesos_ha4 =  pesos_ha4 + resultado_mul;
                         console.log("Peso piso 4 "+pesos_ha4);
                        //  pesoTotal = 0;
                         identificadores = Array();
                         contador_lg = 0;
                       }
                       if(piso == '5'){
                        pesos_ha5 = pesos_ha5 + resultado_mul;
                        console.log("Peso piso ha 5 "+pesos_ha5);
                       //  pesoTotal = 0;
                        identificadores = Array();
                        contador_lg = 0;
                      }
                      if(piso == '6'){
                        pesos_ha6 = pesos_ha6 + resultado_mul;
                        console.log("Peso piso ha 6 "+pesos_ha6);
                       //  pesoTotal = 0;
                        identificadores = Array();
                        contador_lg = 0;
                      }    
                    //  let resultado_mul = pesoActual*largoActual;
                     // pesoTotal = pesoTotal+resultado_mul;
                      //  $("#largo_total_pedido").val(largoTotal.toFixed(0));
                     //   $("#peso_total_pedido").val( pesoTotal.toFixed(0));
                     //   $("#resultado_total_pedido").val( pesoTotal);
                    //    document.getElementById('peso').innerHTML = '' + pesoTotal.toFixed(0)+ ' Kgs';
 
                   //     $("#listado_largo").val(listado_largos);
                   //    $("#listado_pesos").val(listado_pesos);
                       //console.log( "Resultado Multiplicación");
                     // console.log( resultado_mul);
                   
                  //      resultado_mul =resultado_mul.toFixed(0);
                  //      xTotal = xTotal + parseFloat(resultado_mul);
                  // //      console.log( "Total Multiplicación");
                 //       console.log( xTotal);
                    //   document.getElementById('acum').innerHTML = '' +xTotal.toFixed(0);
 
                   //     document.getElementById('btn').innerHTML = '<button  class="btn btn-success btn-block" data-target="#modaldemo6" data-toggle="modal" ">Ejecutar Pedido <i class="icon ion-ios-arrow-left tx-11 mg-l-6"></i></button>';
                      // let g = name.split(' ');
                     //  let y = g[2];
                     
                   }
                  }
              //    pesoTotal  = parseFloat(pesoTotal).toFixed(2);
                  
                
               //   let name = result.name;
                //  peso = parseFloat(peso,0);
                //  largo = parseFloat(largo,0);
                //  let resultado_mul = peso*largo;
                  //console.log( "Resultado Multiplicación");
                // console.log( resultado_mul);
              
             //     resultado_mul =resultado_mul.toFixed(2);
             //     xTotal = xTotal + parseFloat(resultado_mul);
              //    console.log( "Total Multiplicación");
               //   console.log( xTotal);
               //   let g = name.split(' ');
                //  let y = g[2];
        
                }
              
              }
            
            }
           
          }
          
        }) 
      }
    }
  });


}

}
function filtro_visual(){
  estado_filtro = 1;
  let mensaje_1;
  let mensaje_2;
  var elem = [0];
  var referencia = Array();
  referencia2 = Array();
  var elem  = Array();
  $("#id_seleccionados4").val('');
  $("#fecha_pedido_fierro").val('');
  $("#nombre_pedido").val('');

  $("#listado_largo").val('');
  $("#listado_pesos").val('');

  $("#largo_total_pedido").val('');
  $("#peso_total_pedido").val('');
  $("#resultado_total_pedido").val();
  let fecha_actual = setFechaActualPedido();
  $("#fecha_pedido_fierro").val(fecha_actual);
  if(valor_fil1 === ""){
      mensaje_1 ="Sin Selección";
  }else{
    mensaje_1 = valor_fil1;
  }

   if(valor_fil2 === ""){
      mensaje_2 ="Sin Selección";
    }else{
      mensaje_2  = valor_fil2;
    }
    console.log("VALORES FILTROS VER");
    console.log(filtros_selec_piso);
    console.log(filtros_selec_ha[0]);
    valor_fil2 = filtros_selec_piso[0];
    valor_fil1 = filtros_selec_ha[0];
    if(typeof(valor_fil2) ==="undefined"){
      valor_fil2 = "sinvalor";
    }
    if(typeof(valor_fil1) ==="undefined"){
      valor_fil1 = "sinvalor";
    }
  //// // // // // // // // // alert("Valor Parámetro 1: "+valor_fil1 + "   Val. Parámetro 2: "+valor_fil2 );
 /******************************************************************************
  * 
  * 
  * CASO 1 - FILTRO PISO  AEC
  * 
  */
  if(valor_fil2 !== "" && (valor_fil1 ==="" || valor_fil1=== 'sinvalor') ){ // piso

   let filt = [parametro_nivel];

   var resultado_ids;
      consulta_filtro2([parametro_nivel]).then((data) => {
      let keys = Object.keys(data);
      
      let elementos = buscaKeys(filtros_selec_piso,keys)
      var identificadores =0;
      let dbIds =0;
     
      if(elementos.length == 0 && elementos.length && elementos){
    //    // // // // // // // // // alert("No hay resultados");
      }else{
        console.log("FILTRADOS PINTAR "+elementos.length);
        for(var a = 0; a<elementos.length;a++){
             if(a==0){
               dbIds = data[keys[elementos[a]]].dbIds;              
               referencia.push(dbIds);
               referencia2.push(dbIds);
               identificadores = dbIds;
             }
             else{
               referencia.push((data[keys[elementos[a]]].dbIds));
               referencia2.push((data[keys[elementos[a]]].dbIds));
               identificadores = dbIds.concat(data[keys[elementos[a]]].dbIds);

               dbIds = identificadores;
             }
        }

        resultado_ids = referencia;

      }

      viewer.isolate(identificadores);
      console.log("IDENTIFICADORES");
      console.log(identificadores);
      viewer.fitToView(identificadores, viewer.model);
      idsSeleccionados =[];
      idsSeleccionados = identificadores;
    //  gantt.clearAll();
    //  gantt.init("gantt_here");
     
     
     //  gantt.attachEvent("onTaskClick", function(id, e) {
     //  viewer.isolate([ parseInt(id)]);
       // viewer.fitToView(parseInt(id), viewer.model);
        //viewer.setThemingColor(id,  red, viewer.model);
       // viewer.setThemingColor(1604, new THREE.Vector4(0, 1, 1,1));
    // });
      let c =1;
      var hoy = 10 + '-' +05 + '-' +2021;
      var cat_count=1;
      var esta =0;
      var categorias = Array();
      var categoria_actual;
      var indice_actual = 0;
      var pesoTotal = 0;
      var largoTotal = 0;
      var xTotal = 0;
      var parametro_fecha;
    
      

   
      console.log("RESULTADOS DE IDS FILTRO");
      console.log(resultado_ids);
      console.log(resultado_ids[0]);
      for(var a=0; a< identificadores.length;a++){
          let actual =  identificadores;
       
       
        
          viewer.getProperties( identificadores[a], (result) => { 
            console.log("RESPUESTA");
            console.log(result);
            for(i=0 ;i< 60;i++){
              let nombre_actual = ""+result.properties[i].displayName;
              if(nombre_actual ==="Category"){
                categoria_actual_obj = result.properties[i].displayValue;
              
                console.log("valor categoria actual4: "+categoria_actual_obj);
                
                if(categoria_actual_obj==parametro_fierro){
                  let peso = parseFloat(result.properties[82].displayValue);
                  
                  peso = peso.toFixed(2);
                  peso = parseFloat(peso);
                
                  console.log("PESO BUSCADO333");
                  console.log(peso);
                  let actuales = $("#id_seleccionados3").val();
                  actual =   actual+","+actuales;
                  
                  pesoTotal = pesoTotal+peso;
              //    pesoTotal  = parseFloat(pesoTotal).toFixed(2);
                  console.log( "SUMATORIA PESO");
                  console.log( pesoTotal);
                //  document.getElementById('peso').innerHTML = '' +pesoTotal.toFixed(2);
                  let largo = parseFloat(result.properties[46].displayValue);
                  largo = largo.toFixed(2);
                  largo = parseFloat(largo,0);
                  console.log( "Largo");
                  console.log( largo);
                  
                  listado_pesos = listado_pesos +","+peso;
                  listado_largos = listado_largos +","+largo;
                  $("#id_seleccionados3").val(actual);
                  console.log("EDITO SELECCIONADOS ");
                  $("#id_seleccionados4").val(actual);
                  $("#listado_largo").val(listado_largos);
                  $("#listado_pesos").val(listado_pesos);

                  console.log( typeof largo);
                  largoTotal = largoTotal+ largo;
                  console.log( "SUMATORIA LARGO");
                  console.log( largoTotal);
                
                // document.getElementById('largo').innerHTML = '';
                // document.getElementById('largo').innerHTML = '' +largoTotal;
                
                  let name = result.name;
                  peso = parseFloat(peso,0);
                  largo = parseFloat(largo,0);
                  let resultado_mul = peso*largo;
                  //console.log( "Resultado Multiplicación");
                // console.log( resultado_mul);
              
                 // resultado_mul =resultado_mul.toFixed(2);
                  xTotal = xTotal + parseFloat(resultado_mul);
                console.log( "Total Multiplicación");
                console.log( xTotal);
              //   document.getElementById('acum').innerHTML = '' +xTotal.toFixed(2);

                //  document.getElementById('btn').innerHTML = '<button  class="btn btn-success btn-block" data-target="#modaldemo6" data-toggle="modal" ">Ejecutar Pedido <i class="icon ion-ios-arrow-left tx-11 mg-l-6"></i></button>';
                  let g = name.split(' ');
                  let y = g[2];
        
          
                  
                  // Inserta una fila en la tabla, en el índice 0
                
                
                }
                if(cat_count == 1){ // no hay ningun elemento
                    indice_actual = 0;
                    categorias.push(result.properties[i].displayValue);
                    categoria_actual = result.properties[i].displayValue;
                    cat_count =cat_count +1;
                //    console.log("entre una vez "+ cat_count );
              
              /*
                    var taskId = gantt.addTask({
                      id:cat_count,
                      text:result.properties[i].displayValue,
                      start_date:hoy,
                      duration:1
                    });
              */   
                }else{
                  // busco si se encuentra
                //   console.log("GUARDAFDAS //////////////////////////////");
                //   console.log(categorias);
                    for(var t =0 ; t< cat_count; t++){
                        if( result.properties[i].displayValue === categorias[t]){
                          esta = 1; 
                          indice_actual = t;
                          break
                        }
                    }
                    if(esta ==0){ // no se encontró  se procede a agregar la nueva categoria
                      categorias.push(result.properties[i].displayValue);
                      cat_count =cat_count +1;
                      indice_actual = cat_count -1;
                      // console.log("agregue nuevo "+ cat_count);
                    
                
                  /*   var taskId = gantt.addTask({
                                            id:cat_count,
                                            text:result.properties[i].displayValue,
                                            start_date:hoy,
                                            duration:1
                        },11);*/
              //      gantt.sort("start_date",false);
              //      gantt.render();
                  
                    }
                    else{
                      esta = 0;
                    }
                  }
              }
              if(nombre_actual  === parametro_fecha){
        
                fecha_hormigonado = result.properties[i].displayValue;

                if(fecha_hormigonado.length >0 && fecha_hormigonado != "undefined"){
                  let elementos_fecha = fecha_hormigonado.split("/");
                  if(elementos_fecha.length>0 && fecha_hormigonado != "xx" && fecha_hormigonado != ""){
                    var today = new Date();
                    var dd = String(today.getDate()).padStart(2, '0');
                    var mm = String(today.getMonth() + 1).padStart(2, '0'); //
                    var yyyy = today.getFullYear();
                    if(mm>0){
                      mm = mm-1; 
                    }
                    today = '0'+mm + '/' + dd + '/' + yyyy;
                    if(elementos_fecha[1] >0){
                      elementos_fecha[1] = elementos_fecha[1]-1;
                    }
          
                    var d3=  '0'+elementos_fecha[1]+"-"+elementos_fecha[0]+"-"+elementos_fecha[2]; // FECHA PLAN
                    var d4 = elementos_fecha[0]+"-"+elementos_fecha[1]+"-"+elementos_fecha[2]; // FECHA PLAN
                
                
                    let resultado  = [result.name,d3];
                    c++;
                
              /*     gantt.addTask({
                              id:actual,
                              text:result.name,
                              start_date:d4,
                              duration:1
                          },11,1); */
                  // console.log("actual  "+parseIntcategorias[indice_actual]+" && "+indice_actual);
              //    gantt.sort("start_date",false);
              //    gantt.render();
                  break 
                /*
                var taskId = gantt.addTask({
                        id:actual,
                        text:result.name,
                        start_date:d4,
                        duration:1
                    });
                */
                  }
                
                  //cabecera = cabecera +body+" ]  });";
    
                }
        
              }
            }
          
            if((a) ==  identificadores.length ){
            
                console.log("PESO TOTAL FINAL "+pesoTotal);
                return pesoTotal;
            }
        }) 
       
       
        
      }
     
       /*
      gantt.config.columns = [
        {name: "text", tree: true, width: 180, resize: true},
        {name: "start_date", align: "center", resize: true},
        {name: "duration", align: "center"},
        {name: "buttons", label: "Actions", width: 120, template: function(task){
          var buttons = 
          '<input type=button value="Filtrar" onclick=seleccion_modelo('+task.id+')>';
          return buttons; 
        }}
      ];*/
    });

    
  }
  //********** */ piso y particion ha //********** */ piso y particion ha//********** */ piso y particion ha
  //********** */ piso y particion ha
  //********** */ piso y particion ha//********** */ piso y particion ha

   /******************************************************************************
  * 
  * 
  * CASO 2 - FILTRO PISO  & HORIZONTAL
  * 
  */
  if(( valor_fil2 !== "sinvalor") && (valor_fil1 !=="sinvalor" )){ 
    console.log("ENTRO EN HA SOLO1");
    console.log(valor_fil2);
    console.log("ENTRO EN HA SOLO1");
    console.log(valor_fil1);
    
  //  let filt = ['AEC Piso','AEC Partición HA'];
  let filt = [filtro_1,filtro_2]; 
  var resultado_ids;
     consulta_filtro2([filtro_1,filtro_2]).then((data) => {
      let keys = Object.keys(data);
      let elementos =[];
      elementos = buscaKeys(filtros_selec_piso,keys);
      var identificadores =0;
      let dbIds =0;
     
      if(elementos.length == 0){
    //    // // // // // // // // // alert("No hay resultados");
      }else{
        for(var a = 0; a<elementos.length;a++){
             if(a==0){
               dbIds = data[keys[elementos[a]]].dbIds;              
               referencia.push(dbIds);
               referencia2.push(dbIds);
               identificadores = dbIds;
             }
             else{
               referencia.push((data[keys[elementos[a]]].dbIds));
               referencia2.push((data[keys[elementos[a]]].dbIds));
               identificadores = dbIds.concat(data[keys[elementos[a]]].dbIds);

               dbIds = identificadores;
             }
        }

        resultado_ids = referencia;

      }
      viewer.isolate(identificadores);
      viewer.fitToView(identificadores, viewer.model);
      referencia2 = identificadores;
    //  gantt.clearAll();
   //   gantt.init("gantt_here",null,"month");
     
     
     //  gantt.attachEvent("onTaskClick", function(id, e) {
     //  viewer.isolate([ parseInt(id)]);
       // viewer.fitToView(parseInt(id), viewer.model);
        //viewer.setThemingColor(id,  red, viewer.model);
       // viewer.setThemingColor(1604, new THREE.Vector4(0, 1, 1,1));
   //  });
      let c =1;
      var hoy = 10 + '-' +05 + '-' +2021;
      var cat_count=1;
      var esta =0;
      var categorias = Array();
      var categoria_actual;
      var indice_actual = 0;
      var pesoTotal = 0;
      var largoTotal = 0;
      var xTotal = 0;

      var tableTotales = document.getElementById('tabla_total');
      var tableRef = document.getElementById('tabla_fierro');

     // document.getElementById('peso').innerHTML = '';
     // document.getElementById('largo').innerHTML = '' ;
     // document.getElementById('acum').innerHTML = '' ;
      $("#id_seleccionados4").val("");
      $("#id_seleccionados3").val("");
      var rowCount = tableRef.rows.length;
      rowCountTotales = tableTotales.rows.length;
      var tableHeaderRowCount = 1;
     
      
      
      for (var i = tableHeaderRowCount; i < rowCount; i++) {
        tableRef.deleteRow(tableHeaderRowCount);
      }
      for(var a=0; a< identificadores.length;a++){
        let actual =  identificadores[a];
        
        viewer.getProperties( identificadores[a], (result) => { 
         
          for(i=0 ;i< result.properties.length;i++){
            let nombre_actual = ""+result.properties[i].displayName;
            if(nombre_actual ==="Category"){
              categoria_actual_obj = result.properties[i].displayValue;
              console.log("CATEGORIA BUSCADA");
              console.log(categoria_actual_obj);
              if(categoria_actual_obj==parametro_fierro){
                let peso = parseFloat(result.properties[82].displayValue);
                peso = peso.toFixed(2);
                console.log("PESO BUSCADO222");
                console.log(peso);
                let actuales = $("#id_seleccionados3").val();
                actual =   actual+","+actuales;
                $("#id_seleccionados3").val(actual);
                $("#id_seleccionados4").val(actual);
                pesoTotal = pesoTotal+parseFloat(peso,0);
            //    pesoTotal  = parseFloat(pesoTotal).toFixed(2);
                console.log( "SUMATORIA PESO");
                console.log( pesoTotal);
                document.getElementById('peso').innerHTML = '' +pesoTotal.toFixed(2);
                let largo = parseFloat(result.properties[46].displayValue);
                largo = largo.toFixed(2);
                largo = parseFloat(largo,0);
                console.log( "Largo");
                console.log( largo);
                console.log( typeof largo);
                largoTotal = largoTotal+ largo;
                console.log( "SUMATORIA LARGO");
                console.log( largoTotal);
              
               // $("#id_seleccionados4").val(actual);
                listado_pesos = listado_pesos +","+peso;
                listado_largos = listado_largos +","+largo;
                $("#listado_largo").val(listado_largos);
                $("#listado_pesos").val(listado_pesos);
               // document.getElementById('largo').innerHTML = '' +largoTotal;
                let name = result.name;
                peso = parseFloat(peso,0);
                largo = parseFloat(largo,0);
                let resultado_mul = peso*largo;
                //console.log( "Resultado Multiplicación");
               // console.log( resultado_mul);
             
                resultado_mul =resultado_mul.toFixed(2);
                xTotal = xTotal + parseFloat(resultado_mul);
               console.log( "Total Multiplicación");
               console.log( xTotal);
              //  document.getElementById('acum').innerHTML = '' +xTotal.toFixed(2);

             //   document.getElementById('btn').innerHTML = '<button  class="btn btn-success btn-block" data-target="#modaldemo6" data-toggle="modal" ">Ejecutar Pedido <i class="icon ion-ios-arrow-left tx-11 mg-l-6"></i></button>';
                let g = name.split(' ');
                let y = g[2];
       
        
                $("#largo_total_pedido").val(largoTotal);
                $("#peso_total_pedido").val(pesoTotal.toFixed(2));
                $("#resultado_total_pedido").val(resultado_mul);
                // Inserta una fila en la tabla, en el índice 0

                //$("#id_seleccionados4").val(actual);
                $("#listado_largo").val(listado_largos);
                $("#listado_pesos").val(listado_pesos);
              
               }
               if(cat_count == 1){ // no hay ningun elemento
                   indice_actual = 0;
                   categorias.push(result.properties[i].displayValue);
                   categoria_actual = result.properties[i].displayValue;
                   cat_count =cat_count +1;
               //    console.log("entre una vez "+ cat_count );
               
            /*       var taskId = gantt.addTask({
                    id:cat_count,
                    text:result.properties[i].displayValue,
                    start_date:hoy,
                    duration:1
                  },11,1);
              */    
               }else{
                 // busco si se encuentra
              //   console.log("GUARDAFDAS //////////////////////////////");
              //   console.log(categorias);
                  for(var t =0 ; t< cat_count; t++){
                      if( result.properties[i].displayValue === categorias[t]){
                        esta = 1; 
                        indice_actual = t;
                        break
                      }
                  }
                  if(esta ==0){ // no se encontró  se procede a agregar la nueva categoria
                    categorias.push(result.properties[i].displayValue);
                    cat_count =cat_count +1;
                    indice_actual = cat_count -1;
                    // console.log("agregue nuevo "+ cat_count);
                  
                  
            /*        var taskId = gantt.addTask({
                                          id:cat_count,
                                          text:result.properties[i].displayValue,
                                          start_date:hoy,
                                          duration:1
                      },11,1);*/
           //       gantt.sort("start_date",false);
            //      gantt.render();
                  
                  }
                  else{
                    esta = 0;
                  }
                }
            }
            if(nombre_actual  === parametro_fecha){
      
              fecha_hormigonado = result.properties[i].displayValue;

              if(fecha_hormigonado.length >0 && fecha_hormigonado != "undefined"){
                let elementos_fecha = fecha_hormigonado.split("/");
                if(elementos_fecha.length>0 && fecha_hormigonado != "xx" && fecha_hormigonado != ""){
                  var today = new Date();
                  var dd = String(today.getDate()).padStart(2, '0');
                  var mm = String(today.getMonth() + 1).padStart(2, '0'); //
                  var yyyy = today.getFullYear();
                  if(mm>0){
                     mm = mm-1; 
                  }
                  today = '0'+mm + '/' + dd + '/' + yyyy;
                  if(elementos_fecha[1] >0){
                    elementos_fecha[1] = elementos_fecha[1]-1;
                  }
        
                  var d3=  '0'+elementos_fecha[1]+"-"+elementos_fecha[0]+"-"+elementos_fecha[2]; // FECHA PLAN
                  var d4 = elementos_fecha[0]+"-"+elementos_fecha[1]+"-"+elementos_fecha[2]; // FECHA PLAN
               
               
                  let resultado  = [result.name,d3];
                  c++;
               
            /*     gantt.addTask({
                            id:actual,
                            text:result.name,
                            start_date:d4,
                            duration:1
                        },11,1); 
                // console.log("actual  "+parseIntcategorias[indice_actual]+" && "+indice_actual);
                 gantt.sort("start_date",false);
                 gantt.render();*/
                 break 
               
           /*     var taskId = gantt.addTask({
                      id:actual,
                      text:result.name,
                      start_date:d4,
                      duration:1
                  });
                */

                }
              
                //cabecera = cabecera +body+" ]  });";
  
              }
      
             }
          }
          
        }) 
    
      }
       
   /*   gantt.config.columns = [
        {name: "text", tree: true, width: 180, resize: true},
        {name: "start_date", align: "center", resize: true},
        {name: "duration", align: "center"},
        {name: "buttons", label: "Actions", width: 120, template: function(task){
          var buttons = 
          '<input type=button value="Filtrar" onclick=seleccion_modelo('+task.id+')>';
          return buttons; 
        }}
      ];*/
    });
  }


  if(( valor_fil2=== 'sinvalor' || valor_fil2 === "") && valor_fil1 !==""){ // partición ha
    console.log("ENTRO EN HA SOLO2");
     let filt = [filtro_1];
     var resultado_ids;
     consulta_filtro2([filtro_1]).then((data) => {
      let keys = Object.keys(data);
      
      let elementos = buscaKeys(filtros_selec_ha,keys)
      var identificadores =0;
      let dbIds =0;
      console.log("ELEMENTOS FILTRADOS");
     console.log(elementos);
      if(elementos.length == 0){
     //   // // // // // // // // // alert("No hay resultados");
      }else{
        for(var a = 0; a<elementos.length;a++){
             if(a==0){
               dbIds = data[keys[elementos[a]]].dbIds;              
               referencia.push(dbIds);
               referencia2.push(dbIds);
               identificadores = dbIds;
             }
             else{
               referencia.push((data[keys[elementos[a]]].dbIds));
               referencia2.push((data[keys[elementos[a]]].dbIds));
               identificadores = dbIds.concat(data[keys[elementos[a]]].dbIds);

               dbIds = identificadores;
             }
        }

        resultado_ids = referencia;

      }
      registro_ultimo_filtro = referencia;
      viewer.isolate(identificadores);
      viewer.fitToView(identificadores, viewer.model);
      referencia2 = identificadores;
    
    //gantt.clearAll();
    //  gantt.init("gantt_here",null,"month");
     
     
  //     gantt.attachEvent("onTaskClick", function(id, e) {
   //    viewer.isolate([ parseInt(id)]);
       // viewer.fitToView(parseInt(id), viewer.model);
        //viewer.setThemingColor(id,  red, viewer.model);
       // viewer.setThemingColor(1604, new THREE.Vector4(0, 1, 1,1));
  //   });
      let c =1;
      var hoy = 10 + '-' +05 + '-' +2021;
      var cat_count=1;
      var esta =0;
      var categorias = Array();
      var categoria_actual;
      var indice_actual = 0;
      var pesoTotal = 0;
      var largoTotal = 0;
      var xTotal = 0;

      var tableTotales = document.getElementById('tabla_total');
      var tableRef = document.getElementById('tabla_fierro');
      var rowCount = tableRef.rows.length;
      var rowCountTotales = tableTotales.rows.length;
      var tableHeaderRowCount = 1;
     
      
      
      for (var i = tableHeaderRowCount; i < rowCount; i++) {
        tableRef.deleteRow(tableHeaderRowCount);
      }
      for(var a=0; a< identificadores.length;a++){
        let actual =  identificadores[a];
        
        viewer.getProperties( identificadores[a], (result) => { 
         
          for(i=0 ;i< 60;i++){
            let nombre_actual = ""+result.properties[i].displayName;
            if(nombre_actual ==="Category"){
              categoria_actual_obj = result.properties[i].displayValue;
              console.log("CATEGORIA BUSCADA");
              console.log(categoria_actual_obj);
              if(categoria_actual_obj==parametro_fierro){
                let peso = parseFloat(result.properties[82].displayValue);
                peso = peso.toFixed(2);
                peso = parseFloat(peso,0);
                let actuales = $("#id_seleccionados3").val();
                actual =   actual+","+actuales;
                $("#id_seleccionados3").val(actual);
                $("#id_seleccionados4").val(actual);
                pesoTotal = pesoTotal+peso;
                
                
               // pesoTotal  = parseFloat(pesoTotal).toFixed(2);
               
                console.log( "SUMATORIA PESO");
                console.log( pesoTotal);
                document.getElementById('peso').innerHTML = '' +pesoTotal.toFixed(2);
                let largo = parseFloat(result.properties[46].displayValue);
                largo = largo.toFixed(2);
                largo = parseFloat(largo,0);
                console.log(largo);
                listado_largos = listado_largos+","+largo;
                listado_pesos = listado_pesos + ","+peso;
                largoTotal = largoTotal+ largo;
                console.log( "SUMATORIA LARGO");
                console.log( largoTotal);
                console.log( "Listado largos");
                console.log(listado_largos);
                //largoTotal  = parseFloat(largoTotal).toFixed(2);
                listado_pesos = listado_pesos +","+peso;
                listado_largos = listado_largos +","+largo;
                $("#listado_largo").val(listado_largos);
                $("#listado_pesos").val(listado_pesos);
            //    document.getElementById('largo').innerHTML = '' +largoTotal;
                let name = result.name;
              
                let resultado_mul = peso*largo;

                $("#largo_total_pedido").val(largoTotal);
                $("#peso_total_pedido").val(pesoTotal.toFixed(2));
                $("#resultado_total_pedido").val(resultado_mul);
           
                $("#listado_largo").val(listado_largos);
                $("#listado_pesos").val(listado_pesos);
                //console.log( "Resultado Multiplicación");
               // console.log( resultado_mul);
             
                resultado_mul =resultado_mul.toFixed(2);
                xTotal = xTotal + parseFloat(resultado_mul);
                console.log( "Total Multiplicación");
                console.log( xTotal);
              //  document.getElementById('acum').innerHTML = '' +xTotal.toFixed(2);

              //  document.getElementById('btn').innerHTML = '<button  class="btn btn-success btn-block" data-target="#modaldemo6" data-toggle="modal" ">Ejecutar Pedido <i class="icon ion-ios-arrow-left tx-11 mg-l-6"></i></button>';
                let g = name.split(' ');
                let y = g[2];
       
        
                
                // Inserta una fila en la tabla, en el índice 0
               
               }
               if(cat_count == 1){ // no hay ningun elemento
                   indice_actual = 0;
                   categorias.push(result.properties[i].displayValue);
                   categoria_actual = result.properties[i].displayValue;
                   cat_count =cat_count +1;
               //    console.log("entre una vez "+ cat_count );
               /*
                   var taskId = gantt.addTask({
                    id:cat_count,
                    text:result.properties[i].displayValue,
                    start_date:hoy,
                    duration:1
                  },11,1);*/
                  
               }else{
                 // busco si se encuentra
              //   console.log("GUARDAFDAS //////////////////////////////");
              //   console.log(categorias);
                  for(var t =0 ; t< cat_count; t++){
                      if( result.properties[i].displayValue === categorias[t]){
                        esta = 1; 
                        indice_actual = t;
                        break
                      }
                  }
                  if(esta ==0){ // no se encontró  se procede a agregar la nueva categoria
                    categorias.push(result.properties[i].displayValue);
                    cat_count =cat_count +1;
                    indice_actual = cat_count -1;
                    // console.log("agregue nuevo "+ cat_count);
                  
                  /*
                    var taskId = gantt.addTask({
                                          id:cat_count,
                                          text:result.properties[i].displayValue,
                                          start_date:hoy,
                                          duration:1
                      },11,1);*/
               //   gantt.sort("start_date",false);
             //     gantt.render();
                  
                  }
                  else{
                    esta = 0;
                  }
                }
            }
            if(nombre_actual  === parametro_fecha){
      
              fecha_hormigonado = result.properties[i].displayValue;

              let formato_hormigonado_1 = fecha_hormigonado.indexOf("/");
              let formato_hormigonado_2 = fecha_hormigonado.indexOf("-");
      
              if(formato_hormigonado_1 != -1){
                    let elementos_fecha = fecha_hormigonado.split("/");
                  if(elementos_fecha.length>0){
                    var today = new Date();
                    var dd = String(today.getDate()).padStart(2, '0');
                    var mm = String(today.getMonth() + 1).padStart(2, '0'); //
                    var yyyy = today.getFullYear();
                    if(mm>0){
                      mm = mm-1; 
                    }
                    today = '0'+mm + '/' + dd + '/' + yyyy;
                    if(elementos_fecha[1] >0){
                      elementos_fecha[1] = elementos_fecha[1]-1;
                    }
      
                    var d3=  '0'+elementos_fecha[1]+"-"+elementos_fecha[0]+"-"+elementos_fecha[2]; // FECHA PLAN
                    // let compara = dates.compare(today,d2);
                
                    let resultado  = [result.name,d3];
              
                    console.log("NombreInterno" + resultado[0]);
                    return resultado;
                  }
              }
              if(formato_hormigonado_2 != -1){
                let elementos_fecha = fecha_hormigonado.split("-");
                if(elementos_fecha.length>0){
                  var today = new Date();
                  var dd = String(today.getDate()).padStart(2, '0');
                  var mm = String(today.getMonth() + 1).padStart(2, '0'); //
                  var yyyy = today.getFullYear();
                  if(mm>0){
                     mm = mm-1; 
                  }
                  today = '0'+mm + '/' + dd + '/' + yyyy;
                  if(elementos_fecha[1] >0){
                    elementos_fecha[1] = elementos_fecha[1]-1;
                  }
        
                  var d3=  '0'+elementos_fecha[1]+"-"+elementos_fecha[0]+"-"+elementos_fecha[2]; // FECHA PLAN
                  // let compara = dates.compare(today,d2);
               
                  let resultado  = [result.name,d3];
             
                  console.log("NombreInterno" + resultado[0]);
                   return resultado;
                }
              }
              
             }
          }
          
        }) 
    
      }
      /* 
      gantt.config.columns = [
        {name: "text", tree: true, width: 180, resize: true},
        {name: "start_date", align: "center", resize: true},
        {name: "duration", align: "center"},
        {name: "buttons", label: "Actions", width: 120, template: function(task){
          var buttons = 
          '<input type=button value="Filtrar" onclick=seleccion_modelo('+task.id+')>';
          return buttons; 
        }}
      ];*/
    });
  }
}

function marcar_visual(){
  console.log("cantidad ids filtrados "+referencia2.length);
  console.log(referencia2);
  const color12 = new THREE.Vector4(0.882, 0.878,0.854, 0.6);
 
  for(var v =0; v<referencia2.length;v++){
    console.log("id pintar "+referencia2[v]);
    
    let t = parseInt(referencia2[v]+'',0);
    viewer.setThemingColor(t,red, null,true);
  }
 
  
}
function filtro_gantt( arreglo_filros){

  let mensaje_1;
  let mensaje_2;
  var elem = [0];
  var referencia = Array();
  var elem  = Array();
  
  //// // // // // // // // // alert("Valor Parámetro 1: "+valor_fil1 + "   Val. Parámetro 2: "+valor_fil2 );
 /******************************************************************************
  * 
  * 
  * CASO 1 - FILTRO PISO 
  * 
  */
  
   let filt = [parametro_nivel];

   var resultado_ids;

  



      consulta_filtro2([parametro_nivel]).then((data) => {
      let keys = Object.keys(data);
    
      let elementos = buscaKeys(arreglo_filros,keys)
      var identificadores =0;
      let dbIds =0;
     
      if(elementos.length == 0){
     //   // // // // // // // // // alert("No hay resultados");
      }else{
        for(var a = 0; a<elementos.length;a++){
             if(a==0){
               dbIds = data[keys[elementos[a]]].dbIds;              
               referencia.push(dbIds);
               identificadores = dbIds;
             }
             else{
               referencia.push((data[keys[elementos[a]]].dbIds));
               identificadores = dbIds.concat(data[keys[elementos[a]]].dbIds);

               dbIds = identificadores;
             }
        }

        resultado_ids = referencia;

      }
      
  
      let c =1;
     
      var cat_count=1;
      var esta =0;
      var categorias = Array();
      var categoria_actual;
      var indice_actual = 0;

      for(var a=0; a< resultado_ids[0].length;a++){
        let actual =  resultado_ids[0][a];
        
        viewer.getProperties( resultado_ids[0][a], (result) => { 
         
          for(i=0 ;i< 60;i++){
            let nombre_actual = ""+result.properties[i].displayName;
            if(nombre_actual ==="Category"){  // reconoce categoria a la que pertenece el elemento
               if(cat_count == 1){ // no hay ningun elemento
                   indice_actual = 0;
                   categorias.push(result.properties[i].displayValue);
                   categoria_actual = result.properties[i].displayValue;
                   cat_count =cat_count +1;
               //    console.log("entre una vez "+ cat_count );
               
                   var taskId = gantt.addTask({
                    id:cat_count,
                    text:result.properties[i].displayValue,
                    start_date:hoy,
                    duration:1
                  },11,1);
                  
               }else{
                 // busco si se encuentra
              //   console.log("GUARDAFDAS //////////////////////////////");
              //   console.log(categorias);
                  for(var t =0 ; t< cat_count; t++){
                      if( result.properties[i].displayValue === categorias[t]){
                        esta = 1; 
                        indice_actual = t;
                        break
                      }
                  }
                  if(esta ==0){ // no se encontró  se procede a agregar la nueva categoria
                    categorias.push(result.properties[i].displayValue);
                    cat_count =cat_count +1;
                    indice_actual = cat_count -1;
                    // console.log("agregue nuevo "+ cat_count);
                  
                  
                    var taskId = gantt.addTask({
                                          id:cat_count,
                                          text:result.properties[i].displayValue,
                                          start_date:hoy,
                                          duration:1
                      },11,1);
                  gantt.sort("start_date",false);
                  gantt.render();
                  
                  }
                  else{
                    esta = 0;
                  }
                }
            }
            if(nombre_actual  === parametro_fecha){
      
              fecha_hormigonado = result.properties[i].displayValue;

              if(fecha_hormigonado.length >0 && fecha_hormigonado != "undefined"){
                let elementos_fecha = fecha_hormigonado.split("/");
                if(elementos_fecha.length>0 && fecha_hormigonado != "xx" && fecha_hormigonado != ""){
                  var today = new Date();
                  var dd = String(today.getDate()).padStart(2, '0');
                  var mm = String(today.getMonth() + 1).padStart(2, '0'); //
                  var yyyy = today.getFullYear();
                  if(mm>0){
                     mm = mm-1; 
                  }
                  today = '0'+mm + '/' + dd + '/' + yyyy;
                  if(elementos_fecha[1] >0){
                    elementos_fecha[1] = elementos_fecha[1]-1;
                  }
        
                  var d3=  '0'+elementos_fecha[1]+"-"+elementos_fecha[0]+"-"+elementos_fecha[2]; // FECHA PLAN
                  var d4 = elementos_fecha[0]+"-"+elementos_fecha[1]+"-"+elementos_fecha[2]; // FECHA PLAN
               
               
                  let resultado  = [result.name,d3];
                  c++;
               
                 gantt.addTask({
                            id:actual,
                            text:result.name,
                            start_date:d4,
                            duration:1
                        },11,1); 
                // console.log("actual  "+parseIntcategorias[indice_actual]+" && "+indice_actual);
                 gantt.sort("start_date",false);
                 gantt.render();
                 break 
               
            
                 

                }
              
                //cabecera = cabecera +body+" ]  });";
  
              }
      
             }
          }
          
        }) 
    
      }
       
      gantt.config.columns = [
        {name: "text", tree: true, width: 180, resize: true},
        {name: "start_date", align: "center", resize: true},
        {name: "duration", align: "center"},
        {name: "buttons", label: "Actions", width: 120, template: function(task){
          var buttons = 
          '<input type=button value="Filtrar" onclick=seleccion_modelo('+task.id+')>';
          return buttons; 
        }}
      ];
    });

    
  
 
}
////////*************FUNCION PINTAR ELEMENTOS*********************//////////

function Pintar_Categorias( ){

  let mensaje_1;
  let mensaje_2;
  var elem = [0];
  var referencia = Array();
  var elem  = Array();
  
  //// // // // // // // // // alert("Valor Parámetro 1: "+valor_fil1 + "   Val. Parámetro 2: "+valor_fil2 );
 /******************************************************************************
  * 
  * 
  * CASO 1 - FILTRO PISO 
  * 
  */
  
      let filt = [parametro_nivel];

      var resultado_ids;
      consulta_filtro2([parametro_nivel]).then((data) => {
        
      console.log('PARAMETRO NIVEL');   
      console.log(data);
      console.log(filtros_pintura);
     
      let keys = Object.keys(data);
     
      console.log('KEYS');
      console.log(keys);

      let elementos = buscaKeys(filtros_pintura,keys)
     
      console.log('elementos!');
      console.log(elementos);

      var identificadores =0;
      let dbIds =0;
     
      if(keys.length == 0 && keys){
        //    // // // // // // // // // alert("No hay resultados");

      }else{
        for(var a = 0; a<keys.length;a++){
             if(a==0){
               dbIds = data[keys[a]].dbIds;              
               referencia.push(dbIds);
               identificadores = dbIds;
             }
             else{
               referencia.push((data[keys[a]].dbIds));
               identificadores = dbIds.concat(data[keys[a]].dbIds);

               dbIds = identificadores;
             }
        }

        resultado_ids = referencia;
        console.log('LISTADO IDS');
        console.log(resultado_ids);
      }
     for(var t =0;t <resultado_ids.length;t++){
      for(var a=0; a< resultado_ids[t].length;a++){
        // console.log("cantidad PINTURA   "+resultado_ids[0].length);
         let categoria_actual_obj ="";
     //    console.log("RESULTADO IDS");
      //   console.log(resultado_ids[0][a]);
         let id_actual_tarea_1 = resultado_ids[t][a];
     viewer.getProperties( resultado_ids[t][a], (result) => { 
           console.log("PROPIEDADES OBJETO");
           console.log(result);
           let nombre_actua_objeto  =  result.name;
        // console.log("actual name  "+nombre_actua_objeto);
        // BUSCA LAS PROPIEDADES DEL OBJETO SELECCIONADO / APROXIMA LA CANTIDAD DE PROPIEDADES DISPONIBLES A 60 
        for(i=0 ;i< 60;i++){
 
           let nombre_actual = ""+result.properties[i].displayName;
           console.log("BUSCO CATEGORIA !");
           console.log(nombre_actual);
           if(nombre_actual ==="Category"){  // reconoce categoria a la que pertenece el elemento
             categoria_actual_obj = result.properties[i].displayValue;
             console.log("ENCUENTRO CATEGORIA !");
 
             console.log(categoria_actual_obj);
             break;
             // capturo categoria
           }
        }
    
 
        if(categoria_actual_obj == "Revit Walls"){
        // console.log("pintio revit wall")
         const color10 = new THREE.Vector4(0.3647, 0.9059,0.1059, 0.1);
         viewer.setThemingColor(parseInt(result.dbId+'',0),color10, null,true);
        }
        if(categoria_actual_obj == "Revit Floors"){
 
         const color1 = new THREE.Vector4(0.1059, 0.9059, 0.7686,0.1);
         viewer.setThemingColor(result.dbId, color1, null,true);                 
        }
        if(categoria_actual_obj == "Revit Structural Foundations"){
                    
         const color2 = new THREE.Vector4(0.1059,0.3804, 0.9059,0.1);
         viewer.setThemingColor(result.dbId, color2, null,true);
        }
        if(categoria_actual_obj == "Revit Wall Foundations"){
                    
         const color3 = new THREE.Vector4(0.1059,0.3804, 0.9059,0.1);
         viewer.setThemingColor(result.dbId, color3, null,true);
        }
         
        if(categoria_actual_obj == parametro_fierro){
                    
         const color4 = new THREE.Vector4(0, 0, 1, 1);
         viewer.setThemingColor(result.dbId, color4, null,true);
        }
        if(categoria_actual_obj == "Revit Structural Framing"){
                    
         const color5 = new THREE.Vector4(1, 1, 0,0.2);
         viewer.setThemingColor(result.dbId, color5, null,true);
        }
        
       
        if(categoria_actual_obj== "Revit Structural Columns"){
         const color6 = new THREE.Vector4(1, 1, 0,0.2);
         viewer.setThemingColor(result.dbId, color6, null);             
 
        } 
                    
     }) 
         
        }
     }
    // viewer.start();
    });
}

function Pintar_Categorias_reflow( ){

  let mensaje_1;
  let mensaje_2;
  var elem = [0];
  var referencia = Array();
  var elem  = Array();
  
  //// // // // // // // // // alert("Valor Parámetro 1: "+valor_fil1 + "   Val. Parámetro 2: "+valor_fil2 );
 /******************************************************************************
  * 
  * 
  * CASO 1 - FILTRO PISO 
  * 
  */
  
      let filt = [parametro_nivel];

      var resultado_ids;
      consulta_filtro2([parametro_nivel]).then((data) => {
        
      console.log('buscanco para pintar');   
      console.log(data);
      console.log(filtros_pintura);
     
      let keys = Object.keys(data);
     
      console.log('KEYS');
      console.log(keys);

      let elementos = buscaKeys(filtros_pintura,keys)
     
      console.log('elementos!');
      console.log(elementos);

      var identificadores =0;
      let dbIds =0;
     
      if(keys.length == 0 && keys){
        //    // // // // // // // // // alert("No hay resultados");

      }else{
        for(var a = 0; a<keys.length;a++){
             if(a==0){
               dbIds = data[keys[a]].dbIds;              
               referencia.push(dbIds);
               identificadores = dbIds;
             }
             else{
               referencia.push((data[keys[a]].dbIds));
               identificadores = dbIds.concat(data[keys[a]].dbIds);

               dbIds = identificadores;
             }
        }

        resultado_ids = referencia;
        console.log('LISTADO IDS');
        console.log(resultado_ids);
      }
     for(var t =0;t <resultado_ids.length;t++){
      for(var a=0; a< resultado_ids[t].length;a++){
        // console.log("cantidad PINTURA   "+resultado_ids[0].length);
         let categoria_actual_obj ="";
     //    console.log("RESULTADO IDS");
      //   console.log(resultado_ids[0][a]);
         let id_actual_tarea_1 = resultado_ids[t][a];
        viewer.getProperties( resultado_ids[t][a], (result) => { 
           console.log("PROPIEDADES OBJETO");
           console.log(result);
           let nombre_actua_objeto  =  result.name;
        // console.log("actual name  "+nombre_actua_objeto);
        // BUSCA LAS PROPIEDADES DEL OBJETO SELECCIONADO / APROXIMA LA CANTIDAD DE PROPIEDADES DISPONIBLES A 60 
        for(i=0 ;i< 60;i++){
 
           let nombre_actual = ""+result.properties[i].displayName;
           console.log("BUSCO CATEGORIA !");
           console.log(nombre_actual);
           if(nombre_actual ==="Category"){  // reconoce categoria a la que pertenece el elemento
             categoria_actual_obj = result.properties[i].displayValue;
             console.log("ENCUENTRO CATEGORIA !");
 
             console.log(categoria_actual_obj);
             break;
             // capturo categoria
           }
        }
    
        const color12 = new THREE.Vector4(0.882, 0.878,0.854, 0.6);
        viewer.setThemingColor(parseInt(result.dbId+'',0),color12, null,true);

     
                    
     }) 
         
        }
     }
    // viewer.start();
    });
}

function Pintar_Categorias2( ){

  let mensaje_1;
  let mensaje_2;
  var elem = [0];
  var referencia = Array();
  var elem  = Array();
  
  //// // // // // // // // // alert("Valor Parámetro 1: "+valor_fil1 + "   Val. Parámetro 2: "+valor_fil2 );
 /******************************************************************************
  * 
  * 
  * CASO 1 - FILTRO PISO 
  * 
  */
  
      let filt = [parametro_nivel];

      var resultado_ids;
      consulta_filtro2([parametro_nivel]).then((data) => {
        
      console.log('PARAMETRO NIVEL');   
      console.log(data);
      console.log(filtros_pintura);
     
      let keys = Object.keys(data);
     
      console.log('KEYS');
      console.log(keys);

      let elementos = buscaKeys(filtros_pintura,keys)
     
      console.log('elementos!');
      console.log(elementos);

      var identificadores =0;
      let dbIds =0;
     
      if(keys.length == 0 && keys){
        //    // // // // // // // // // alert("No hay resultados");

      }else{
        for(var a = 0; a<keys.length;a++){
             if(a==0){
               dbIds = data[keys[a]].dbIds;              
               referencia.push(dbIds);
               identificadores = dbIds;
             }
             else{
               referencia.push((data[keys[a]].dbIds));
               identificadores = dbIds.concat(data[keys[a]].dbIds);

               dbIds = identificadores;
             }
        }

        resultado_ids = referencia;
        console.log('LISTADO IDS');
        console.log(resultado_ids);
      }
     for(var t =0;t <resultado_ids.length;t++){
      for(var a=0; a< resultado_ids[t].length;a++){
        // console.log("cantidad PINTURA   "+resultado_ids[0].length);
         let categoria_actual_obj ="";
     //    console.log("RESULTADO IDS");
      //   console.log(resultado_ids[0][a]);
         let id_actual_tarea_1 = resultado_ids[t][a];
     viewer.getProperties( resultado_ids[t][a], (result) => { 
           console.log("PROPIEDADES OBJETO");
           console.log(result);
           let nombre_actua_objeto  =  result.name;
        // console.log("actual name  "+nombre_actua_objeto);
        // BUSCA LAS PROPIEDADES DEL OBJETO SELECCIONADO / APROXIMA LA CANTIDAD DE PROPIEDADES DISPONIBLES A 60 
        for(i=0 ;i< 60;i++){
 
           let nombre_actual = ""+result.properties[i].displayName;
           console.log("BUSCO CATEGORIA !");
           console.log(nombre_actual);
           if(nombre_actual ==="Category"){  // reconoce categoria a la que pertenece el elemento
             categoria_actual_obj = result.properties[i].displayValue;
             console.log("ENCUENTRO CATEGORIA !");
 
             console.log(categoria_actual_obj);
             break;
             // capturo categoria
           }
        }
    
 
        if(categoria_actual_obj == "Revit Walls"){
        // console.log("pintio revit wall")
         const color10 = new THREE.Vector4(1, 0.5137, 0, 0.5);
         viewer.setThemingColor(parseInt(result.dbId+'',0),color10, null,true);
        }
        if(categoria_actual_obj == "Revit Floors"){
 
         const color1 = new THREE.Vector4(1, 0.5137, 0, 0.5);
         viewer.setThemingColor(result.dbId, color1, null,true);                 
        }
        if(categoria_actual_obj == "Revit Structural Foundations"){
                    
         const color2 = new THREE.Vector4(0.1059,0.3804, 0.9059,0.5);
         viewer.setThemingColor(result.dbId, color2, null,true);
        }
        if(categoria_actual_obj == "Revit Wall Foundations"){
                    
         const color3 = new THREE.Vector4(0, 0, 1, 5);
         viewer.setThemingColor(result.dbId, color3, null,true);
        }
         
        if(categoria_actual_obj ==parametro_fierro){
                    
         const color4 = new THREE.Vector4(0.1059,0.3804, 0.9059,0.1);
         viewer.setThemingColor(result.dbId, color4, null,true);
        }
        if(categoria_actual_obj == "Revit Structural Framing"){
                    
         const color5 = new THREE.Vector4(0.1, 1, 0,0.5);
         viewer.setThemingColor(result.dbId, color5, null,true);
        }
        
       
        if(categoria_actual_obj== "Revit Structural Columns"){
         const color6 = new THREE.Vector4(0.1, 1, 0,0.5);
         viewer.setThemingColor(result.dbId, color6, null);             
 
        } 
                    
     }) 
         
        }
     }
    // viewer.start();
    });
}
/////////******************************** */
function filtro_gantt_inicio( arreglo_filros){
  console.log("FILTRO ARREGLOS INICIO");
  console.log(filtros_selec_piso);
  let mensaje_1;
  let mensaje_2;
  var elem = [0];
  var referencia = Array();
  var elem  = Array();
  
  //// // // // // // // // // alert("Valor Parámetro 1: "+valor_fil1 + "   Val. Parámetro 2: "+valor_fil2 );
 /******************************************************************************
  * 
  * 
  * CASO 1 - FILTRO PISO 
  * 
  */
  
      let filt = [parametro_nivel];
      var resultado_ids;
      consulta_filtro2([parametro_nivel]).then((data) => {
      let keys = Object.keys(data);
      console.log("FILTROS ARRAY");
    console.log(arreglo_filros);
      let elementos = buscaKeys(arreglo_filros,keys)
      var identificadores =0;
      let dbIds =0;
     
    //  if(elementos.length == 0 && elementos){
        if(keys.length == 0 && keys){
    //    // // // // // // // // // alert("No hay resultados");
      }else{
        for(var a = 0; a<keys.length;a++){
             if(a==0){
               dbIds = data[keys[a]].dbIds;              
               referencia.push(dbIds);
               identificadores = dbIds;
             }
             else{
               referencia.push((data[keys[a]].dbIds));
               identificadores = dbIds.concat(data[keys[[a]]].dbIds);

               dbIds = identificadores;
             }
        }

        resultado_ids = referencia;

      }
      
  
      let c =1;
     
      var cat_count=1;
      var esta =0;
      var categorias = Array();
      var categoria_actual;
      var indice_actual = 0;
      var id_tareas_objetos = 10000;
      var activo_hormigonado = 0;
      var fecha_objeto ="";
      var valor_aec_piso = "";
      var nivel_actual = "";
      var nombre_actua_objeto ="" ;

      var pesoTotal = 0;
      var largoTotal = 0;
      var xTotal = 0;
     
      var tableTotales = document.getElementById('tabla_total');
      var tableRef = document.getElementById('tabla_fierro');

      //document.getElementById('peso').innerHTML = '';
      //document.getElementById('largo').innerHTML = '' ;
      //document.getElementById('acum').innerHTML = '' ;
      var rowCount = tableRef.rows.length;
      var rowCountTotales = tableTotales.rows.length;
      var tableHeaderRowCount = 1;
      for (var i = tableHeaderRowCount; i < rowCount; i++) {
        tableRef.deleteRow(tableHeaderRowCount);
      }
      for(t=0; t<resultado_ids.length;t++){
        for(var a=0; a< resultado_ids[t].length;a++){
          let actual =  resultado_ids[0][a];
            console.log("cantidad   "+resultado_ids[0].length);
            let categoria_actual_obj ="";
            console.log("RESULTADO IDS");
            console.log(resultado_ids[0][a]);
            let id_actual_tarea_1 = resultado_ids[t][a];
            viewer.getProperties( resultado_ids[t][a], (result) => { 
            //  console.log("PROPIEDADES OBJETO");
           //   console.log(result);
              let nombre_actua_objeto  =  result.name;
           // console.log("actual name  "+nombre_actua_objeto);
           // BUSCA LAS PROPIEDADES DEL OBJETO SELECCIONADO / APROXIMA LA CANTIDAD DE PROPIEDADES DISPONIBLES A 60 
           for(i=0 ;i< 50;i++){
            let nombre_actual = "";
         //   console.log("PROPIEDAD ACTUAL  "+result.properties[i].displayName);
       //  console.log('control error');
        //   console.log(result); 
        if(result.properties[i]){
          if(result.properties[i].displayName != undefined || result.properties[i].length != 0|| result.properties.length != 0  ){
            nombre_actual = ""+result.properties[i].displayName;
         }
        }
          
              
              if(nombre_actual ==="Category"){  // reconoce categoria a la que pertenece el elemento
                categoria_actual_obj = result.properties[i].displayValue;
                let nombre_actual = ""+result.properties[i].displayName;
            if(nombre_actual ==="Category"){
              categoria_actual_obj = result.properties[i].displayValue;
            
              console.log("valor categoria actual3: "+categoria_actual_obj);
              if(categoria_actual_obj==parametro_fierro){
                let peso = parseFloat(result.properties[82].displayValue);
                peso = peso.toFixed(2);
                peso = parseFloat(peso);
                console.log("PESO BUSCADO11");
                console.log(peso);
                let actuales = $("#id_seleccionados3").val();
                actual =   actual+","+actuales;
                $("#id_seleccionados3").val(actual);
                $("#id_seleccionados4").val(actual);
                pesoTotal = pesoTotal+peso;
            //    pesoTotal  = parseFloat(pesoTotal).toFixed(2);
                console.log( "SUMATORIA PESO");
                console.log( pesoTotal);
                document.getElementById('peso').innerHTML = '' +pesoTotal.toFixed(2);
                let largo = parseFloat(result.properties[46].displayValue);
                largo = largo.toFixed(2);
                largo = parseFloat(largo,0);
                console.log( "Largo");
                console.log( largo);
                console.log( typeof largo);
                largoTotal = largoTotal+ largo;
                console.log( "SUMATORIA LARGO");
                console.log( largoTotal);
              
             //   document.getElementById('largo').innerHTML = '';
             //   document.getElementById('largo').innerHTML = '' +largoTotal;
                let name = result.name;
                peso = parseFloat(peso,0);
                largo = parseFloat(largo,0);
                let resultado_mul = peso*largo;
                //console.log( "Resultado Multiplicación");
               // console.log( resultado_mul);
             
                resultado_mul =resultado_mul.toFixed(2);
                xTotal = xTotal + parseFloat(resultado_mul);
               console.log( "Total Multiplicación");
               console.log( xTotal);
          //      document.getElementById('acum').innerHTML = '' +xTotal.toFixed(2);

          //      document.getElementById('btn').innerHTML = '';
                let g = name.split(' ');
                let y = g[2];
       
        
                
                // Inserta una fila en la tabla, en el índice 0
              //  var newRow   = tableRef.insertRow(1);
              
                // Inserta una celda en la fila, en el índice 0
              //   var newCell  = newRow.insertCell(0);
             //    var newCell2  = newRow.insertCell(1);
             //    var newCell3  = newRow.insertCell(2);
            //     var newCell4  = newRow.insertCell(3);
              
                // Añade un nodo de texto a la celda
                var newText  = document.createTextNode(y);
                newCell.appendChild(newText);
       
                var newText2  = document.createTextNode(largo);
                newCell2.appendChild(newText2);
       
                var newText3  = document.createTextNode(peso);
                newCell3.appendChild(newText3);
       
                var newText4  = document.createTextNode(resultado_mul);
                newCell4.appendChild(newText4);
               }
               if(cat_count == 1){ // no hay ningun elemento
                   indice_actual = 0;
                   categorias.push(result.properties[i].displayValue);
                   categoria_actual = result.properties[i].displayValue;
                   cat_count =cat_count +1;
               //    console.log("entre una vez "+ cat_count );
             
             /*
                   var taskId = gantt.addTask({
                    id:cat_count,
                    text:result.properties[i].displayValue,
                    start_date:hoy,
                    duration:1
                  });
             */   
               }else{
                 // busco si se encuentra
              //   console.log("GUARDAFDAS //////////////////////////////");
              //   console.log(categorias);
                  for(var t =0 ; t< cat_count; t++){
                      if( result.properties[i].displayValue === categorias[t]){
                        esta = 1; 
                        indice_actual = t;
                        break
                      }
                  }
                  if(esta ==0){ // no se encontró  se procede a agregar la nueva categoria
                    categorias.push(result.properties[i].displayValue);
                    cat_count =cat_count +1;
                    indice_actual = cat_count -1;
                    // console.log("agregue nuevo "+ cat_count);
                  
               /*                    var taskId = gantt.addTask({
                                          id:cat_count,
                                          text:result.properties[i].displayValue,
                                          start_date:hoy,
                                          duration:1
                      },11);*/
            //      gantt.sort("start_date",false);
            //      gantt.render();
                
                  }
                  else{
                    esta = 0;
                  }
                }
            }
             
              }
              if(nombre_actual ===filtro_2){
                 valor_aec_piso  = result.properties[i].displayValue;
                 nivel_actual =  valor_aec_piso;
               //  console.log("VALOR PARA AEC PISO: "+  valor_aec_piso);
              }
              if(nombre_actual ===parametro_fecha){
             
        // console.log("VALOR PARA HORMIGONADO: "+  result.properties[i].displayValue);
           //  console.log("VALOR PARA  ID: "+ );
              let e_fecha = result.properties[i].displayValue.split("/");
         //     console.log("VALOR PARA HORMIGONADO: "+  result.properties[i].displayValue);
                if( e_fecha.length >1 && result.properties[i].displayValue != "" && result.properties[i].displayValue != "XX" && result.properties[i].displayValue != "xxxxx" ){
                    activo_hormigonado = 1;
                    let elementos_fecha = result.properties[i].displayValue.split("/");
                    fecha_objeto = elementos_fecha[0]+"-"+elementos_fecha[1]+"-"+elementos_fecha[2]; // FECHA PLAN
                //    console.log("PINTO");
                //    const colorConFormato = new THREE.Vector4(0.0235, 0.1961,0.9765, 0.5);
                 //   viewer.setThemingColor(parseInt(result.dbId+'',0),colorConFormato, null,true);
                    
                  
                   // console.log("FECHA OBJETO: "+  fecha_objeto);
                }
                else{
                //  const color10 = new THREE.Vector4(0.9765,0.0549,0.0235, 0.5);
                //  viewer.setThemingColor(parseInt(result.dbId+'',0),color10, null,true);
              //    console.log("NO ENTRE A HORMIGONADO: "+  fecha_objeto);
             //   console.log("ENTRO A SIN FORMATO");
             //   console.log("CATEGORIA "+ categoria_actual_obj);
            //    console.log(id_actual_tarea_1);
           //     console.log("PISO  "+valor_aec_piso);
                  let actual_posible = this.existeId(id_actual_tarea_1);
           //         console.log("encontrado");
            //        console.log(actual_posible);
                  if(actual_posible != false){
                     activo_hormigonado =1;
                  //   console.log(typeof actual_posible);
                     fecha_objeto = actual_posible[1];
                     console.log(actual_posible);
                    console.log("formato fecha obj : "+fecha_objeto);
               //        console.log('Valor AEC PISO');
               //        console.log(valor_aec_piso);
                  }else{
                    activo_hormigonado = 0;
                    fecha_objeto = "";
                  }
                  
                }
             }
         
             
              }
              if(activo_hormigonado == 1){
             
              }
            }) 
            id_tareas_objetos++;
          }
      }
      
       


     gantt.config.columns = [
      {name: "text", tree: true, width: 180, resize: true},
      {name: "start_date", align: "center", resize: true},
      {name: "duration", align: "center"},
      {name: "buttons", label: "Actions", width: 120, template: function(task){
        var buttons = 
        '<input type=button value="Filtrar" onclick=seleccion_modelo('+task.id+')>';
        return buttons; 
      }}
    ];
  //  gantt.render();
    
    });

    
  
 
}

function seleccion_modelo(id_tarea){

viewer.isolate(id_tarea);
viewer.fitToView(id_tarea, viewer.model);
//// // // // // // // // // alert(id_tarea);
}

function buscarFiltros(){
  consulta_filtro2([]).then((data) => {
      let keys = Object.keys(data);
      console.log("KEYS FILTROS");
      console.log(keys)
      let elementos = buscaKeys(["00 Base"],keys)
      var identificadores =0;
      let dbIds =0;
      
      if(elementos.length == 0){
    
      }else{
        for(var a = 0; a<elementos.length;a++){
             if(a==0){
               dbIds = data[keys[elementos[a]]].dbIds; 
               identificadores = dbIds;
             }
             else{
               console.log("valor de indice "+elementos[a]);
               identificadores = dbIds.concat(data[keys[elementos[a]]].dbIds);
               dbIds = identificadores;
             }
        }

        console.log("IDNENTIFICADORES FILTRADOS"); 

        console.log(identificadores);

      }


    
    });
}
function genera_gantt(){

    let filt = [parametro_nivel];
    consulta_filtro2([]).then((data) => {
    let keys = Object.keys(data);
        
     
      let elementos = buscaKeys(["00 Base"],keys)
      var identificadores =0;
      let dbIds =0;
      
      if(elementos.length == 0){
    
      }else{
        for(var a = 0; a<elementos.length;a++){
             if(a==0){
               dbIds = data[keys[elementos[a]]].dbIds; 
               identificadores = dbIds;
             }
             else{
               console.log("valor de indice "+elementos[a]);
               identificadores = dbIds.concat(data[keys[elementos[a]]].dbIds);
               dbIds = identificadores;
             }
        }

        console.log("IDNENTIFICADORES FILTRADOS"); 

        /****************************************  
          Listado de todos los Ids por filtro , se debe ir a buscar los datos de fecha por cada objeto. Posterior ordenar

        *********************************************/
        console.log(identificadores);


      
        


       
      }


      for(var i = 0; i < identificadores.lenght;i++){
          
           let id_objeto = identificadores[i]; 
           getFecha(id_objeto);

        }
      viewer.isolate(identificadores);
      viewer.fitToView(identificadores, viewer.model);
    });
  

}
/*
function selecciona2(clave){

  getData().then((data) => {
         let keys = Object.keys(data);
         
         let dbIds = data[clave].dbIds;                        
            viewer.isolate(dbIds);
            viewer.fitToView(dbIds, viewer.model);
  });
  

}*/

function onDocumentLoadSuccess(doc) {
  var geometryItems = doc
        .getRoot()
        .search({ role: "3d", type: "geometry" });
  var viewables = doc.getRoot().getDefaultGeometry();
  viewer.loadDocumentNode(doc, viewables).then(i => {
    
    let sheetViews = doc.getRoot().getSheetNodes().map(x=>x.data.children.filter(x=>x.type==='view')[0]);
    console.log("DISPONIBLES");
        console.log(sheetViews);
        let select = document.getElementById('opciones_view');  
     //    select.options= [];
        sheetViews.forEach(x=>{
          console.log("ACTUAL");
          console.log(x);
          let option = document.createElement('option');
          option.text = x.name;
          option.value = x.guid;
          if( select!=null){ select.add(option);}
         
         });
         let tresD = geometryItems.map(x=>x.data.children.filter(x=>x.type==='view'));
         tresD.forEach(x=>{
            console.log("ACTUAL 3ds");
            console.log(x);
            let option = document.createElement('option');
            option.text = x[0].name;
            option.value = x[0].guid;
            if( select!=null){ select.add(option);}
  
          });
          if( select!=null){ 
            
            select.addEventListener('change',(event)=>{
              viewer.tearDown();
           //   viewer.start();
              let view = doc.getRoot().findByGuid(select.value);
               viewer.loadDocumentNode(doc,view).then(i=>{});
            });
          }
      
    // documented loaded, any action?
    viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, (e) => {
      console.log("SELECCION");
      console.log(e);
      console.log(e.dbIdArray);
      if (e.dbIdArray.length === 0) return;
      viewer.model.getBulkProperties(e.dbIdArray, ['4D_Task_ID'], (props) => {
        props.forEach((ele) => {
          if (ele.properties.lenght === 0) return;
          var taskId = ele.properties[0].displayValue;
          charts["Gantt"]._gantt.chart.get_bar(taskId).show_popup();
        })
      })
    })
  });
}

function onDocumentLoadFailure(viewerErrorCode) {
  console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
}

function getForgeToken(callback) {
  fetch('/api/forge/oauth/token').then(res => {
    res.json().then(data => {
      callback(data.access_token, data.expires_in);
    });
  });
}
var dates = {
  convert:function(d) {
      // Converts the date in d to a date-object. The input can be:
      //   a date object: returned without modification
      //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
      //   a number     : Interpreted as number of milliseconds
      //                  since 1 Jan 1970 (a timestamp) 
      //   a string     : Any format supported by the javascript engine, like
      //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
      //  an object     : Interpreted as an object with year, month and date
      //                  attributes.  **NOTE** month is 0-11.
      return (
          d.constructor === Date ? d :
          d.constructor === Array ? new Date(d[0],d[1],d[2]) :
          d.constructor === Number ? new Date(d) :
          d.constructor === String ? new Date(d) :
          typeof d === "object" ? new Date(d.year,d.month,d.date) :
          NaN
      );
  },
  compare:function(a,b) {
      // Compare two dates (could be of any type supported by the convert
      // function above) and returns:
      //  -1 : if a < b
      //   0 : if a = b
      //   1 : if a > b
      // NaN : if a or b is an illegal date
      // NOTE: The code inside isFinite does an assignment (=).
      return (
          isFinite(a=this.convert(a).valueOf()) &&
          isFinite(b=this.convert(b).valueOf()) ?
          (a>b)-(a<b) :
          NaN
      );
  },
  inRange:function(d,start,end) {
      // Checks if date in d is between dates in start and end.
      // Returns a boolean or NaN:
      //    true  : if d is between start and end (inclusive)
      //    false : if d is before start or after end
      //    NaN   : if one or more of the dates is illegal.
      // NOTE: The code inside isFinite does an assignment (=).
     return (
          isFinite(d=this.convert(d).valueOf()) &&
          isFinite(start=this.convert(start).valueOf()) &&
          isFinite(end=this.convert(end).valueOf()) ?
          start <= d && d <= end :
          NaN
      );
  }
}