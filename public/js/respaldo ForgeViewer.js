var viewer;
//var datos;
var filtro1 = false;
var filtro2 = false;
var filtro3 = false;
var valor_fil1;
var valor_fil2;
var filtros_selec_piso = 0;
var filtros_selec_ha = 0;

function handleObjectLoaded(){
  

}

function getFiltros() {
   
// ["AEC Partición HA","AEC Piso","AEC Secuencia hormigonado"];
 
  //var filtro1 = $('#checkbox-2').is(':checked');// AEC Piso'
 // var filtro2 = $('#checkbox-3').is(':checked');// 'AEC Secuencia hormigonado'
  //var filtro3 = $('#checkbox-4').is(':checked'); //  'AEC Partición HA'

/*
  if(filtro2 == true  && filtro1 == false && filtro3 == false){ //AEC Piso
    
      let filtrado = ['AEC Piso'];
      let filtro_boton = "['AEC Piso']";
      valor_fil1 = "";
      consulta_filtro(filtrado).then((data) => {
                let keys = Object.keys(data);
                let datos = keys;
                console.log("Filtro 2:"+ datos);

                var i;
                var botones= "";
                for (i = 0; i < datos.length; i++) {
                  
                    var botones =botones+ "<a class=\"dropdown-item\" onclick=\"selecciona2("+"\'"+datos[i]+"\'"+ ","+filtro_boton+" );\">"+datos[i]+"</a>";
                
                }
                document.getElementById("selectores2").innerHTML = botones;
           });
  }

  if(filtro1 == true && filtro2 == false && filtro3 == false){ // AEC Partición HA
    
      let filtrado = ['AEC Partición HA'];
      valor_fil2 = "";
      let filtro_boton = "['AEC Partición HA']";
      consulta_filtro(filtrado).then((data) => {
                let keys = Object.keys(data);
               let datos = keys;
                console.log("Filtro 1:"+ datos);

                var i;
                var botones= "";
                for (i = 0; i < datos.length; i++) {
                    var botones =botones+ "<a class=\"dropdown-item\" onclick=\"selecciona("+"\'"+datos[i]+"\'"+ ","+filtro_boton+" );\">"+datos[i]+"</a>";
                
                }
                document.getElementById("selectores").innerHTML = botones;
           });
  }
  
  if(filtro3 == true  && filtro2 == false && filtro1 == false){
    
      let filtrado = ["AEC Secuencia hormigonado"];
      let filtro_boton = "['AEC Secuencia hormigonado']";
      consulta_filtro(filtrado).then((data) => {
                let keys = Object.keys(data);
                 let datos = keys;
                console.log("Filtro 3:"+ datos);

                var i;
                var botones= "";
                for (i = 0; i < datos.length; i++) {
                    var botones =botones+ "<a class=\"dropdown-item\" onclick=\"selecciona("+"\'"+datos[i]+"\'"+ ","+filtro_boton+" );\">"+datos[i]+"</a>";
                
                }
                document.getElementById("selectores").innerHTML = botones;
           });
  }

*/
  //if(filtro1 == true && filtro2 == true && filtro3 == false  ){ // dos seleccionados  AEC Partición HA","AEC Piso
    
      let filtrado = ["AEC Partición HA"];
      let filtro_boton = "['AEC Partición HA' ]";
      consulta_filtro(filtrado).then((data) => {
                let keys = Object.keys(data);
                let datos = keys;
                console.log("vienen datos");
                console.log("Filtro 1 y 2:"+ datos);
                console.log("keys iniciales");
                console.log(keys);
                var i;
                var botones= "";
                
                for (i = 0; i < datos.length; i++) {
                    var botones =botones+ "<option value=\""+datos[i]+"\" >"+datos[i]+"</option>";
                //    var botones =botones+ "<option value=\" "+datos[i]+"\" onclick=\"selecciona("+"\'"+datos[i]+"\'"+ ","+filtro_boton+" );\">"+datos[i]+"</a>";
                

                }
                document.getElementById("ha_option").innerHTML = botones;
           });


      filtrado = ['AEC Piso'];
      filtro_boton = "['AEC Piso']";
      consulta_filtro(filtrado).then((data) => {
                let keys = Object.keys(data);
                let datos = keys;
                console.log("Filtro 2:"+ datos);
                console.log("keys iniciales");
                console.log(keys);
                var i;
                var botones= "";
                for (i = 0; i < datos.length; i++) {
                  
                   // var botones =botones+ "<a class=\"dropdown-item\" onclick=\"selecciona2("+"\'"+filtro_boton+"\'"+ ","+filtro_boton+" );\">"+datos[i]+"</a>";
                   var botones =botones+ "<option value=\""+datos[i]+"\" >"+datos[i]+"</option>";
                }
                document.getElementById("piso_option").innerHTML = botones;
                //  document.getElementById("selectores2").innerHTML = botones;
           });
  //}
 /* if(filtro1 == true && filtro3 == true  && filtro2 == false ){
    
      let filtrado = ["AEC Partición HA","AEC Secuencia hormigonado"];
      let filtro_boton = "['AEC Partición HA','AEC Secuencia hormigonado' ]";
      consulta_filtro(filtrado).then((data) => {
                let keys = Object.keys(data);
                let datos = keys;
                console.log("Filtro 1 y 3:"+ datos);

                var i;
                var botones= "";
                for (i = 0; i < datos.length; i++) {
                    var botones =botones+ "<a class=\"dropdown-item\" onclick=\"selecciona("+"\'"+datos[i]+"\'"+ ","+filtro_boton+" );\">"+datos[i]+"</a>";
                
                }
                document.getElementById("selectores").innerHTML = botones;
           });
  }
  if(filtro2 == true && filtro3 == true   && filtro1 == false ){
    
      let filtrado = ["AEC Piso","AEC Secuencia hormigonado"];
      let filtro_boton = "['AEC Piso','AEC Secuencia hormigonado' ]";
      consulta_filtro(filtrado).then((data) => {
                let keys = Object.keys(data);
                 let datos = keys;
                console.log("Filtro 2 y 3:"+ datos);

                var i;
                var botones= "";
                for (i = 0; i < datos.length; i++) {
                    var botones =botones+ "<a class=\"dropdown-item\" onclick=\"selecciona("+"\'"+datos[i]+"\'"+ ","+filtro_boton+" );\">"+datos[i]+"</a>";
                
                }
                document.getElementById("selectores").innerHTML = botones;
           });
  }
  if(filtro1 == true &&  filtro2 == true &&filtro3 == true ){
    
      let filtrado = ["AEC Partición HA","AEC Piso","AEC Secuencia hormigonado"];
      let filtro_boton = "['AEC Partición HA','AEC Piso' ,'AEC Secuencia hormigonado']";
      consulta_filtro(filtrado).then((data) => {
                let keys = Object.keys(data);
                let datos = keys;
                console.log("Filtro 1 ,2 y 3:"+ datos);

                var i;
                var botones= "";
                for (i = 0; i < datos.length; i++) {
                    var botones =botones+ "<a class=\"dropdown-item\" onclick=\"selecciona("+"\'"+datos[i]+"\'"+ ","+filtro_boton+" );\">"+datos[i]+"</a>";
                
                }
                document.getElementById("selectores").innerHTML = botones;
           });
  }*/

}


