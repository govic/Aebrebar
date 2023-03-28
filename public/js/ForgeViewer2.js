var viewer;
//var datos;
var filtro1 = false;
var filtro2 = false;
var filtro3 = false;
var valor_fil1;
var valor_fil2;
var filtros_selec_piso = 0;
var filtros_selec_ha = 0;
var filtros_general =[];
var ids_task = [];
var ids_subtask = [];
var cont_id_task = 1000;
var cont_id_subtask = 10000;
var hoy = 18 + '-' +10 + '-' +2021;
var  idsSeleccionados =[];
var filtros_pintura;
var estado_filtro = 0;
var listado_barras_pedidas=[];
var ids_bd =[];
var ids_db_update =[];
var ids_db_insert =[];
function savePlan(){
  let valores = document.getElementById("id_seleccionados2").value;
  console.log('selecccionados ids');
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
     
    }
    else{
      console.log('UPDATE OBJETO  EXISTENTE');
      console.log(plan+" "+base+" "+ac);
      getDBIds_update(plan,base,ac);
      ids_bd =[];
      getDBIds();
    }
  }
}
function saveHormigonado(){
  let valores = document.getElementById("id_seleccionados2").value;

  console.log('selecccionados ids');
  console.log(valores);
  let arr_vals = valores.split(',');
  let plan = document.getElementById("plan1").value;
  let base = document.getElementById("dateMask1").value;
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
     
    }
    else{
      console.log('UPDATE OBJETO  EXISTENTE');
      console.log(plan+" "+base+" "+ac);
      getDBIds_update(plan,base,ac);
      ids_bd =[];
      getDBIds();
    }
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
  console.log('BUSCADO');
  console.log(b);
  console.log(ids_bd.length);
  if(ids_bd.length>0){
    for(var a = 0; a<ids_bd.length;a++){
      console.log('BUSCAnDO');
      console.log(ids_bd[a]);
      console.log(b +' comp '+ ids_bd[a][0]);
      console.log(typeof b +' comp '+ typeof ids_bd[a][0]);
      if(b == ids_bd[a][0]){
        console.log('ENCONTRE ID BUSCADO OBSJET')
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

 // console.log("MUESTRA.....!!!!");
    
      let filtrado = [filtro_1];
      let filtro_boton = "['"+filtro_1+"' ]";

      consulta_filtro(filtrado).then((data) => {
                let keys = Object.keys(data);
                let datos = keys;
             //   console.log("vienen datos");
              //  console.log("Filtro 1 y 2:"+ datos);
             //   console.log("keys iniciales");
             //   console.log(keys);
                var i;
                var botones= "";
                
                for (i = 0; i < datos.length; i++) {
                    var botones =botones+ "<option value=\""+datos[i]+"\" >"+datos[i]+"</option>";
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
              // filtros_pintura=[keys[0]];
              filtros_pintura=[keys[0],keys[1]];
              filtros_general = [keys[0]];
               filtro_gantt_inicio( [keys[0]]);
               

             //   console.log("keys iniciales");
             //   console.log(keys);
                var i;
                var botones= "";
                let filtros_sel = Object.values(keys[0]);
                elementos = buscaKeys(filtros_sel ,keys)
                for (i = 0; i < datos.length; i++) {
                  
                
                 ///// CREA ESTRUCTURA INICIAL////////////////////////////
                  //////////////////////////////////MUROS -////////////////////////////
                         
                   // var botones =botones+ "<a class=\"dropdown-item\" onclick=\"selecciona2("+"\'"+filtro_boton+"\'"+ ","+filtro_boton+" );\">"+datos[i]+"</a>";
                   var botones =botones+ "<option value=\""+datos[i]+"\" >"+datos[i]+"</option>";
                }

               console.log("Idsss");
                console.log(ids_task);
             
               // gantt.render();
                document.getElementById("piso_option").innerHTML = botones;
                //  document.getElementById("selectores2").innerHTML = botones;

                // PEGA LOS BOTONES PARA FILTRAR SEGUN PARÁMETROS
           });

           // ELIGE LOS NIVELES PARA EL PARÁMETRO ELEGIDO (PISO ) CREE LA GANTT 
           filtros_selec_piso =    ["00.- Radier EDA","01.- Cielo 1° Piso EDA","03.- Cielo 3° Piso EDA"]; 
}




function getFiltros_2() { // BUSCA NIVELES Y LUEGO PARTIDAD DENTRO DE CADA NIVEL
   
  console.log("MUESTRA.....!!!!");
    
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
                var botones= "";
                
                for (i = 0; i < datos.length; i++) {
                    var botones =botones+ "<option value=\""+datos[i]+"\" >"+datos[i]+"</option>";
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
               console.log("Filtro 2:"+ datos);
               // filtro_gantt( [keys[0]]);
               filtro_gantt_inicio( [keys]);
               console.log("keys iniciales");
               console.log(keys);
                var i;
                var botones= "";
                let filtros_sel = Object.values(keys[0]);
                elementos = buscaKeys(filtros_sel ,keys)
                for (i = 0; i < datos.length; i++) {
                  
                
                 ///// CREA ESTRUCTURA INICIAL////////////////////////////
                  //////////////////////////////////MUROS -////////////////////////////
             
                             
                  
                  ////////////////////////////////VIGAS/////////////////////////
                  
           
               
                   ////////////////////////////////LOSAS/////////////////////////
                                   

                   // var botones =botones+ "<a class=\"dropdown-item\" onclick=\"selecciona2("+"\'"+filtro_boton+"\'"+ ","+filtro_boton+" );\">"+datos[i]+"</a>";
                   var botones =botones+ "<option value=\""+datos[i]+"\" >"+datos[i]+"</option>";
                }

                console.log("Idsss");
                console.log(ids_task);
             
              //  gantt.render();
                document.getElementById("piso_option").innerHTML = botones;
                //  document.getElementById("selectores2").innerHTML = botones;

                // PEGA LOS BOTONES PARA FILTRAR SEGUN PARÁMETROS
           });

           // ELIGE LOS NIVELES PARA EL PARÁMETRO ELEGIDO (PISO ) CREE LA GANTT 
           filtros_selec_piso =    ["00.- Radier EDA","01.- Cielo 1° Piso EDA","03.- Cielo 3° Piso EDA","04.- Cielo 4° Piso EDA",,"05.- Cielo 5° Piso EDA"]; 
}



function getFecha(id_objeto){ 

  // BUSCA LAS FECHAS DE CADA OBJETO EN EL PARAMETRO DESIGNADO, INICIALMENTE CONSIDERAO " AEC SECUENCIA DE HORMIGONADO"

  viewer.getProperties(id_objeto, (result) => { 

    for(i=0 ;i< 60;i++){
      let nombre_actual = ""+result.properties[i].displayName;
      
      if(nombre_actual  === parametro_fecha){

        fecha_hormigonado = result.properties[i].displayValue;
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

  })  

}
function set_visor(){
  d = document.getElementById("vistas_previas").value;
   // alert(d);
}

function set_clave(){
  d = document.getElementById("clave_vistas").value;
  console.log("selección");
  console.log(d);
  let mensaje_1;
  let mensaje_2;
  var elem = [0];
  var referencia = Array();
  var elem  = Array();
  
  //alert("Valor Parámetro 1: "+valor_fil1 + "   Val. Parámetro 2: "+valor_fil2 );
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
          //    alert("No hay resultados");
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
               console.log('control error');
                 console.log(result); 
                  if(result.properties[i].displayName != undefined || result.properties[i].length != 0|| result.properties.length != 0  ){
                      nombre_actual = ""+result.properties[i].displayName;
                   }
                    
                    if(nombre_actual ==="Category"){  // reconoce categoria a la que pertenece el elemento
                      categoria_actual_obj = result.properties[i].displayValue;
                  //   console.log("CATEGORIA ACTUAL: "+categoria_actual_obj);
                     
                      /*
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
                      */    
                    }
                    if(nombre_actual ===filtro_2){
                       valor_aec_piso  = result.properties[i].displayValue;
                       nivel_actual =  valor_aec_piso;
                     //  console.log("VALOR PARA AEC PISO: "+  valor_aec_piso);
                    }
                    if(nombre_actual ===parametro_fecha){
                   
                   console.log("VALOR PARA HORMIGONADO: "+  result.properties[i].displayValue);
                 //  console.log("VALOR PARA  ID: "+ );
                      if( result.properties[i].displayValue != "" && result.properties[i].displayValue != "XX"  ){
                          activo_hormigonado = 1;
                          let elementos_fecha = result.properties[i].displayValue.split("-");
                          fecha_objeto = elementos_fecha[0]+"-"+elementos_fecha[1]+"-"+elementos_fecha[2]; // FECHA PLAN
                          console.log("PINTO");
                          const colorConFormato = new THREE.Vector4(0.0235, 0.1961,0.9765, 0.5);
                          viewer.setThemingColor(parseInt(result.dbId+'',0),colorConFormato, null,true);
                          
                        
                         // console.log("FECHA OBJETO: "+  fecha_objeto);
                      }
                      else{
                        const color10 = new THREE.Vector4(0.9765,0.0549,0.0235, 0.5);
                        viewer.setThemingColor(parseInt(result.dbId+'',0),color10, null,true);
                    //    console.log("NO ENTRE A HORMIGONADO: "+  fecha_objeto);
                        activo_hormigonado = 0;
                        fecha_objeto = "";
                      }
                   }
               
                   
                    }
                    if(activo_hormigonado == 1){
                    //    console.log("VALOR CATEGORIA PRE-INSERCIÓN  "+categoria_actual_obj);
                        switch ( valor_aec_piso){
          
                          case "00 Base": // 
          
                    //      console.log("ENTRE PARA CREAR TASK -00 Base");
                              if(categoria_actual_obj == "Revit Walls"){
                                
                                id_tareas_objetos++;
                                activo_hormigonado = 0;
                                
          
                              }
                              if(categoria_actual_obj == "Revit Floors"){
                               
                              
                                id_tareas_objetos++;
                                activo_hormigonado = 0;
                              }
                              if(categoria_actual_obj == "Revit Structural Foundations"){
                               
                               
                                id_tareas_objetos++;
                                activo_hormigonado = 0;
              
                              }
                              if(categoria_actual_obj== "Revit Structural Columns"){
                              
                             
                                id_tareas_objetos++;
                                activo_hormigonado = 0;
                              } 
                              break;
                          
                          case "00.- Radier EDA":
                      //      console.log("ENTRE PARA CREAR TASK -00.- Radier EDA");
                                if(categoria_actual_obj == "Revit Walls"){
                                 
                               
                                  id_tareas_objetos++;
                                  activo_hormigonado = 0;
                                }
                                if(categoria_actual_obj == "Revit Floors"){
                                 
                                
                                  id_tareas_objetos++;
                                  activo_hormigonado = 0;
                                }
                                if(categoria_actual_obj == "Revit Structural Foundations"){
                                  
                                  id_tareas_objetos++;
                                  activo_hormigonado = 0;
              
                                }
                                if(categoria_actual_obj== "Revit Structural Columns"){
                                 
                                 
                                  id_tareas_objetos++;
                                  activo_hormigonado = 0;
                              } 
                              break;
                          
                          case "01.- Cielo 1° Piso EDA":
                     //       console.log("ENTRE PARA CREAR TASK -01.- Cielo 1° Piso EDA");
                      
                                if(categoria_actual_obj == "Revit Walls"){
                                
                                 
                                  id_tareas_objetos++;
                                  activo_hormigonado = 0;
                                }
                                if(categoria_actual_obj == "Revit Floors"){
                                 
                                 
                                  id_tareas_objetos++;
                                  activo_hormigonado = 0;
                                }
                                if(categoria_actual_obj == "Revit Structural Foundations"){
                                 
                                 
                                  id_tareas_objetos++;
                                  activo_hormigonado = 0;
              
                                }
                                if(categoria_actual_obj== "Revit Structural Columns"){
                                  
                                 
                                  id_tareas_objetos++;
                                  activo_hormigonado = 0;
                              } 
                              break;
                          
                          case "02.- Cielo 2° Piso EDA":
                                if(categoria_actual_obj == "Revit Walls"){
                                
                                 
                                  id_tareas_objetos++;
                                  activo_hormigonado = 0;
                                }
                                if(categoria_actual_obj == "Revit Floors"){
                                 
                                 
                                  id_tareas_objetos++;
                                  activo_hormigonado = 0;
                                }
                                if(categoria_actual_obj == "Revit Structural Foundations"){
                                 
                                 
                                  id_tareas_objetos++;
                                  activo_hormigonado = 0;
              
                                }
                                if(categoria_actual_obj== "Revit Structural Columns"){
                                
                                 
                                  id_tareas_objetos++;
                                  activo_hormigonado = 0;
                              } 
                              break;
                          case "03.- Cielo 3° Piso EDA":
                                if(categoria_actual_obj == "Revit Walls"){
                                 
                                 
                                  id_tareas_objetos++;
                                  activo_hormigonado = 0;
                               
                               
                                }
                                if(categoria_actual_obj == "Revit Floors"){
                                 
                                 
                                  id_tareas_objetos++;
                                  activo_hormigonado = 0;
                                }
                                if(categoria_actual_obj == "Revit Structural Foundations"){
                                 
                                 
                                  id_tareas_objetos++;
                                  activo_hormigonado = 0;
              
                                }
                                if(categoria_actual_obj== "Revit Structural Columns"){
                                  
                                 
                                  id_tareas_objetos++;
                                  activo_hormigonado = 0;
                              } 
                              break;
                          case "04.- Cielo 4° Piso EDA":
                                  if(categoria_actual_obj == "Revit Walls"){
                                   
                                    id_tareas_objetos++;
                                    activo_hormigonado = 0;
                                  }
                                  if(categoria_actual_obj == "Revit Floors"){
                                   
                                   
                                    id_tareas_objetos++;
                                    activo_hormigonado = 0;
                                  }
                                  if(categoria_actual_obj == "Revit Structural Foundations"){
                                    
                                   
                                    id_tareas_objetos++;
                                    activo_hormigonado = 0;
              
                                  }
                                  if(categoria_actual_obj== "Revit Structural Columns"){
                                   
                                   
                                    id_tareas_objetos++;
                                    activo_hormigonado = 0;
                                } 
                              break;
                          case "05.- Cielo 5° Piso EDA":
                                  if(categoria_actual_obj == "Revit Walls"){
                                   
                                   
                                    id_tareas_objetos++;
                                    activo_hormigonado = 0;
                                  }
                                  if(categoria_actual_obj == "Revit Floors"){
                                   
                                    id_tareas_objetos++;
                                    activo_hormigonado = 0;
                                  }
                                  if(categoria_actual_obj == "Revit Structural Foundations"){
                                  
                                   
                                    id_tareas_objetos++;
                                    activo_hormigonado = 0;
              
                                  }
                                  if(categoria_actual_obj== "Revit Structural Columns"){
                                    
                                   
                                    id_tareas_objetos++;
                                    activo_hormigonado = 0;
                                } 
                              break;
                          case "06.- Cielo 6° Piso EDA":
                                  if(categoria_actual_obj == "Revit Walls"){
                                   
                                   
                                    id_tareas_objetos++;
                                    activo_hormigonado = 0;
                                  }
                                  if(categoria_actual_obj == "Revit Floors"){
                                   
                                   
                                    id_tareas_objetos++;
                                    activo_hormigonado = 0;
                                  }
                                  if(categoria_actual_obj == "Revit Structural Foundations"){
                                   
                                   
                                    id_tareas_objetos++;
                                    activo_hormigonado = 0;
              
                                  }
                                  if(categoria_actual_obj== "Revit Structural Columns"){
                                   
                                    id_tareas_objetos++;
                                    activo_hormigonado = 0;
                                } 
                                break;
                        
                        }
          
                       
                    }
                  }) 
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
                   console.log('control error');
                 console.log(result); 
                  if(result.properties[i].displayName != undefined || result.properties[i].length != 0|| result.properties.length != 0  ){
                      nombre_actual = ""+result.properties[i].displayName;
                   }
                    
               
                    if(nombre_actual ===parametro_fecha){
                   
                   console.log("VALOR PARA HORMIGONADO: "+  result.properties[i].displayValue);
                 //  console.log("VALOR PARA  ID: "+ );
                      if( result.properties[i].displayValue != "" && result.properties[i].displayValue != "XX"  ){
                          activo_hormigonado = 1;
                       //   let elementos_fecha = result.properties[i].displayValue.split("-");
                        //  fecha_objeto = elementos_fecha[0]+"-"+elementos_fecha[1]+"-"+elementos_fecha[2]; // FECHA PLAN
                         
                         /////////////calcula fecha///////////////
                         
                         
                         fecha_hormigonado = result.properties[i].displayValue;
                        let elementos_fecha = fecha_hormigonado.split("-");
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
         
                        var d2 = '0'+elementos_fecha[1]+"/"+elementos_fecha[0]+"/"+elementos_fecha[2]; // FECHA PLAN
                        var d3=  '0'+elementos_fecha[1]+"-"+elementos_fecha[0]+"-"+elementos_fecha[2]; // FECHA PLAN
                        let compara = dates.compare(today,d2);
                        if(compara == 1){
                        // boton_fecha ="<button data-toggle='dropdown' class='btn btn-primary btn-block'>Vencido <i class='icon ion-ios-arrow-left tx-11 mg-l-6'></i></button>";

                          console.log("PINTO VENCIDO");

                          const color10 = new THREE.Vector4(0.9765,0.0549,0.0235, 0.5);
                          viewer.setThemingColor(parseInt(result.dbId+'',0),color10, null,true);
                
                    }else{
                      if(compara == -1){
                     //   boton_fecha ="<button data-toggle='dropdown' class='btn btn-success btn-block'>No Vencido <i class='icon ion-ios-arrow-left tx-11 mg-l-6'></i></button>";
                     console.log("PINTO OK"); 
                     const colorConFormato = new THREE.Vector4(0.0235, 0.1961,0.9765, 0.5);
                        viewer.setThemingColor(parseInt(result.dbId+'',0),colorConFormato, null,true);
                 
                      }else{
                        if(compara == 0){
                          console.log("PINTO HOY"); 
                        //  boton_fecha ="<button data-toggle='dropdown' class='btn btn-primary btn-block'>Vence Hoy <i class='icon ion-ios-arrow-left tx-11 mg-l-6'></i></button>";
                          const color10 = new THREE.Vector4(0.9451,0.9765,0.0235, 0.5);
                          viewer.setThemingColor(parseInt(result.dbId+'',0),color10, null,true);
    

                        }
                        else{
                          boton_fecha ="FECHA SIN FORMATO";

                          const color10 = new THREE.Vector4(0.9765,0.0235,0.2549, 0.5);
                          viewer.setThemingColor(parseInt(result.dbId+'',0),color10, null,true);
                         
                        }
                      }
                    }
                     
                      }
                      else{
                        const color10 = new THREE.Vector4(0.9765,0.0549,0.0235, 0.5);
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


      }
   
     
      

    });

    
  
 
}
function loadPrevisualizaciones(){
  jQuery.get({
    url: '/prueba',
    contentType: 'application/json',
    success: function (res) {
      console.log("RESULTADO GET VISTASasssss");
     console.log(res);
     console.log(typeof res);
     console.log(res.length);
     console.log(res[0]);
     $('#vistas_previas').innerHTML = "";
     for(let i =0 ; i<res.length;i++){
      
      $('#vistas_previas').append($('<option>', {value:res[i].ids, text:res[i].nombre}));
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
function launchViewer(urn) {
  var options = {
    env: 'AutodeskProduction',
    getAccessToken: getForgeToken
  };
  
  Autodesk.Viewing.Initializer(options, () => {
    viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById('forgeViewer'), { extensions: ['Autodesk.DocumentBrowser', 'HandleSelectionExtension'] });
    viewer.start();
    var documentId = 'urn:' + urn;
    
    Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
   
    viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, (event) => { 
    
      loadPrevisualizaciones();
      getDBIds();
      console.log('DB IDS DESDE SERVER');
      console.log(ids_bd);
   //   this.getDBIds_update('1515','1515','125');
   //  this.getDBIds_insert('1515','1515','225');
      console.log("ENTRO A CARGA - SE TERMINO DE LOAD");
      /**
      if(idsSeleccionados !="" && idsSeleccionados.lenght>0 ){
        console.log("IDS SELECCIONADOS");
        console.log(idsSeleccionados);
        viewer.isolate(idsSeleccionados);
        viewer.fitToView(idsSeleccionados, viewer.model);
      }
       */
      if(estado_filtro != 0){
        filtro_visual();
      }
     
          // document.getElementById("selectores").innerHTML = "<a class=\"dropdown-item\" >Seleccione Filtro</a>";
           getFiltros();
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
        //    // document.getElementById("propiedades_id").innerHTML = "";
        
        // console.log("ID PROPIEDAD");
      //  console.log(dbId.dbId);
        // console.log(dbId);
            let busqueda = existeId(dbId[0]); 
            console.log('RESULTADO BUSQUEDA ID - FN');
            console.log(busqueda);
            if(busqueda == false){
              viewer.getProperties(dbId[0], (result) => { 
                console.log('RESULTADO SELECCION'); 
                // document.getElementById("propiedades_id").innerHTML = "";
                  console.log(result); 
                  //<a class='btn ripple btn-info' data-target='#modaldemo3' data-toggle='modal' href=''>Editar Datos</a>
                  document.getElementById("edicion_data").innerHTML = "<a class='btn ripple btn-info' data-target='#modaldemo3' data-toggle='modal' href=''>Editar Fecha Instalación</a>";
                  document.getElementById("edicion_data").innerHTML += "<br><a class='btn ripple btn-info' data-target='#modaldemo5' data-toggle='modal' href=''>Editar Fecha Plan</a>";
                  
                  let fecha_hormigonado = "";
                  if(result.name){
                    var categoria_actual = result.name.split("[");
                 //   // document.getElementById("propiedades_id").innerHTML += "<li><b> Nombre</b> :"+result.name+"</li>";
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
                            // // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 1:
                            // // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 4:
                            // // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 11:
                            // // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                          case 12:
                            // // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 13:
                            // // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>"; 
                          break;
                          case 16:
                            // // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 17:
                            // // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 18:
                            // // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 21:
                          // // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 24:
                          // // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 28:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 29:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 30:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 31:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                        case 32:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                        case 39:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 43:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;                  
                      }
                      
                      }
                  }
        
                  if(categoria_actual[0] === "RS VHA. "){
                    console.log("si es RS VHA");
                    for(i=0 ;i< 60;i++){
                    
                    switch(i){
                        case 0:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 1:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 4:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 11:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                        case 12:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 13:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>"; 
                        break;
                        case 16:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 17:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 18:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 21:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 24:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 28:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 29:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 30:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                      case 31:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                      break;
                      case 32:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                      break;
                      case 39:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                      case 43:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;                  
                    }
                    
                    }
                  }
                  if(categoria_actual[0] === "Basic Wall "){
              //    console.log("si es Basic Wall ");
                  for(i=0 ;i< 60;i++){
                  
                  switch(i){
                      case 0:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                      case 1:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                      case 5:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                      case 10:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                      break;
                      case 19:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                      case 20:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>"; 
                      break;
                      case 21:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                      case 22:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                      case 23:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                    case 24:
                      // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                    case 25:
                      // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                    case 27:
                      // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                    case 31:
                      // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                    case 32:
                      // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                      break;
                    case 33:
                      // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                    break;
                    case 34:
                      // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                    break;
                    case 42:
                      // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                      break;
                    case 46:
                      // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                      break;                  
                  }
                  
                  }
                  }
                  if(categoria_actual[0] === "Wall Foundation "){
                    console.log("si es Wall Foundation ");
                    for(i=0 ;i< 60;i++){
                    
                    switch(i){
                        case 0:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 1:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 5:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 6:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                        case 7:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 8:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>"; 
                        break;
                        case 9:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 10:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 11:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 12:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 13:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 14:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 20:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 21:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                      case 22:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                      break;
                      case 23:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>123"+result.properties[i].displayValue+"</li>";
                      break;
                      case 30:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>123"+result.properties[i].displayValue+"</li>";
                      break;
                                    
                    }
                    
                    }
                  }
                  if(categoria_actual[0] === "RS Fundacion Aislada Tipo "){
                    console.log("si es RS Fundacion Aislada Tipo ");
                    for(i=0 ;i< 60;i++){
                    
                    switch(i){
                        case 0:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 1:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 3:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 8:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                        case 10:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 11:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>"; 
                        break;
                        case 12:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 13:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 16:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 22:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 23:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 24:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 25:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 35:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                      case 36:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                      break;
                      case 37:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                      break; 
                                    
                    }
                    
                    }
                  }  
                  if(categoria_actual[0] === "Foundation Slab "){
                    console.log("si es Foundation Slab ");
                    for(i=0 ;i< 60;i++){
                    
                    switch(i){
                        case 0:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 1:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 4:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 10:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                        case 11:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 12:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>"; 
                        break;
                        case 14:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 15:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 16:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 19:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 20:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 21:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 24:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 28:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                      case 29:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                      break;
                      case 30:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                      break;
                      case 31:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                      case 37:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;   
                        case 40:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;                
                    }
                    
                    }
                  }
                  if(categoria_actual[0] === "Rebar Bar "){
                    console.log("si es Rebar Bar ");
                    for(i=0 ;i< 60;i++){
                    
                    switch(i){
                        case 0:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 1:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 3:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 4:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                        case 6:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 20:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>"; 
                        break;
                        case 22:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 23:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 24:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 25:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 26:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 36:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 45:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 46:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                      case 47:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                      break;
                      case 48:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                      break;
                      case 60:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                      case 61:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;   
                        case 63:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 64:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break; 
                      case 65:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                      break;
                      case 66:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 67:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
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
                        let elementos_fecha = fecha_hormigonado.split("-");
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
                      // alert(elementos_fecha[1]+"/"+elementos_fecha[0]+"/"+elementos_fecha[2]);
                        //alert(today);
                        var d2 = '0'+elementos_fecha[1]+"/"+elementos_fecha[0]+"/"+elementos_fecha[2]; // FECHA PLAN
                        var d3=  '0'+elementos_fecha[1]+"-"+elementos_fecha[0]+"-"+elementos_fecha[2]; // FECHA PLAN
                        let compara = dates.compare(today,d2);
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
                              boton_fecha ="FECHA SIN FORMATO";
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
                        
                      }
                    }
                  
                   
                }
        
                  
                  // document.getElementById("propiedades_id").innerHTML += " AEC Secuencia Hormigonado <li><b>"+" :</b>"+fecha_hormigonado+" Estado: "+boton_fecha+"</li>";
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
                  // document.getElementById("propiedades_id").innerHTML = "";
                    console.log(result); 
                    //<a class='btn ripple btn-info' data-target='#modaldemo3' data-toggle='modal' href=''>Editar Datos</a>
                    document.getElementById("edicion_data").innerHTML = "<a class='btn ripple btn-info' data-target='#modaldemo3' data-toggle='modal' href=''>Editar Fecha Instalación</a>";
                    document.getElementById("edicion_data").innerHTML += "<br><a class='btn ripple btn-info' data-target='#modaldemo5' data-toggle='modal' href=''>Editar Fecha Plan</a>";
                    
                    let fecha_hormigonado = "";
                    if(result.name){
                      var categoria_actual = result.name.split("[");
                      // document.getElementById("propiedades_id").innerHTML += "<li><b> Nombre</b> :"+result.name+"</li>";
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
                              // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                              break;
                            case 1:
                              // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                              break;
                            case 4:
                              // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                              break;
                            case 11:
                              // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                            case 12:
                              // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                              break;
                            case 13:
                              // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>"; 
                            break;
                            case 16:
                              // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                              break;
                            case 17:
                              // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                              break;
                            case 18:
                              // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                              break;
                          case 21:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                              break;
                          case 24:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                              break;
                          case 28:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                              break;
                          case 29:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                              break;
                          case 30:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 31:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                          case 32:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                          case 39:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 43:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;                  
                        }
                        
                        }
                    }
          
                    if(categoria_actual[0] === "RS VHA. "){
                      console.log("si es RS VHA");
                      for(i=0 ;i< 60;i++){
                      
                      switch(i){
                          case 0:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 1:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 4:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 11:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                          case 12:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 13:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>"; 
                          break;
                          case 16:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 17:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 18:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 21:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 24:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 28:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 29:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 30:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 31:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                        case 32:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                        case 39:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 43:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;                  
                      }
                      
                      }
                    }
                    if(categoria_actual[0] === "Basic Wall "){
                //    console.log("si es Basic Wall ");
                    for(i=0 ;i< 60;i++){
                    
                    switch(i){
                        case 0:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 1:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 5:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 10:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                        case 19:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 20:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>"; 
                        break;
                        case 21:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 22:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 23:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 24:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 25:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 27:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 31:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                      case 32:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                      case 33:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                      break;
                      case 34:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                      break;
                      case 42:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                      case 46:
                        // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;                  
                    }
                    
                    }
                    }
                    if(categoria_actual[0] === "Wall Foundation "){
                      console.log("si es Wall Foundation ");
                      for(i=0 ;i< 60;i++){
                      
                      switch(i){
                          case 0:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 1:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 5:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 6:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                          case 7:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 8:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>"; 
                          break;
                          case 9:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 10:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 11:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 12:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 13:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 14:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 20:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 21:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 22:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                        case 23:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>123"+result.properties[i].displayValue+"</li>";
                        break;
                        case 30:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>123"+result.properties[i].displayValue+"</li>";
                        break;
                                      
                      }
                      
                      }
                    }
                    if(categoria_actual[0] === "RS Fundacion Aislada Tipo "){
                      console.log("si es RS Fundacion Aislada Tipo ");
                      for(i=0 ;i< 60;i++){
                      
                      switch(i){
                          case 0:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 1:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 3:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 8:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                          case 10:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 11:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>"; 
                          break;
                          case 12:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 13:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 16:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 22:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 23:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 24:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 25:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 35:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 36:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                        case 37:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break; 
                                      
                      }
                      
                      }
                    }  
                    if(categoria_actual[0] === "Foundation Slab "){
                      console.log("si es Foundation Slab ");
                      for(i=0 ;i< 60;i++){
                      
                      switch(i){
                          case 0:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 1:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 4:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 10:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                          case 11:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 12:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>"; 
                          break;
                          case 14:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 15:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 16:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 19:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 20:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 21:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 24:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 28:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 29:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                        case 30:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                        case 31:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 37:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;   
                          case 40:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;                
                      }
                      
                      }
                    }
                    if(categoria_actual[0] === "Rebar Bar "){
                      console.log("si es Rebar Bar ");
                      for(i=0 ;i< 60;i++){
                      
                      switch(i){
                          case 0:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 1:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 3:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 4:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                          case 6:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 20:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>"; 
                          break;
                          case 22:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 23:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 24:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 25:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 26:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 36:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 45:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 46:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 47:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                        case 48:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                        case 60:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;
                        case 61:
                          // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break;   
                          case 63:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                          case 64:
                              // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                          break; 
                        case 65:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;
                        case 66:
                            // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                            break;
                        case 67:
                              // document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
                        break;               
                      }
                      
                      }
                    }
                
                         let nombre_actual = ""+result.properties[i].displayName;
                      
                        fecha_hormigonado = base;
                        let elementos_fecha = fecha_hormigonado.split("-");
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
                      // alert(elementos_fecha[1]+"/"+elementos_fecha[0]+"/"+elementos_fecha[2]);
                        //alert(today);
                        var d2 = '0'+elementos_fecha[1]+"/"+elementos_fecha[0]+"/"+elementos_fecha[2]; // FECHA PLAN
                        var d3=  '0'+elementos_fecha[1]+"-"+elementos_fecha[0]+"-"+elementos_fecha[2]; // FECHA PLAN
                        let compara = dates.compare(today,d2);
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
                              boton_fecha ="FECHA SIN FORMATO";
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
                        
                    
                 
          
                    
                    // document.getElementById("propiedades_id").innerHTML += " AEC Secuencia Hormigonado <li><b>"+" :</b>"+base+" Estado: "+boton_fecha+"</li>";
                 
                    
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

/*

function generaBotones(){
    console.log("GENERA BOTONES LLAMADO");
     getData().then((data) => {

           let keys = Object.keys(data);
           datos = keys;
            console.log("DATOS DATA:"+ datos);

            var i;
            botones = "";
          for (i = 0; i < datos.length; i++) {
              if(datos[i] != "undefined"){
                var botones =botones+ "<a class=\"dropdown-item\" onclick=\"selecciona("+"\'"+datos[i]+"\'"+");\">ddd"+datos[i]+"55</a>";
              }
              
          
          }
          document.getElementById("selectores").innerHTML = botones;
           });
} 


*/

$('#ha_option').change(function() {
  var selected_ha_option = $(this).val();
  
  filtros_selec_ha= Object.values(selected_ha_option);
  //alert(filtros_selec_ha[0]);
});

$('#piso_option').change(function() {
  var  selected_piso_option = $(this).val();
 
  filtros_selec_piso= Object.values(selected_piso_option);
 // alert(filtros_selec_piso[0]);
});

function selecciona(clave,filt){

  //  alert( "Valor Seleccionado " +clave);

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
//    alert( "Valor Seleccionado " +clave);

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
  $("#ha_option").select2("val", "0");
  $("#piso_option").select2("val", "0");
  viewer.isolate();
  viewer.fitToView( viewer.model);



  //location.reload();

  

  console.log("CLEAR !!");
    
  document.getElementById('largo').innerHTML = '';
  document.getElementById('acum').innerHTML = '' ;
  document.getElementById('peso').innerHTML = '' ;


 // gantt.init("gantt_here");

  

  getFiltros_2();

}


function buscaKeys(arr_objetivos,arr_listado){
  var resultado_busqueda = [];
  var cont = 0;
 
  for(var i =0; i<arr_listado.length;i++){
      for(var j = 0; j<arr_objetivos.length; j++){
      //  console.log("valores arr y keys : "+arr_listado[i]+"  "+arr_objetivos[j]);
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
  return resultado_busqueda;
}

function savePedido(){
  let ids_select = $("#id_seleccionados3").val();
  let fecha6 = $("#dateMask6").val();
  

  jQuery.post({
    url: '/saveOrdenes',
    contentType: 'application/json',
    data:  JSON.stringify({ 'fecha': ''+fecha6+'','ids':''+ids_select+'' }),
    success: function (res) {
      console.log('RESULTADO UPDATE BD');
      console.log(res);
    },
  });
}
function filtro_visual(){
  estado_filtro = 1;
  let mensaje_1;
  let mensaje_2;
  var elem = [0];
  var referencia = Array();
  var elem  = Array();
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
    valor_fil2 = filtros_selec_piso[0];
    valor_fil1 = filtros_selec_ha[0];
    if(typeof(valor_fil2) ==="undefined"){
      valor_fil2 = "sinvalor";
    }
    if(typeof(valor_fil1) ==="undefined"){
      valor_fil1 = "sinvalor";
    }
  //alert("Valor Parámetro 1: "+valor_fil1 + "   Val. Parámetro 2: "+valor_fil2 );
 /******************************************************************************
  * 
  * 
  * CASO 1 - FILTRO PISO 
  * 
  */
  if(valor_fil2 !== "" && (valor_fil1 ==="" || valor_fil1=== 'sinvalor') ){ // piso
      console.log("PISO");
      let filt = [parametro_nivel];
      var largoTotal = 0 ;
      var pesoTotal = 0 ;
      var resultado_ids;
      consulta_filtro2([parametro_nivel]).then((data) => {
      let keys = Object.keys(data);
      
      let elementos = buscaKeys(filtros_selec_piso,keys)
      var identificadores =0;
      let dbIds =0;
     
      if(elementos.length == 0){
    //    alert("No hay resultados");
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

      viewer.isolate(identificadores);
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
      var hoy = 16 + '/' +11 + '/' +2021;
      var cat_count=1;
      var esta =0;
      var categorias = Array();
      var categoria_actual;
      var indice_actual = 0;
      var tableTotales = document.getElementById('tabla_total');
      var tableRef = document.getElementById('tabla_fierro');
      var rowCount = tableRef.rows.length;
      var rowCountTotales = tableTotales.rows.length;
      var tableHeaderRowCount = 1;
      var pesoTotal = 0;
      var largoTotal = 0;
      var xTotal = 0;
      
      var xTotal = 0;
      for (var i = tableHeaderRowCount; i < rowCount; i++) {
        tableRef.deleteRow(tableHeaderRowCount);
      }
   
      for(var a=0; a< resultado_ids[0].length;a++){
        let actual =  resultado_ids[0][a];
        
        viewer.getProperties( resultado_ids[0][a], (result) => { 
         
          for(i=0 ;i< 60;i++){
            let nombre_actual = ""+result.properties[i].displayName;

       
            if(nombre_actual ==="Category"){
              categoria_actual_obj = result.properties[i].displayValue;
               console.log("valor categoria actual: "+categoria_actual_obj);
              if(categoria_actual_obj=="Revit Structural Rebar"){
                let peso = result.properties[82].displayValue;
                peso = peso.toFixed(2);
                peso = parseFloat(peso,0);
                let actuales = $("#id_seleccionados3").val();
                actual =   actual+","+actuales;
                $("#id_seleccionados3").val(actual);
                pesoTotal = pesoTotal+peso;
            //    pesoTotal  = parseFloat(pesoTotal).toFixed(2);
                console.log( "SUMATORIA PESO");
                console.log( pesoTotal);
                document.getElementById('peso').innerHTML = '' +pesoTotal.toFixed(2);
                let largo = result.properties[46].displayValue;
                largo = largo.toFixed(2);
                largo = parseFloat(largo,0);
                largoTotal = largoTotal+ largo;
                console.log( "SUMATORIA LARGO");
                console.log( largoTotal);
                largoTotal  = parseFloat(largoTotal).toFixed(2);

                document.getElementById('largo').innerHTML = '' +largoTotal;
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
                document.getElementById('acum').innerHTML = '' +xTotal.toFixed(2);

                document.getElementById('btn').innerHTML = '<button  class="btn btn-success btn-block" data-target="#modaldemo6" data-toggle="modal" ">Ejecutar Pedido <i class="icon ion-ios-arrow-left tx-11 mg-l-6"></i></button>';
                let g = name.split(' ');
                let y = g[2];
       
        
                
                // Inserta una fila en la tabla, en el índice 0
                var newRow   = tableRef.insertRow(1);
              
                // Inserta una celda en la fila, en el índice 0
                var newCell  = newRow.insertCell(0);
                var newCell2  = newRow.insertCell(1);
                var newCell3  = newRow.insertCell(2);
                var newCell4  = newRow.insertCell(3);
              
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
                  
               
                   
                
                  }
                  else{
                    esta = 0;
                  }
                }
            }
            if(nombre_actual  === parametro_fecha){
      
              fecha_hormigonado = result.properties[i].displayValue;
              console.log("PARAMETRO FECHA ELEMENTO ACTUAL");
              console.log(fecha_hormigonado);
              if(fecha_hormigonado.length >0 && fecha_hormigonado != "undefined"){
                let elementos_fecha = fecha_hormigonado.split("-");
                if(elementos_fecha.length>0 && fecha_hormigonado != "xx" && fecha_hormigonado != "" &&   fecha_hormigonado != "XXXX"&&   fecha_hormigonado != "XX"){
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
        
                  var d3=  '0'+elementos_fecha[1]+"/"+elementos_fecha[0]+"/"+elementos_fecha[2]; // FECHA PLAN
                  var d4 = elementos_fecha[0]+"-"+elementos_fecha[1]+"-"+elementos_fecha[2]; // FECHA PLAN
               
               
                  let resultado  = [result.name,d3];
                  c++;
               
                
                 break 
        
              
                }
              
                //cabecera = cabecera +body+" ]  });";
  
              }
      
             }
          }
          
        }) 
    
      }
      
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
    console.log("PISO & HORIZONTAL");
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
    //    alert("No hay resultados");
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
      viewer.isolate(identificadores);
      viewer.fitToView(identificadores, viewer.model);
    
   
     
     
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
      var rowCount = tableRef.rows.length;
      var rowCountTotales = tableTotales.rows.length;
      var tableHeaderRowCount = 1;
     
      
      
      for (var i = tableHeaderRowCount; i < rowCount; i++) {
        tableRef.deleteRow(tableHeaderRowCount);
      }
      for(var a=0; a< resultado_ids[0].length;a++){
        let actual =  resultado_ids[0][a];
        
        viewer.getProperties( resultado_ids[0][a], (result) => { 
         
          for(i=0 ;i< 60;i++){
            let nombre_actual = ""+result.properties[i].displayName;
            if(nombre_actual ==="Category"){
              
              categoria_actual_obj = result.properties[i].displayValue;
              console.log("CATEGORIA BUSCADA");
              console.log(categoria_actual_obj);
              if(categoria_actual_obj=="Revit Structural Rebar"){
                let peso = result.properties[82].displayValue;
                peso = peso.toFixed(2);
                console.log("PESO BUSCADO");
                console.log(peso);
                let actuales = $("#id_seleccionados3").val();
                actual =   actual+","+actuales;
                $("#id_seleccionados3").val(actual);
                pesoTotal = pesoTotal+parseFloat(peso,0);
            //    pesoTotal  = parseFloat(pesoTotal).toFixed(2);
                console.log( "SUMATORIA PESO");
                console.log( pesoTotal);
                document.getElementById('peso').innerHTML = '' +pesoTotal.toFixed(2);
                let largo = result.properties[46].displayValue;
                largo = largo.toFixed(2);
                largo = parseFloat(largo,0);
                console.log( "Largo");
                console.log( largo);
                console.log( typeof largo);
                largoTotal = largoTotal+ largo;
                console.log( "SUMATORIA LARGO");
                console.log( largoTotal);
              

                document.getElementById('largo').innerHTML = '' +largoTotal;
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
                document.getElementById('acum').innerHTML = '' +xTotal.toFixed(2);

                document.getElementById('btn').innerHTML = '<button  class="btn btn-success btn-block" data-target="#modaldemo6" data-toggle="modal" ">Ejecutar Pedido <i class="icon ion-ios-arrow-left tx-11 mg-l-6"></i></button>';
                let g = name.split(' ');
                let y = g[2];
       
        
                
                // Inserta una fila en la tabla, en el índice 0
                var newRow   = tableRef.insertRow(1);
              
                // Inserta una celda en la fila, en el índice 0
                var newCell  = newRow.insertCell(0);
                var newCell2  = newRow.insertCell(1);
                var newCell3  = newRow.insertCell(2);
                var newCell4  = newRow.insertCell(3);
              
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
                  
                  
                   
                  
                  }
                  else{
                    esta = 0;
                  }
                }
            }
            if(nombre_actual  === parametro_fecha){
      
              fecha_hormigonado = result.properties[i].displayValue;

              if(fecha_hormigonado.length >0 && fecha_hormigonado != "undefined"){
                let elementos_fecha = fecha_hormigonado.split("-");
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
               
                
            

                }
              
                //cabecera = cabecera +body+" ]  });";
  
              }
      
             }
          }
          
        }) 
    
      }
       
     
    });
  }
  if(( valor_fil2=== 'sinvalor' || valor_fil2 === "") && valor_fil1 !==""){ // partición ha
    console.log("PARTICION HA");
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
     //   alert("No hay resultados");
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
      viewer.isolate(identificadores);
      viewer.fitToView(identificadores, viewer.model);
    
  
     
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
      var largoTotal = 0;
      var pesoTotal = 0;
      var xTotal = 0;
      for (var i = tableHeaderRowCount; i < rowCount; i++) {
        tableRef.deleteRow(tableHeaderRowCount);
      }
      for(var a=0; a< resultado_ids[0].length;a++){
        let actual =  resultado_ids[0][a];
        
        viewer.getProperties( resultado_ids[0][a], (result) => { 
         
          for(i=0 ;i< 60;i++){
            let nombre_actual = ""+result.properties[i].displayName;
            if(nombre_actual ==="Category"){
              if(categoria_actual_obj=="Revit Structural Rebar"){
                let peso = result.properties[82].displayValue;
                peso = peso.toFixed(2);
                peso = parseFloat(peso,0);
                let actuales = $("#id_seleccionados3").val();
                actual =   actual+","+actuales;
                $("#id_seleccionados3").val(actual);
                pesoTotal = pesoTotal+peso;
            //    pesoTotal  = parseFloat(pesoTotal).toFixed(2);
                console.log( "SUMATORIA PESO");
                console.log( pesoTotal);
                document.getElementById('peso').innerHTML = '' +pesoTotal.toFixed(2);
                let largo = result.properties[46].displayValue;
                largo = largo.toFixed(2);
                largo = parseFloat(largo,0);
                console.log(largo);
                largoTotal = largoTotal+ largo;
                console.log( "SUMATORIA LARGO");
                console.log( largoTotal);
                //largoTotal  = parseFloat(largoTotal).toFixed(2);

                document.getElementById('largo').innerHTML = '' +largoTotal;
                let name = result.name;
              
                let resultado_mul = peso*largo;
                //console.log( "Resultado Multiplicación");
               // console.log( resultado_mul);
             
                resultado_mul =resultado_mul.toFixed(2);
                xTotal = xTotal + parseFloat(resultado_mul);
               console.log( "Total Multiplicación");
               console.log( xTotal);
                document.getElementById('acum').innerHTML = '' +xTotal.toFixed(2);

                document.getElementById('btn').innerHTML = '<button  class="btn btn-success btn-block" data-target="#modaldemo6" data-toggle="modal" ">Ejecutar Pedido <i class="icon ion-ios-arrow-left tx-11 mg-l-6"></i></button>';
                let g = name.split(' ');
                let y = g[2];
       
        
                
                // Inserta una fila en la tabla, en el índice 0
                var newRow   = tableRef.insertRow(1);
              
                // Inserta una celda en la fila, en el índice 0
                var newCell  = newRow.insertCell(0);
                var newCell2  = newRow.insertCell(1);
                var newCell3  = newRow.insertCell(2);
                var newCell4  = newRow.insertCell(3);
              
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
                  
                  
                   
                  
                  }
                  else{
                    esta = 0;
                  }
                }
            }
            if(nombre_actual  === parametro_fecha){
      
              fecha_hormigonado = result.properties[i].displayValue;

              if(fecha_hormigonado.length >0 && fecha_hormigonado != "undefined"){
                let elementos_fecha = fecha_hormigonado.split("-");
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
               
                
                 break 
               
               
                 

                }
              
                //cabecera = cabecera +body+" ]  });";
  
              }
      
             }
          }
          
        }) 
    
      }
       
 
    });
  }
}


function filtro_gantt( arreglo_filros){

  let mensaje_1;
  let mensaje_2;
  var elem = [0];
  var referencia = Array();
  var elem  = Array();
  
  //alert("Valor Parámetro 1: "+valor_fil1 + "   Val. Parámetro 2: "+valor_fil2 );
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
     //   alert("No hay resultados");
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
                  
                  
                  
                  
                  }
                  else{
                    esta = 0;
                  }
                }
            }
            if(nombre_actual  === parametro_fecha){
      
              fecha_hormigonado = result.properties[i].displayValue;

              if(fecha_hormigonado.length >0 && fecha_hormigonado != "undefined"){
                let elementos_fecha = fecha_hormigonado.split("-");
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
               
                
                 break 
               
            
                 

                }
              
                //cabecera = cabecera +body+" ]  });";
  
              }
      
             }
          }
          
        }) 
    
      }
       
  
    });

    
  
 
}
////////*************FUNCION PINTAR ELEMENTOS*********************//////////

