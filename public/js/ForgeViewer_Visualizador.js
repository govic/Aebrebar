var viewer;
var registro_ultimo_filtro ;
var id_pedidos_guardados =[];
var nombre_add_actual;

//var datos;
var filtro1 = false;
var filtro2 = false;
var filtro3 = false;
var referencia2 = Array();
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
var ids_plan =[];
var ids_bd =[];
var ids_db_update =[];
var ids_db_insert =[];
var listado_pesos = "";
var listado_largos = "";
var red = new THREE.Vector4(1, 0, 0, 0.5);
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
function filtro_visual2(nombre_cat_filtro,valor_filtro,piso){
  viewer.isolate();
  var contador_lg = 0;
  identificadores = Array();
  contador_lg = 0;

  peso = 0;
  estado_filtro = 1;
  let mensaje_1;
  let mensaje_2;
  var elem = [0];
  var referencia = Array();
  referencia2 = Array();
  var elem  = Array();
  pesoTotal = 0;
  filtros_selec_piso.length =0;
  filtros_selec_piso.push(valor_filtro);
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
if(valor_fil2 !== "" && (valor_fil1 ==="" || valor_fil1=== 'sinvalor') ){ // piso

     let filt = [parametro_nivel];
     var resultado_ids =Array();
     resultado_ids.length = 0;
     consulta_filtro2([parametro_nivel]).then((data) => {
     let keys = Object.keys(data);
     let elementos =Array();
     elementos.length = 0;
     elementos = buscaKeys(filtros_selec_piso,keys);
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
         console.log("FINALIZADO "+ pesos_piso3+"  "+pesos_piso4);
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
                console.log("valor categoria actual: "+categoria_actual_obj); 
                if(categoria_actual_obj=="Revit Structural Rebar"){
                  console.log("CONTANDO PESOS VALOR DE LG "+contador_lg+ "VALOR LGB "+a);
                  let peso = parseFloat(result.properties[82].displayValue);
                  peso = peso.toFixed(0);
                  peso = parseFloat(peso);
                  console.log("PESO BUSCADO");
                  console.log(peso);
                  
                  pesoTotal = pesoTotal+peso;
                  if(contador_lg == identificadores.length ){
                   console.log("contador LG"+contador_lg +" ids LG"+ identificadores.length);
                    console.log("CONTANDO PESOS VALOR DE LG FINALIZADO "+pesoTotal);
                  //  pesos_piso4 = pesoTotal;
                  identificadores.length = 0;
                    console.log("valor a"+a+"PESO TOTAL ACUMULADO FINAL 3 "+ pesos_piso3);
                    console.log("valor a"+a+"PESO TOTAL ACUMULADO FINAL 4 "+ pesos_piso4);
                    if(piso == '1'){
                      //   pesos_piso1 = pesoTotal;
                         pesos_piso1 =  pesoTotal;
                         console.log("Peso piso 1 "+pesoTotal);
                         pesoTotal = 0;
                         identificadores = Array();
                         contador_lg = 0;
                    
                       }
                       if(piso == '2'){
                         pesos_piso2 =  pesoTotal;
                         console.log("Peso piso 2 "+pesoTotal);
                        // pesoTotal = 0;
                         identificadores = Array();
                         contador_lg = 0;
                       }
                       if(piso == '3'){
                         pesos_piso3 =  pesoTotal;
                         console.log("Peso piso 3 "+pesoTotal);
                       //  pesoTotal = 0;
                         identificadores = Array();
                         contador_lg = 0;
                       }
                       if(piso == '4'){
                         pesos_piso4 =  pesoTotal;
                         console.log("Peso piso 4 "+pesoTotal);
                        //  pesoTotal = 0;
                         identificadores = Array();
                         contador_lg = 0;
                       }
                       if(piso == '5'){
                        pesos_piso5 =  pesoTotal;
                        console.log("Peso piso 5 "+pesoTotal);
                       //  pesoTotal = 0;
                        identificadores = Array();
                        contador_lg = 0;
                      }
                      if(piso == '6'){
                        pesos_piso6 =  pesoTotal;
                        console.log("Peso piso 6 "+pesoTotal);
                       //  pesoTotal = 0;
                        identificadores = Array();
                        contador_lg = 0;
                      }
                   
                       identificadores = Array();
                       contador_lg = 0;
                  }
              //    pesoTotal  = parseFloat(pesoTotal).toFixed(0);
                  console.log( pesoTotal);
                
                  let largo = parseFloat(result.properties[46].displayValue);
                  largo = largo.toFixed(0);
                  largo = parseFloat(largo,0);
                  console.log( "Largo");
                  console.log( largo);
                  
                  listado_pesos = listado_pesos +","+peso;
                  listado_largos = listado_largos +","+largo;
                  console.log("EDITO SELECCIONADOS ");
              
                  console.log( typeof largo);
                  largoTotal = largoTotal+ largo;
                  console.log( "SUMATORIA LARGO");
                  console.log( largoTotal);
                
                  let name = result.name;
                  peso = parseFloat(peso,0);
                  largo = parseFloat(largo,0);
                  let resultado_mul = peso*largo;
                  //console.log( "Resultado Multiplicación");
                // console.log( resultado_mul);
              
                  resultado_mul =resultado_mul.toFixed(0);
                  xTotal = xTotal + parseFloat(resultado_mul);
                  console.log( "Total Multiplicación");
                  console.log( xTotal);
                  let g = name.split(' ');
                  let y = g[2];
        
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
         console.log("FINALIZADO "+ pesos_piso3+"  "+pesos_piso4);
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
                console.log("valor categoria actual: "+categoria_actual_obj); 
                if(categoria_actual_obj=="Revit Structural Rebar"){
                  console.log("CONTANDO PESOS VALOR DE LG "+contador_lg+ "VALOR LGB "+a);
                  let peso = parseFloat(result.properties[82].displayValue);
                  peso = peso.toFixed(0);
                  peso = parseFloat(peso);
                  console.log("PESO BUSCADO");
                  console.log(peso);
                  
                  pesoTotal = pesoTotal+peso;
                  if(contador_lg == identificadores.length ){
                   console.log("contador LG"+contador_lg +" ids LG"+ identificadores.length);
                    console.log("CONTANDO PESOS VALOR DE LG FINALIZADO "+pesoTotal);
                  //  pesos_piso4 = pesoTotal;
                  identificadores.length = 0;
                    console.log("valor a"+a+"PESO TOTAL ACUMULADO FINAL 3 "+ pesos_piso3);
                    console.log("valor a"+a+"PESO TOTAL ACUMULADO FINAL 4 "+ pesos_piso4);
                    if(piso == '1'){
                      //   pesos_piso1 = pesoTotal;
                         pesos_ha1 =  pesoTotal;
                         console.log("pesos_ha 1 "+pesoTotal);
                         pesoTotal = 0;
                         identificadores = Array();
                         contador_lg = 0;
                    
                       }
                       if(piso == '2'){
                         pesos_ha2 =  pesoTotal;
                         console.log("pesos_ha 2 "+pesoTotal);
                        // pesoTotal = 0;
                         identificadores = Array();
                         contador_lg = 0;
                       }
                       if(piso == '3'){
                         pesos_ha3 =  pesoTotal;
                         console.log("pesos_ha 3 "+pesoTotal);
                       //  pesoTotal = 0;
                         identificadores = Array();
                         contador_lg = 0;
                       }
                       if(piso == '4'){
                        pesos_ha4 =  pesoTotal;
                         console.log("pesos_ha 4 "+pesoTotal);
                        //  pesoTotal = 0;
                         identificadores = Array();
                         contador_lg = 0;
                       }
                       if(piso == '5'){
                        pesos_ha5 =  pesoTotal;
                        console.log("pesos_ha 5 "+pesoTotal);
                       //  pesoTotal = 0;
                        identificadores = Array();
                        contador_lg = 0;
                      }
                      if(piso == '6'){
                        pesos_ha6 =  pesoTotal;
                        console.log("pesos_ha 6 "+pesoTotal);
                       //  pesoTotal = 0;
                        identificadores = Array();
                        contador_lg = 0;
                      }
                   
                       identificadores = Array();
                       contador_lg = 0;
                  }
              //    pesoTotal  = parseFloat(pesoTotal).toFixed(0);
                  console.log( pesoTotal);
                
                  let largo = parseFloat(result.properties[46].displayValue);
                  largo = largo.toFixed(0);
                  largo = parseFloat(largo,0);
                  console.log( "Largo");
                  console.log( largo);
                  
                  listado_pesos = listado_pesos +","+peso;
                  listado_largos = listado_largos +","+largo;
                  console.log("EDITO SELECCIONADOS ");
              
                  console.log( typeof largo);
                  largoTotal = largoTotal+ largo;
                  console.log( "SUMATORIA LARGO");
                  console.log( largoTotal);
                
                  let name = result.name;
                  peso = parseFloat(peso,0);
                  largo = parseFloat(largo,0);
                  let resultado_mul = peso*largo;
                  //console.log( "Resultado Multiplicación");
                // console.log( resultado_mul);
              
                  resultado_mul =resultado_mul.toFixed(0);
                  xTotal = xTotal + parseFloat(resultado_mul);
                  console.log( "Total Multiplicación");
                  console.log( xTotal);
                  let g = name.split(' ');
                  let y = g[2];
        
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
  $("#id_seleccionados3").val('');
  document.getElementById('peso').innerHTML = '';
  
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
      idsSeleccionados.length =0;
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
      var pesoActual = 0;
      var largoActual = 0;
      

      
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
              
                console.log("valor categoria actual: "+categoria_actual_obj);
                
                if(categoria_actual_obj=="Revit Structural Rebar"){
                  console.log("ENTRAR REBAR");
                  for(t=0;t<result.properties.length;t++){
                    let val_actual = result.properties[t].displayName;
                    if( val_actual == "RS Peso Lineal (kg/m)"){
                   
                      console.log("ENTRO A PESO LINEAL");
                      let peso = parseFloat(result.properties[t].displayValue);
                      
                      console.log("ANTES PESO BUSCADO");
                      console.log(peso);
                      console.log(result.properties[t].displayValue);
                      console.log(result);
                    //  peso = peso.toFixed(0);
                      peso = parseFloat(peso);
                      pesoActual = peso;
                      console.log("PESO BUSCADO");
                      console.log(peso);
                      //pesoTotal = pesoTotal+peso;
                  
                  
                      // pesoTotal  = parseFloat(pesoTotal).toFixed(0);
                      
                       console.log( "SUMATORIA PESO");
                       console.log( pesoTotal);
                       document.getElementById('peso').innerHTML = '' +pesoTotal.toFixed(0);
                       
                    }
                    if(val_actual == "Total Bar Length"){
                      console.log("TOTAL LENGTH BAR");
                      
                      let largo = parseFloat(result.properties[t].displayValue);
                      console.log(largo );
                      largo = largo.toFixed(0);
                      largo = parseFloat(largo,0);
                      largo = largo /100;
                      largoActual = largo;
                      console.log("convertido "+largo);
                      listado_largos = listado_largos+","+largo;
                      listado_pesos = listado_pesos + ","+peso;
                      largoTotal = largoTotal+ largo;
                      largoTotal = largoTotal;
                      console.log( "SUMATORIA LARGO");
                      console.log( largoTotal);
                      console.log( "Listado largos");
                      console.log(listado_largos);
                      //largoTotal  = parseFloat(largoTotal).toFixed(0);
                      listado_pesos = listado_pesos +","+peso;
                      listado_largos = listado_largos +","+largo;
                      $("#listado_largo").val(listado_largos);
                      $("#listado_pesos").val(listado_pesos);
                      document.getElementById('largo').innerHTML = '' +largoTotal.toFixed(0)+ ' mtrs';
                     
                    }
                    if((t+1 )==result.properties.length){ // termina de recorrer todas las propiedades
                          
                       let resultado_mul = pesoActual*largoActual;
                       pesoTotal = pesoTotal+resultado_mul;
                        $("#largo_total_pedido").val(largoTotal.toFixed(0));
                        $("#peso_total_pedido").val( pesoTotal.toFixed(0));
                        $("#resultado_total_pedido").val( pesoTotal);
                        document.getElementById('peso').innerHTML = '' + pesoTotal.toFixed(0)+ ' Kgs';
  
                        $("#listado_largo").val(listado_largos);
                        $("#listado_pesos").val(listado_pesos);
                        //console.log( "Resultado Multiplicación");
                      // console.log( resultado_mul);
                    
                        resultado_mul =resultado_mul.toFixed(0);
                        xTotal = xTotal + parseFloat(resultado_mul);
                        console.log( "Total Multiplicación");
                        console.log( xTotal);
                     //   document.getElementById('acum').innerHTML = '' +xTotal.toFixed(0);
  
                        document.getElementById('btn').innerHTML = '<button  class="btn btn-success btn-block" data-target="#modaldemo6" data-toggle="modal" ">Ejecutar Pedido <i class="icon ion-ios-arrow-left tx-11 mg-l-6"></i></button>';
                       // let g = name.split(' ');
                      //  let y = g[2];
                      
                    }
                  }
                  
                 
                  
                  let actuales = $("#id_seleccionados3").val();
                  actual =   actual+","+actuales;
                  $("#id_seleccionados3").val(actual);
                  $("#id_seleccionados4").val(actual);
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
      var pesoActual = 0;
      var largoActual =0;
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
              //if(categoria_actual_obj=="Revit Structural Rebar" && result.properties[82].displayValue != "" && result.properties[82].displayValue != null){
                if(categoria_actual_obj=="Revit Structural Rebar"){
                  console.log("ENTRAR REBAR");
                  for(t=0;t<result.properties.length;t++){
                    let val_actual = result.properties[t].displayName;
                    if( val_actual == "RS Peso Lineal (kg/m)"){
                   
                      console.log("ENTRO A PESO LINEAL");
                      let peso = parseFloat(result.properties[t].displayValue);
                      
                      console.log("ANTES PESO BUSCADO");
                      console.log(peso);
                      console.log(result.properties[t].displayValue);
                      console.log(result);
                  //    peso = peso.toFixed(0);
                      peso = parseFloat(peso);
                      pesoActual = peso;
                      console.log("PESO BUSCADO");
                      console.log(peso);
                      //pesoTotal = pesoTotal+peso;
                  
                  
                      // pesoTotal  = parseFloat(pesoTotal).toFixed(0);
                      
                       console.log( "SUMATORIA PESO");
                       console.log( pesoTotal);
                       document.getElementById('peso').innerHTML = '' +pesoTotal.toFixed(0);
                       
                    }
                    if(val_actual == "Total Bar Length"){
                      console.log("TOTAL LENGTH BAR");
                      
                      let largo = parseFloat(result.properties[t].displayValue);
                      console.log(largo );
                      largo = largo.toFixed(0);
                      largo = parseFloat(largo,0);
                      largo = largo /100;
                      largoActual = largo;
                      console.log("convertido "+largo);
                      listado_largos = listado_largos+","+largo;
                      listado_pesos = listado_pesos + ","+peso;
                      largoTotal = largoTotal+ largo;
                      largoTotal = largoTotal;
                      console.log( "SUMATORIA LARGO");
                      console.log( largoTotal);
                      console.log( "Listado largos");
                      console.log(listado_largos);
                      //largoTotal  = parseFloat(largoTotal).toFixed(0);
                      listado_pesos = listado_pesos +","+peso;
                      listado_largos = listado_largos +","+largo;
                      $("#listado_largo").val(listado_largos);
                      $("#listado_pesos").val(listado_pesos);
                      document.getElementById('largo').innerHTML = '' +largoTotal.toFixed(0)+ ' mtrs';
                     
                    }
                    if((t+1 )==result.properties.length){ // termina de recorrer todas las propiedades
                          
                       let resultado_mul = pesoActual*largoActual;
                        pesoTotal = pesoTotal+resultado_mul;
                        $("#largo_total_pedido").val(largoTotal.toFixed(0));
                        $("#peso_total_pedido").val(pesoTotal.toFixed(0));
                        $("#resultado_total_pedido").val(pesoTotal);
                        document.getElementById('peso').innerHTML = '' +pesoTotal.toFixed(0)+ ' Kgs';
  


                        
                        $("#listado_largo").val(listado_largos);
                        $("#listado_pesos").val(listado_pesos);
                        //console.log( "Resultado Multiplicación");
                      // console.log( resultado_mul);
                    
                        resultado_mul =resultado_mul.toFixed(0);
                        xTotal = xTotal + parseFloat(resultado_mul);
                        console.log( "Total Multiplicación");
                        console.log( xTotal);
                     //   document.getElementById('acum').innerHTML = '' +xTotal.toFixed(0);
  
                        //document.getElementById('btn').innerHTML = '<button  class="btn btn-success btn-block" data-target="#modaldemo6" data-toggle="modal" ">Ejecutar Pedido <i class="icon ion-ios-arrow-left tx-11 mg-l-6"></i></button>';
                       // let g = name.split(' ');
                      //  let y = g[2];
                      
                    }
                  }
                  
                 
                  
                  let actuales = $("#id_seleccionados3").val();
                  actual =   actual+","+actuales;
                  $("#id_seleccionados3").val(actual);
                  $("#id_seleccionados4").val(actual);
               
                let name = result.name;
              
                
       
        
                
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
      var pesoActual =0;
      var largoActual = 0;
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
              //if(categoria_actual_obj=="Revit Structural Rebar" && result.properties[82].displayValue != "" && result.properties[82].displayValue != null){
                if(categoria_actual_obj=="Revit Structural Rebar"){
                console.log("ENTRAR REBAR");
                for(t=0;t<result.properties.length;t++){
                  let val_actual = result.properties[t].displayName;
                  if( val_actual == "RS Peso Lineal (kg/m)"){
                 
                    console.log("ENTRO A PESO LINEAL");
                    let peso = parseFloat(result.properties[t].displayValue);
                    
                    console.log("ANTES PESO BUSCADO");
                    console.log(peso);
                    console.log(result.properties[t].displayValue);
                    console.log(result);
                    
                    peso = parseFloat(peso);
                    pesoActual = peso;
                    console.log("PESO BUSCADO");
                    console.log(peso);
                   
                
                
                    // pesoTotal  = parseFloat(pesoTotal).toFixed(0);
                    
                     console.log( "SUMATORIA PESO");
                     console.log( pesoTotal);
                     
                  }
                  if(val_actual == "Total Bar Length"){
                    console.log("TOTAL LENGTH BAR");
                    
                    let largo = parseFloat(result.properties[t].displayValue);
                    console.log(largo );
                    largo = largo.toFixed(0);
                    largo = parseFloat(largo,0);
                    
                    largo = largo /100;
                    largoActual = largo;
                    console.log("convertido "+largo);
                    listado_largos = listado_largos+","+largo;
                    listado_pesos = listado_pesos + ","+peso;
                    largoTotal = largoTotal+ largo;
                    largoTotal = largoTotal;
                    console.log( "SUMATORIA LARGO");
                    console.log( largoTotal);
                    console.log( "Listado largos");
                    console.log(listado_largos);
                    //largoTotal  = parseFloat(largoTotal).toFixed(0);
                    listado_pesos = listado_pesos +","+peso;
                    listado_largos = listado_largos +","+largo;
                    $("#listado_largo").val(listado_largos);
                    $("#listado_pesos").val(listado_pesos);
                    document.getElementById('largo').innerHTML = '' +largoTotal.toFixed(0)+ ' mtrs';
                   
                  }
                  if((t+1 )==result.properties.length){ // termina de recorrer todas las propiedades
                        
                     let resultado_mul = pesoActual*largoActual;
                     console.log("resultado multiplicacion");
                     console.log(pesoActual+"    "+largoActual );
                     console.log(resultado_mul);
                     pesoTotal = pesoTotal+resultado_mul;
                      $("#largo_total_pedido").val(largoTotal.toFixed(0));
                      $("#peso_total_pedido").val(pesoTotal.toFixed(0));
                      $("#resultado_total_pedido").val(pesoTotal);
                      document.getElementById('peso').innerHTML = '' +pesoTotal.toFixed(0)+ ' Kgs';

                      $("#listado_largo").val(listado_largos);
                      $("#listado_pesos").val(listado_pesos);
                      //console.log( "Resultado Multiplicación");
                    // console.log( resultado_mul);
                  
                      resultado_mul =resultado_mul.toFixed(0);
                      xTotal = xTotal + parseFloat(resultado_mul);
                      console.log( "Total Multiplicación");
                      console.log( xTotal);
                   //   document.getElementById('acum').innerHTML = '' +xTotal.toFixed(0);

                      document.getElementById('btn').innerHTML = '<button  class="btn btn-success btn-block" data-target="#modaldemo6" data-toggle="modal" ">Ejecutar Pedido <i class="icon ion-ios-arrow-left tx-11 mg-l-6"></i></button>';
                     // let g = name.split(' ');
                    //  let y = g[2];
                    
                  }
                }
                
               
                
                let actuales = $("#id_seleccionados3").val();
                actual =   actual+","+actuales;
                $("#id_seleccionados3").val(actual);
                $("#id_seleccionados4").val(actual);
               
                let name = result.name;
              
                
       
        
                
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

function getFiltros() {

 // console.log("MUESTRA.....!!!!");
    
      let filtrado = [filtro_1];
      let filtro_boton = "['"+filtro_1+"' ]";
      Pintar_Categorias_reflow();
      consulta_filtro(filtrado).then((data) => {
                let keys = Object.keys(data);
                let datos = keys;
             //   console.log("vienen datos");
              //  console.log("Filtro 1 y 2:"+ datos);
             //   console.log("keys iniciales");
             //   console.log(keys);
                var i;
                var botones =botones+ "<option value=\"'sin valor' \" >Sin Valor</option>";
                
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
     
      var pesoTotal = 0;
      var largoTotal = 0;
      var xTotal = 0;
     
      var tableTotales = document.getElementById('tabla_total');
      var tableRef = document.getElementById('tabla_fierro');

      document.getElementById('peso').innerHTML = '';
      document.getElementById('largo').innerHTML = '' ;
      //document.getElementById('acum').innerHTML = '' ;
      var rowCount = tableRef.rows.length;
      var rowCountTotales = tableTotales.rows.length;
      var tableHeaderRowCount = 1;
      for (var i = tableHeaderRowCount; i < rowCount; i++) {
        tableRef.deleteRow(tableHeaderRowCount);
      }
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
                elementos = buscaKeys(filtros_sel ,keys);
                var botones =botones+ "<option value=\"'sin valor' \" >Sin Valor</option>";
                for (i = 0; i < datos.length; i++) {
                  
                
                 ///// CREA ESTRUCTURA INICIAL////////////////////////////
                  //////////////////////////////////MUROS -////////////////////////////
              /*
                  var taskId = gantt.addTask({
                    id:cont_id_task,
                    text:datos[i],
                    start_date:hoy,
                    type: gantt.config.types.project,
                    duration:1
                  },13,1);
                  ids_task.push(cont_id_task);
                  cont_id_task++;
               
                */             
                  
                  ////////////////////////////////VIGAS/////////////////////////
                  
            /*    
                  var taskId = gantt.addTask({
                    id:cont_id_task,
                    text:datos[i],
                    start_date:hoy,
                    type: gantt.config.types.project,
                    duration:1
                  },14,1);
                  ids_task.push(cont_id_task);
                  cont_id_task++;
               */
                   ////////////////////////////////LOSAS/////////////////////////
               /*   
                  var taskId = gantt.addTask({
                    id:cont_id_task,
                    text:datos[i],
                    start_date:hoy,
                    type: gantt.config.types.project,
                    duration:1
                  },15,1);  
                  ids_task.push(cont_id_task);
                  cont_id_task++;
               */
                   ////////////////////////////////LOSAS/////////////////////////
                 /* 
                  var taskId = gantt.addTask({
                          id:cont_id_task,
                          text:datos[i],
                          start_date:hoy,
                          type: gantt.config.types.project,
                          duration:1
                        },20,1);  
                        ids_task.push(cont_id_task);
                        cont_id_task++;
                                           
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
               */   
                    botones =botones+ "<option value=\""+datos[i]+"\" >"+datos[i]+"</option>";
                }

               console.log("Idsss");
                console.log(ids_task);
             
             //   gantt.render();
                document.getElementById("piso_option").innerHTML = botones;
                //  document.getElementById("selectores2").innerHTML = botones;

                // PEGA LOS BOTONES PARA FILTRAR SEGUN PARÁMETROS
           });

           // ELIGE LOS NIVELES PARA EL PARÁMETRO ELEGIDO (PISO ) CREE LA GANTT 
       //    filtros_selec_piso =    ["00.- Radier EDA","01.- Cielo 1° Piso EDA","03.- Cielo 3° Piso EDA"]; 
}




function getFiltros_2() { // BUSCA NIVELES Y LUEGO PARTIDAD DENTRO DE CADA NIVEL
   
 // console.log("MUESTRA.....!!!!");
      
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
  encontro_elemento = 0;
  var ids_pedido = $("#id_seleccionados4").val();
 
  var q =  $("#fecha_pedido_fierro").val();
  var nombre_pedido = $("#nombre_pedido").val();
  
  var largos_pedidos = $("#listado_largo").val();
  var pesos_pedidos = $("#listado_pesos").val();

  var total_largo = $("#largo_total_pedido").val();
  var total_peso= $("#peso_total_pedido").val();
  var total_resultado = $("#resultado_total_pedido").val();

  if(nombre_pedido != "" && nombre_pedido != null){
      console.log("VALOR PREVIO ENVIO ORDENES");
      console.log(pesos_pedidos);
      console.log(largos_pedidos);
      console.log("URN ACTUAL "+urn_actual);
      let datas = JSON.stringify({ 'ids': ids_pedido, 'fecha': q,'pesos':total_peso,'largo':total_largo,'listado_largos':largos_pedidos,'listado_pesos':pesos_pedidos,'nombre_pedido':nombre_pedido,'urn_actual':urn_actual });
      const listadoIds = ids_pedido.split(",");
      var encontro_elemento = 0;
      jQuery.get({
        url: '/getOrdenes',
        contentType: 'application/json',
        success: function (res) {
          $list_pedidos = "";
          $fila = "";
        for(let r = 0; r<res.length; r++){
           ids_bd.push(Object.values(res[r]));
           console.log("VALOR EXISTE 1");
           console.log(urn_usada );
           console.log("///");
           console.log(res[r].urn_actual );
           if(urn_usada == res[r].urn_actual){
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
            
        }
        if(encontro_elemento != 1){
        
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
  else{
    alert("Debe Ingresar un nombre para el pedido");
  }


  
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
  var urn_ac =$("#urn_actual").val(); 
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
    data:  JSON.stringify({ 'ids': ids_pedido, 'fecha': q,'pesos':total_peso,'largo':total_largo,'listado_largos':largos_pedidos,'listado_pesos':pesos_pedidos,'nombre_pedido':nombre_pedido,'urn_actual':urn_ac }),
  
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
    if(id_pedidos_guardados[y] != "" && id_pedidos_guardados[y] != null)
    {
      z = z+","+id_pedidos_guardados[y];
    }
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
 console.log("PEDIDOS GUARDADOS IDS");
console.log(id_pedidos_guardados);
console.log(id_pedidos_guardados[indice]);
 var c = id_pedidos_guardados[indice].split(',').map(function(item) {
    return parseInt(item, 10);
  });
  console.log("valor de C")
  console.log(c);
  c.pop();
  console.log(c);
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
  console.log("URN PREVIO CARGA");
  console.log(urn_usada);
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
  let cont=0;
     for(let r = 0; r<res.length; r++){
     //   ids_bd.push(Object.values(res[r]));
        $fila = "";
        console.log("nombre pedido A");
       // console.log(Object.values(res[r]));
       if(urn_usada ==res[r].urn_actual ){
        
        $fila =  "<tr>"+"<th scope='row'>"+res[r].fecha+"</th>"+"<td>"+res[r].pesos+"</td>"+"<td>"+res[r].nombre_pedido+"</td>"+"<td><button class='btn btn-success btn-block'onclick='filtra_orden("+cont+")'>Visualizar</button><button class='btn btn-danger btn-block' onclick=eliminar_orden("+cont+")>Borrar</button></td>" + "</tr>";
        $list_pedidos = $list_pedidos +$fila;
        console.log(res[r].nombre_pedido);
       
        id_pedidos_guardados.push(res[r].ids);
        nombre_pedidos.push(res[r].nombre_pedido);
        fecha_pedidos.push(res[r].fecha);
        cont++;
       }
        
    }
    $("#body_pedidos").html($list_pedidos);

    
       console.log( ids_bd.length);
     
       console.log( ids_bd);
    
  
  
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
function callProyectos(){
  $("#forgeViewer").empty();
    getForgeToken(function (access_token) {
       jQuery.ajax({
         url: '/api/forge/oss/bucketsProyectos',
         headers: { 'Authorization': 'Bearer ' + access_token },
         success: function (res) {
           console.log(res);
           let dropdown = "";
            for (i = 0; i < res.length; i++) {
               dropdown = dropdown+ "<a href='#' class='dropdown-item' onclick='openViewer("+"\""+res[i].urn+"\""+")'>"+res[i].objectKey+"</a>"
               if(i==0){
                   openViewer(res[i].urn);
               }
            }  
           // document.getElementById("proyectos_visor").innerHTML = dropdown;
         },
         error: function (err) {
           callProyectos();
         }
       });
     })
}
function openViewer(urn){
  urn_usada = urn;
  $("#urn_actual").val(urn_usada);
  console.log("ACTUAL URN");
  console.log( urn_usada);
  launchViewer(urn);
   getForgeToken(function (access_token) {
       jQuery.ajax({
         url: 'https://developer.api.autodesk.com/modelderivative/v2/designdata/' + urn + '/manifest',
         headers: { 'Authorization': 'Bearer ' + access_token },
         success: function (res) {
           if (res.status === 'success') launchViewer(urn);
           else $("#forgeViewer").html('La traducción está en curso: ' + res.progress + '. Por favor vuelva a intentarlo en unos minutos..');
         },
         error: function (err) {
           var msgButton = 'This file is not translated yet! ' +
             '<button class="btn btn-xs btn-info" onclick="translateObject()"><span class="glyphicon glyphicon-eye-open"></span> ' +
             'Start translation</button>'
           $("#forgeViewer").html(msgButton);
         }
       });
     })

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
      getPlanObj();
      getOrdenes();
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
                              boton_fecha ="FECHA SIN FORMATO 2";
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
  var selected_ha_option = $('#ha_option').val();
  console.log("Selección filtro 1");
  console.log(selected_ha_option);  
  filtros_selec_ha= Object.values(selected_ha_option);

  
 // // // // // // // // // // alert(filtros_selec_ha[0]);
});

$('#piso_option').change(function() {
  var  selected_piso_option = $('#piso_option').val();
  console.log("Selección filtro 2");
  console.log(selected_piso_option);
 
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
  $("#id_seleccionados3").val('');
  $("#id_seleccionados4").val('');
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
    
      document.getElementById('largo').innerHTML = '';
      document.getElementById('acum').innerHTML = '' ;
      document.getElementById('peso').innerHTML = '' ;
      document.getElementById('btn').innerHTML = '' ;
      
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
     viewer.start();
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

      document.getElementById('peso').innerHTML = '';
      document.getElementById('largo').innerHTML = '' ;
      document.getElementById('acum').innerHTML = '' ;
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
            
              console.log("valor categoria actual: "+categoria_actual_obj);
              if(categoria_actual_obj=="Revit Structural Rebar"){
                let peso = parseFloat(result.properties[82].displayValue);
                peso = peso.toFixed(0);
                peso = parseFloat(peso);
                console.log("PESO BUSCADO");
                console.log(peso);
                let actuales = $("#id_seleccionados3").val();
                actual =   actual+","+actuales;
                $("#id_seleccionados3").val(actual);
                $("#id_seleccionados4").val(actual);
                pesoTotal = pesoTotal+peso;
            //    pesoTotal  = parseFloat(pesoTotal).toFixed(0);
                console.log( "SUMATORIA PESO");
                console.log( pesoTotal);
                document.getElementById('peso').innerHTML = '' +pesoTotal.toFixed(0);
                let largo = parseFloat(result.properties[46].displayValue);
                largo = largo.toFixed(0);
                largo = parseFloat(largo,0);
                console.log( "Largo");
                console.log( largo);
                console.log( typeof largo);
                largoTotal = largoTotal+ largo;
                console.log( "SUMATORIA LARGO");
                console.log( largoTotal);
              
                document.getElementById('largo').innerHTML = '';
                document.getElementById('largo').innerHTML = '' +largoTotal;
                let name = result.name;
                peso = parseFloat(peso,0);
                largo = parseFloat(largo,0);
                let resultado_mul = peso*largo;
                //console.log( "Resultado Multiplicación");
               // console.log( resultado_mul);
             
                resultado_mul =resultado_mul.toFixed(0);
                xTotal = xTotal + parseFloat(resultado_mul);
               console.log( "Total Multiplicación");
               console.log( xTotal);
               // document.getElementById('acum').innerHTML = '' +xTotal.toFixed(0);

                document.getElementById('btn').innerHTML = '';
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
              //    console.log("VALOR CATEGORIA PRE-INSERCIÓN  "+categoria_actual_obj);
             /*     switch ( valor_aec_piso){
    
                    case "00 Base": // 
    
              //      console.log("ENTRE PARA CREAR TASK -00 Base");
              
                        if(categoria_actual_obj == "Revit Walls"){
                          var taskId = gantt.addTask({
                            id: id_tareas_objetos,
                            text: nombre_actua_objeto,
                            start_date:fecha_objeto,
                            duration:1
                          },1000,1);
    
                          id_tareas_objetos++;
                          activo_hormigonado = 0;
                          
    
                        }
                        if(categoria_actual_obj == "Revit Floors"){
                          var taskId = gantt.addTask({
                            id: id_tareas_objetos,
                            text: nombre_actua_objeto,
                            start_date:fecha_objeto,
                            duration:1
                          },1001,1);
                        
                          id_tareas_objetos++;
                          activo_hormigonado = 0;
                        }
                        if(categoria_actual_obj == "Revit Structural Foundations"){
                          var taskId = gantt.addTask({
                            id: id_tareas_objetos,
                            text: nombre_actua_objeto,
                            start_date:fecha_objeto,
                            duration:1
                          },1002,1);
                         
                          id_tareas_objetos++;
                          activo_hormigonado = 0;
        
                        }
                        if(categoria_actual_obj== "Revit Structural Columns"){
                          var taskId = gantt.addTask({
                            id: id_tareas_objetos,
                            text: nombre_actua_objeto,
                            start_date:fecha_objeto,
                            duration:1
                          },1003,1);
                       
                          id_tareas_objetos++;
                          activo_hormigonado = 0;
                        } 
                        if(categoria_actual_obj=="Revit Structural Rebar"){
                          
                            console.log('ENTRO A REBAR STRCUT 1');
                            var taskId = gantt.addTask({
                              id: id_tareas_objetos,
                              text: nombre_actua_objeto,
                              start_date:fecha_objeto,
                              duration:1
                            },1004,1);
                           
                            id_tareas_objetos++;
                            activo_hormigonado = 0;
                         
                        }
                        break;
                    
                    case "00.- Radier EDA":
                //      console.log("ENTRE PARA CREAR TASK -00.- Radier EDA");
                          if(categoria_actual_obj == "Revit Walls"){
                            var taskId = gantt.addTask({
                              id: id_actual_tarea_1,
                              text: nombre_actua_objeto,
                              start_date:fecha_objeto,
                              duration:1
                            },1005,1);
                         
                            id_tareas_objetos++;
                            activo_hormigonado = 0;
                          }
                          if(categoria_actual_obj == "Revit Floors"){
                            var taskId = gantt.addTask({
                              id: id_actual_tarea_1,
                              text: nombre_actua_objeto,
                              start_date:fecha_objeto,
                              duration:1
                            },1006,1);
                          
                            id_tareas_objetos++;
                            activo_hormigonado = 0;
                          }
                          if(categoria_actual_obj == "Revit Structural Foundations"){
                            var taskId = gantt.addTask({
                              id: id_actual_tarea_1,
                              text: nombre_actua_objeto,
                              start_date:fecha_objeto,
                              duration:1
                            },1007,1);
                        
                            id_tareas_objetos++;
                            activo_hormigonado = 0;
        
                          }
                          if(categoria_actual_obj== "Revit Structural Columns"){
                            var taskId = gantt.addTask({
                              id: id_actual_tarea_1,
                              text: nombre_actua_objeto,
                              start_date:fecha_objeto,
                              duration:1
                            },1008,1);
                           
                            id_tareas_objetos++;
                            activo_hormigonado = 0;
                          } 
                          if(categoria_actual_obj=="Revit Structural Rebar"){
                          
                          console.log('ENTRO A REBAR STRCUT');
                          var taskId = gantt.addTask({
                            id: id_tareas_objetos,
                            text: nombre_actua_objeto,
                            start_date:fecha_objeto,
                            duration:1
                          },1009,1);
                         
                          id_tareas_objetos++;
                          activo_hormigonado = 0;
                       
                          }
                        break;
                    
                    case "01.- Cielo 1° Piso EDA":
               //       console.log("ENTRE PARA CREAR TASK -01.- Cielo 1° Piso EDA");
                
                          if(categoria_actual_obj == "Revit Walls"){
                            var taskId = gantt.addTask({
                              id: id_actual_tarea_1,
                              text: nombre_actua_objeto,
                              start_date:fecha_objeto,
                              duration:1
                            },1010,1);
                           
                            id_tareas_objetos++;
                            activo_hormigonado = 0;
                          }
                          if(categoria_actual_obj == "Revit Floors"){
                            var taskId = gantt.addTask({
                              id: id_actual_tarea_1,
                              text: nombre_actua_objeto,
                              start_date:fecha_objeto,
                              duration:1
                            },1011,1);
                           
                            id_tareas_objetos++;
                            activo_hormigonado = 0;
                          }
                          if(categoria_actual_obj == "Revit Structural Foundations"){
                            var taskId = gantt.addTask({
                              id: id_actual_tarea_1,
                              text: nombre_actua_objeto,
                              start_date:fecha_objeto,
                              duration:1
                            },1012,1);
                           
                            id_tareas_objetos++;
                            activo_hormigonado = 0;
        
                          }
                          if(categoria_actual_obj== "Revit Structural Columns"){
                            var taskId = gantt.addTask({
                              id: id_actual_tarea_1,
                              text: nombre_actua_objeto,
                              start_date:fecha_objeto,
                              duration:1
                            },1013,1);
                           
                            id_tareas_objetos++;
                            activo_hormigonado = 0;
                          }
                          if(categoria_actual_obj=="Revit Structural Rebar"){
                          
                          console.log('ENTRO A REBAR STRCUT');
                          var taskId = gantt.addTask({
                            id: id_tareas_objetos,
                            text: nombre_actua_objeto,
                            start_date:fecha_objeto,
                            duration:1
                          },1014,1);
                         
                          id_tareas_objetos++;
                          activo_hormigonado = 0;
                       
                          } 
                        break;
                    
                    case "02.- Cielo 2° Piso EDA":
                          if(categoria_actual_obj == "Revit Walls"){
                            var taskId = gantt.addTask({
                              id: id_tareas_objetos,
                              text: nombre_actua_objeto,
                              start_date:fecha_objeto,
                              duration:1
                            },1015,1);
                           
                            id_tareas_objetos++;
                            activo_hormigonado = 0;
                          }
                          if(categoria_actual_obj == "Revit Floors"){
                            var taskId = gantt.addTask({
                              id: id_tareas_objetos,
                              text: nombre_actua_objeto,
                              start_date:fecha_objeto,
                              duration:1
                            },1016,1);
                           
                            id_tareas_objetos++;
                            activo_hormigonado = 0;
                          }
                          if(categoria_actual_obj == "Revit Structural Foundations"){
                            var taskId = gantt.addTask({
                              id: id_tareas_objetos,
                              text: nombre_actua_objeto,
                              start_date:fecha_objeto,
                              duration:1
                            },1017,1);
                           
                            id_tareas_objetos++;
                            activo_hormigonado = 0;
        
                          }
                          if(categoria_actual_obj== "Revit Structural Columns"){
                            var taskId = gantt.addTask({
                              id: id_tareas_objetos,
                              text: nombre_actua_objeto,
                              start_date:fecha_objeto,
                              duration:1
                            },1018,1);
                           
                            id_tareas_objetos++;
                            activo_hormigonado = 0;
                          } 
                          if(categoria_actual_obj=="Revit Structural Rebar"){
                          
                          console.log('ENTRO A REBAR STRCUT');
                          var taskId = gantt.addTask({
                            id: id_tareas_objetos,
                            text: nombre_actua_objeto,
                            start_date:fecha_objeto,
                            duration:1
                          },1019,1);
                         
                          id_tareas_objetos++;
                          activo_hormigonado = 0;
                       
                          }
                        break;
                    case "03.- Cielo 3° Piso EDA":
                          if(categoria_actual_obj == "Revit Walls"){
                            var taskId = gantt.addTask({
                              id: id_tareas_objetos,
                              text: nombre_actua_objeto,
                              start_date:fecha_objeto,
                              duration:1
                            },1020,1);
                           
                            id_tareas_objetos++;
                            activo_hormigonado = 0;
                         
                         
                          }
                          if(categoria_actual_obj == "Revit Floors"){
                            var taskId = gantt.addTask({
                              id: id_tareas_objetos,
                              text: nombre_actua_objeto,
                              start_date:fecha_objeto,
                              duration:1
                            },1021,1);
                           
                            id_tareas_objetos++;
                            activo_hormigonado = 0;
                          }
                          if(categoria_actual_obj == "Revit Structural Foundations"){
                            var taskId = gantt.addTask({
                              id: id_tareas_objetos,
                              text: nombre_actua_objeto,
                              start_date:fecha_objeto,
                              duration:1
                            },1022,1);
                           
                            id_tareas_objetos++;
                            activo_hormigonado = 0;
        
                          }
                          if(categoria_actual_obj== "Revit Structural Columns"){
                            var taskId = gantt.addTask({
                              id: id_tareas_objetos,
                              text: nombre_actua_objeto,
                              start_date:fecha_objeto,
                              duration:1
                            },1023,1);
                           
                            id_tareas_objetos++;
                            activo_hormigonado = 0;
                          } 
                          if(categoria_actual_obj=="Revit Structural Rebar"){
                          
                          console.log('ENTRO A REBAR STRCUT');
                          var taskId = gantt.addTask({
                            id: id_tareas_objetos,
                            text: nombre_actua_objeto,
                            start_date:fecha_objeto,
                            duration:1
                          },1024,1);
                         
                          id_tareas_objetos++;
                          activo_hormigonado = 0;
                       
                          }
                        break;
                    case "04.- Cielo 4° Piso EDA":
                            if(categoria_actual_obj == "Revit Walls"){
                              var taskId = gantt.addTask({
                                id: id_tareas_objetos,
                                text: nombre_actua_objeto,
                                start_date:fecha_objeto,
                                duration:1
                              },1025,1);
                             
                              id_tareas_objetos++;
                              activo_hormigonado = 0;
                            }
                            if(categoria_actual_obj == "Revit Floors"){
                              var taskId = gantt.addTask({
                                id: id_tareas_objetos,
                                text: nombre_actua_objeto,
                                start_date:fecha_objeto,
                                duration:1
                              },1026,1);
                             
                              id_tareas_objetos++;
                              activo_hormigonado = 0;
                            }
                            if(categoria_actual_obj == "Revit Structural Foundations"){
                              var taskId = gantt.addTask({
                                id: id_tareas_objetos,
                                text: nombre_actua_objeto,
                                start_date:fecha_objeto,
                                duration:1
                              },1027,1);
                             
                              id_tareas_objetos++;
                              activo_hormigonado = 0;
        
                            }
                            if(categoria_actual_obj== "Revit Structural Columns"){
                              var taskId = gantt.addTask({
                                id: id_tareas_objetos,
                                text: nombre_actua_objeto,
                                start_date:fecha_objeto,
                                duration:1
                              },1028,1);
                             
                              id_tareas_objetos++;
                              activo_hormigonado = 0;
                            } 
                        break;
                    case "05.- Cielo 5° Piso EDA":
                            if(categoria_actual_obj == "Revit Walls"){
                              var taskId = gantt.addTask({
                                id: id_tareas_objetos,
                                text: nombre_actua_objeto,
                                start_date:fecha_objeto,
                                duration:1
                              },1029,1);
                             
                              id_tareas_objetos++;
                              activo_hormigonado = 0;
                            }
                            if(categoria_actual_obj == "Revit Floors"){
                              var taskId = gantt.addTask({
                                id: id_tareas_objetos,
                                text: nombre_actua_objeto,
                                start_date:fecha_objeto,
                                duration:1
                              },1030,1);
                             
                              id_tareas_objetos++;
                              activo_hormigonado = 0;
                            }
                            if(categoria_actual_obj == "Revit Structural Foundations"){
                              var taskId = gantt.addTask({
                                id: id_tareas_objetos,
                                text: nombre_actua_objeto,
                                start_date:fecha_objeto,
                                duration:1
                              },1031,1);
                             
                              id_tareas_objetos++;
                              activo_hormigonado = 0;
        
                            }
                            if(categoria_actual_obj== "Revit Structural Columns"){
                              var taskId = gantt.addTask({
                                id: id_tareas_objetos,
                                text: nombre_actua_objeto,
                                start_date:fecha_objeto,
                                duration:1
                              },1032,1);
                             
                              id_tareas_objetos++;
                              activo_hormigonado = 0;
                            } 
                            if(categoria_actual_obj=="Revit Structural Rebar"){
                          
                            console.log('ENTRO A REBAR STRCUT');
                            var taskId = gantt.addTask({
                              id: id_tareas_objetos,
                              text: nombre_actua_objeto,
                              start_date:fecha_objeto,
                              duration:1
                            },1033,1);
                           
                            id_tareas_objetos++;
                            activo_hormigonado = 0;
                         
                            }
                        break;
                    case "06.- Cielo 6° Piso EDA":
                            if(categoria_actual_obj == "Revit Walls"){
                              var taskId = gantt.addTask({
                                id: id_tareas_objetos,
                                text: nombre_actua_objeto,
                                start_date:fecha_objeto,
                                duration:1
                              },1034,1);
                             
                              id_tareas_objetos++;
                              activo_hormigonado = 0;
                            }
                            if(categoria_actual_obj == "Revit Floors"){
                              var taskId = gantt.addTask({
                                id: id_tareas_objetos,
                                text: nombre_actua_objeto,
                                start_date:fecha_objeto,
                                duration:1
                              },1035,1);
                             
                              id_tareas_objetos++;
                              activo_hormigonado = 0;
                            }
                            if(categoria_actual_obj == "Revit Structural Foundations"){
                              var taskId = gantt.addTask({
                                id: id_tareas_objetos,
                                text: nombre_actua_objeto,
                                start_date:fecha_objeto,
                                duration:1
                              },1036,1);
                             
                              id_tareas_objetos++;
                              activo_hormigonado = 0;
        
                            }
                            if(categoria_actual_obj== "Revit Structural Columns"){
                              var taskId = gantt.addTask({
                                id: id_tareas_objetos,
                                text: nombre_actua_objeto,
                                start_date:fecha_objeto,
                                duration:1
                              },1037,1);
                             
                              id_tareas_objetos++;
                              activo_hormigonado = 0;
                            } 
                            if(categoria_actual_obj=="Revit Structural Rebar"){
                          
                            console.log('ENTRO A REBAR STRCUT');
                            var taskId = gantt.addTask({
                              id: id_tareas_objetos,
                              text: nombre_actua_objeto,
                              start_date:fecha_objeto,
                              duration:1
                            },1038,1);
                           
                            id_tareas_objetos++;
                            activo_hormigonado = 0;
                         
                            }
                          break;
                    default:
                 //     console.log("PASE POR DEFAUL");
                      var taskId = gantt.addTask({
                        id: id_tareas_objetos,
                        text: 'TAREA OUT',
                        start_date:fecha_objeto,
                        duration:1
                      },1);

                      id_tareas_objetos++;
                      activo_hormigonado = 0;
                      break;
                  }*/
    
                //  gantt.render();
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