function getFecha(id_objeto){

  viewer.getProperties(id_objeto, (result) => { 

    for(i=0 ;i< 60;i++){
      let nombre_actual = ""+result.properties[i].displayName;
      
      if(nombre_actual  === "AEC Secuencia Hormigonado"){

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
         
          // document.getElementById("selectores").innerHTML = "<a class=\"dropdown-item\" >Seleccione Filtro</a>";
           getFiltros();
    });


 viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT,(event)=>{
     let dbId = viewer.getSelection();
      

       document.getElementById("propiedades_id").innerHTML = "";
   
   
       viewer.getProperties(dbId[0], (result) => { 

          console.log("nombre"+result.name); 
          let fecha_hormigonado = "";
         
          document.getElementById("propiedades_id").innerHTML += "<li><b> Nombre</b> :"+result.name+"</li>";
          let boton_fecha = "";


          for(i=0 ;i< 60;i++){
            let nombre_actual = ""+result.properties[i].displayName;
            
          
            if(nombre_actual  === "AEC Secuencia Hormigonado"){
             

            
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


                gantt.parse({
                  data: [
                      { id: 1, text: result.name, start_date: d3, duration: 5, progress: 0.4, open: true },
                      { id: 2, text: "Inicio", start_date: d3, duration: 1, progress: 0.6, parent: 1 }
                  ],
                  links: [
                      {id: 1, source: 1, target: 2, type: "1"},
                      
                  ]
              });


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

          
          document.getElementById("propiedades_id").innerHTML += " AEC Secuencia Hormigonado <li><b>"+" :</b>"+fecha_hormigonado+" Estado: "+boton_fecha+"</li>";
          for(i=0 ;i< 15;i++){
            document.getElementById("propiedades_id").innerHTML += "<li><b>"+result.properties[i].displayName+" :</b>"+result.properties[i].displayValue+"</li>";
          }
          
          console.log("VALORES");
          console.log(result);
          
      }) 
      
     
    

    
       

       viewer.model.getBulkProperties(dbId, ['Name','Level','Area','Volume','Thickness'], (result) => {
          let test = result.filter(x => x.properties[0].displayValue !== '');
          let data = {};
          test.forEach(elements => {
                let name= elements.properties[0].displayValue;
                let level= elements.properties[1].displayValue;
                let struct= elements.properties[2].displayValue;
                let area= elements.properties[3].displayValue;
                let vol= elements.properties[4].displayValue;
            
           
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
  $("#ha_option").select2("val", "0");
  $("#piso_option").select2("val", "0");
  viewer.isolate();
  viewer.fitToView( viewer.model);
}


function buscaKeys(arr_objetivos,arr_listado){
  var resultado_busqueda;
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
function filtro_visual(){

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

  if(valor_fil2 !== "" && (valor_fil1 ==="" || valor_fil1=== 'sinvalor') ){ // piso

   let filt = ['AEC Piso'];

   var resultado_ids;
    consulta_filtro2(['AEC Piso']).then((data) => {
      let keys = Object.keys(data);
        
      console.log("keys & Data");
      console.log(keys[0]);
      console.log("//////////////////// data ////////////////");
     
      console.log(data);

      console.log("//////////////////// esta es  fin  ////////////////");
      console.log("tipo: "+ typeof valor_fil1 +"  valor "+ valor_fil1);
      let elementos = buscaKeys(filtros_selec_piso,keys)
      var identificadores =0;
      let dbIds =0;
      console.log("ESTOS SON LOS elementos");

     
      if(elementos.length == 0){
        alert("No hay resultados");
      }else{
        for(var a = 0; a<elementos.length;a++){
             if(a==0){
 
               console.log("valor de indice "+elementos[a]);
               dbIds = data[keys[elementos[a]]].dbIds; 
               console.log("Valor actual");
               console.log(data[keys[elementos[a]]].dbIds);
               referencia.push(dbIds);
               identificadores = dbIds;
             }
             else{
               console.log("valor de indice "+elementos[a]);
               referencia.push((data[keys[elementos[a]]].dbIds));
               identificadores = dbIds.concat(data[keys[elementos[a]]].dbIds);

               dbIds = identificadores;
             }
        }

        console.log("IDNENTIFICADORES FILTRADOS");
        console.log(referencia);
        resultado_ids = referencia;
       //resultado_ids =identificadores; 
       
       console.log("longitud  "+ referencia[0].length);
        console.log("Primer  "+ referencia);
      
       
       
      }
      console.log("////////////////*************************************************");
      console.log(resultado_ids);
      console.log("////////////////*************************************************");
      console.log(resultado_ids[0]);
      console.log("////////////////*************************************************");
      console.log(identificadores);
      console.log("identificadores");
      console.log(identificadores);
    
     
      viewer.isolate(identificadores);
      viewer.fitToView(identificadores, viewer.model);
    
      gantt.clearAll();
      gantt.init("gantt_here");
     
     
      gantt.attachEvent("onTaskClick", function(id, e) {
        console.log("You've just clicked an item with id="+id);
        console.log(typeof(id));
        viewer.isolate([ parseInt(id)]);
       // viewer.fitToView(parseInt(id), viewer.model);
        //viewer.setThemingColor(id,  red, viewer.model);
       // viewer.setThemingColor(1604, new THREE.Vector4(0, 1, 1,1));
    });
      let c =1;
      for(var a=0; a< resultado_ids[0].length;a++){
        let actual =  resultado_ids[0][a];
        viewer.getProperties( resultado_ids[0][a], (result) => { 
          let categorias = Array();
          for(i=0 ;i< 60;i++){
            let nombre_actual = ""+result.properties[i].displayName;
            if(nombre_actual ===""){

            }
            if(nombre_actual  === "AEC Secuencia Hormigonado"){
      
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
                  console.log("formato fecha "+d4);
                  console.log("formato fecha "+d3);
                  console.log("/////////////////");
                  // let compara = dates.compare(today,d2);
               
                  let resultado  = [result.name,d3];
                  //cabecera += "gantt.parse({";
                  //cabecera += " data: [";
                 // body = "";
               
                   console.log("valor de a: "+a);
                   
                   c++;
                   var taskId = gantt.addTask({
                      id:actual,
                      text:result.name,
                      start_date:d4,
                      duration:1
                  });
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
     
      console.log("ARREGLO RESULTADO GANTT");
      console.log(elem); 
      var z = JSON.stringify(elem);
      console.log(z); 
      console.log("cantidad  "+elem.length+"   ");
     
      gantt.config.columns = [
        {name: "text", tree: true, width: '*', resize: true, editor: textEditor},
        {name: "start_date", align: "center", resize: true, editor: dateEditor},
        {name: "duration", align: "center", editor: durationEditor},
        {name: "add", width: 44}
    ];
    });

    
  }
  if(( valor_fil2 !== "sinvalor") && (valor_fil1 !=="sinvalor" )){ // piso y particion ha

    let filt = ['AEC Piso','AEC Partición HA'];
     consulta_filtro2(['AEC Piso','AEC Partición HA']).then((data) => {
         let keys = Object.keys(data);
         console.log("keys & Data");
         console.log(keys[0]);
         console.log("//////////////////// data ////////////////");
         console.log(data);
         console.log("tipo: "+ typeof valor_fil1 +"  valor "+ valor_fil1);
         let elementos = buscaKeys(filtros_selec_ha,keys)
         var identificadores =0;
         let dbIds =0;
         if(elementos.length == 0){
           alert("No hay resultados");
         }else{
           for(var a = 0; a<elementos.length;a++){
                if(a==0){
                  console.log("valor de indice "+elementos[a]);
                  dbIds = data[keys[elementos[a]]].dbIds; 
                  identificadores = dbIds;
                }
                else{
                  console.log("valor de indice "+elementos[a]);
                  identificadores = dbIds.concat(data[keys[elementos[a]]].dbIds);
                  dbIds = identificadores;
                }
           }
          
          
         }
       
         viewer.isolate(identificadores);
         viewer.fitToView(identificadores, viewer.model);
    });
  }
  if(( valor_fil2=== 'sinvalor' || valor_fil2 === "") && valor_fil1 !==""){ // partición ha
     let filt = ['AEC Partición HA'];
     consulta_filtro2(['AEC Partición HA']).then((data) => {
         let keys = Object.keys(data);
        
         console.log("keys & Data");
         console.log(keys[0]);
         console.log("//////////////////// data ////////////////");
         console.log(data);
         console.log("tipo: "+ typeof valor_fil1 +"  valor "+ valor_fil1);
         let elementos = buscaKeys(filtros_selec_ha,keys)
         var identificadores =0;
         let dbIds =0;
         if(elementos.length == 0){
           alert("No hay resultados");
         }else{
           for(var a = 0; a<elementos.length;a++){
                if(a==0){
                  console.log("valor de indice "+elementos[a]);
                  dbIds = data[keys[elementos[a]]].dbIds; 
                  identificadores = dbIds;
                }
                else{
                  console.log("valor de indice "+elementos[a]);
                  identificadores = dbIds.concat(data[keys[elementos[a]]].dbIds);
                  dbIds = identificadores;
                }
           }
          
          
         }
       
         viewer.isolate(identificadores);
         viewer.fitToView(identificadores, viewer.model);
    });
  }
}





function genera_gantt(){

    let filt = ['AEC Piso'];
    consulta_filtro2(['AEC Piso']).then((data) => {
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
  var viewables = doc.getRoot().getDefaultGeometry();
  viewer.loadDocumentNode(doc, viewables).then(i => {
    // documented loaded, any action?
    viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, (e) => {
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