function Pintar_Categorias( ){

  let mensaje_1;
  let mensaje_2;
  var elem = [0];
  var referencia = Array();
  var elem  = Array();
  
  //alert("Valor Parámetro 1: "+valor_fil1 + "   Val. Parámetro 2: "+valor_fil2 );
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
        //    alert("No hay resultados");

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
         
        if(categoria_actual_obj == "Revit Structural Rebar"){
                    
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
     viewer.start();
    });
}


function Pintar_Categorias2( ){

  let mensaje_1;
  let mensaje_2;
  var elem = [0];
  var referencia = Array();
  var elem  = Array();
  
  //alert("Valor Parámetro 1: "+valor_fil1 + "   Val. Parámetro 2: "+valor_fil2 );
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
        //    alert("No hay resultados");

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
         
        if(categoria_actual_obj == "Revit Structural Rebar"){
                    
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
     viewer.start();
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
  
  //alert("Valor Parámetro 1: "+valor_fil1 + "   Val. Parámetro 2: "+valor_fil2 );
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
     
    //  if(elementos.length == 0 && elementos){
        if(keys.length == 0 && keys){
    //    alert("No hay resultados");
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
      var xTotal = 0;
      var largoTotal = 0;
      for(t=0; t<resultado_ids.length;t++){
        for(var a=0; a< resultado_ids[t].length;a++){
          //  console.log("cantidad   "+resultado_ids[0].length);
            let categoria_actual_obj ="";
          //  console.log("RESULTADO IDS");
          //  console.log(resultado_ids[0][a]);
            let id_actual_tarea_1 = resultado_ids[t][a];
            viewer.getProperties( resultado_ids[t][a], (result) => { 
            //  console.log("PROPIEDADES OBJETO");
           //   console.log(result);
              let nombre_actua_objeto  =  result.name;
           // console.log("actual name  "+nombre_actua_objeto);
           // BUSCA LAS PROPIEDADES DEL OBJETO SELECCIONADO / APROXIMA LA CANTIDAD DE PROPIEDADES DISPONIBLES A 60 
           for(i=0 ;i< 82;i++){
            let nombre_actual = "";
         //   console.log("PROPIEDAD ACTUAL  "+result.properties[i].displayName);
       //  console.log('control error');
        //   console.log(result); 
                if(result.properties[i]){
                    if( result.properties[i].displayName != undefined || result.properties[i].length != 0|| result.properties.length != 0  ){
                          nombre_actual = ""+result.properties[i].displayName;
                    }
                }
          
              
                if(nombre_actual ==="Category"){  // reconoce categoria a la que pertenece el elemento
                   categoria_actual_obj = result.properties[i].displayValue;
                   if(categoria_actual_obj=="Revit Structural Rebar"){
                        let peso = result.properties[82].displayValue;
                        peso = peso.toFixed(2);
                        peso = parseFloat(peso,0)
                        console.log( "PESO");
                        console.log( peso);
                        let largo = result.properties[46].displayValue;
                        largo = largo.toFixed(2);
                        largo = parseFloat(largo)
                        console.log( "Largo");
                        console.log( largo);
                        largoTotal = parseFloat(largoTotal)+parseFloat(largo);
                        console.log( "SUMATORIA LARGO");
                        console.log( largoTotal);
                        let name = result.name;
                        let resultado_mul = parseFloat(peso,0)*parseFloat(largo,0);
                        resultado_mul = resultado_mul.toFixed(2);
                        let g = name.split(' ');
                        let y = g[2];
                        var tableRef = document.getElementById('tabla_fierro');

                        // Inserta una fila en la tabla, en el índice 0
                        var newRow   = tableRef.insertRow(1);
                      
                        // Inserta una celda en la fila, en el índice 0
                        var newCell  = newRow.insertCell(0);
                        var newCell2  = newRow.insertCell(1);
                        var newCell3  = newRow.insertCell(2);
                        var newCell4  = newRow.insertCell(3);
                      
                        // Añade un nodo de texto a la celda
                        var newText  = document.createTextNode(y);
                        newCell.appendChild(newText);

                        var newText2  = document.createTextNode(largo);
                        newCell2.appendChild(newText2);

                        var newText3  = document.createTextNode(peso);
                        newCell3.appendChild(newText3);

                        var newText4  = document.createTextNode(resultado_mul);
                        newCell4.appendChild(newText4);

                        
                
                        pesoTotal = pesoTotal+peso;
                      //  pesoTotal  = parseFloat(pesoTotal);
                        console.log( "SUMATORIA PESO");
                       console.log( pesoTotal);
                        document.getElementById('peso').innerHTML = '' +pesoTotal.toFixed(2);
                        
                      
                      //  largoTotal  = parseFloat(largoTotal).toFixed(2);

                        document.getElementById('largo').innerHTML = '' +largoTotal;
                        name = result.name;
                        peso = parseFloat(peso,0);
                        largo = parseFloat(largo,0);
                        resultado_mul = peso*largo;
                      //  console.log( "Resultado Multiplicación");
                       // console.log( resultado_mul);
                    
                        resultado_mul =resultado_mul.toFixed(2);
                        xTotal = xTotal + parseFloat(resultado_mul);
                   //     console.log( "Total Multiplicación");
                  //      console.log( xTotal);
                        document.getElementById('acum').innerHTML = '' +xTotal.toFixed(2);
                        document.getElementById('btn').innerHTML = '';

                   }
                }
                if(nombre_actual ===filtro_2){
                        valor_aec_piso  = result.properties[i].displayValue;
                        nivel_actual =  valor_aec_piso;
                    //  console.log("VALOR PARA AEC PISO: "+  valor_aec_piso);
                }
                
         
             
             }
            
            }) 
            id_tareas_objetos++;
          }
      }
      
       
  /*   gantt.config.columns = [
      {name:"text",       label:"Nombre",  width:"*", tree:true },
      {name:"start_date", label:"Inicio", align:"center" },
      {name:"duration",   label:"Duracion",   align:"center" },
      {name:"add",        label:"",           width:44 }
     ];*/


    
    });

    
  
 
}

function seleccion_modelo(id_tarea){

viewer.isolate(id_tarea);
viewer.fitToView(id_tarea, viewer.model);
//alert(id_tarea);
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
              viewer.start();
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