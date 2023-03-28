//PARA USOS
router.get('/proyectos', isLoggedIn, async (req, res, next) => {
    idUsua = req.session.idUsu;
   var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
    console.log(rows2[0].fullname);
    req.session.fullname = rows2[0].fullname;
    var nom = req.session.fullname;
    var consulta_vals = "";
    var data_uso ="";
    
  var rows2 = await pool.query('SELECT * FROM lineapuntos');
    console.log("LISTADO PUNTOS POLIGONO");
    let c = 0;
    var utmObj = require('utm-latlng');
    
  
    var utm=new utmObj();
    var contador_pares = 1;
    var inserciones = [];
    var contador_vueltas = 0;
    
    console.log("CANTIDAD DE POLIGONOS "+rows2.length);
    rows2.forEach(row => {
      //console.log("Elemento "+c);
      
      console.log(row.puntos_pol);
      let lista_act= row.puntos_pol;
      data_uso = data_uso+"=Predio ID: "+row.IDPREDIO+"/ID RODAL: "+row.IDRODAL+"/TIPO USO:"+row.TIPOUSO+"/USO ACTUAL:"+row.IDUSOACTUA+"/ AÑO Plantanción"+row.ANOPANTAC+"/"+"/SUP"+row.SUPERFICIE+"/SECCIÓN"+row.SECCION+"\n";
      var newarr = lista_act.split(",");
      console.log( 'Nuevo aar');
      console.log( newarr);
       
      consulta_vals = "#";
       for(var a =0; a<newarr.length;a=a+2){
          console.log("INICIOLECTURA");
      //  if(newarr[a] !== "" && newarr[a+1] !=" "){
           console.log("LAT " +newarr[a+1]+"  lg :"+newarr[a]);
           if(newarr[a+1] != "" && newarr[a+1] != undefined){
              let s =  utm.convertLatLngToUtm(newarr[a+1], newarr[a],5);
              console.log("LAT TO UTM");
              console.log(s.Easting);
              console.log(s.Northing);
              if(s.Easting != NaN && s.Easting != "NaN"){
              consulta_vals = consulta_vals+s.Easting+"/"+s.Northing;
              consulta_vals = consulta_vals+"#";
              }
           }
           
          
        //  if(consulta_vals.length>6){
        //    console.log(consulta_vals);
        //  }
        
        }
     // }
     inserciones.push(consulta_vals);
      c++;
  });
  console.log("RESULTADO INSERCIONES");
   console.log(inserciones);
   console.log("CANTIDAD ELEMENTOS");
   console.log(inserciones.length);
   var resultado_poligonos ="";
  for(var i = 0; i<inserciones.length;i++){
  resultado_poligonos= resultado_poligonos+inserciones[i]+"$";
  console.log("Linea numero "+i);
  console.log(inserciones[i]);
   
  
  }
  
  //-33.45008365948, -70.66429779660
  //-37.373838699156, -73.463709509738
  var test = utm.convertLatLngToUtm( -33.45008365948,-70.66429779660,8);
    console.log("RESULTADO PRUEBA 12&/12 .. "+test.Easting+"  "+test.Northing);
    
  fs.writeFile('resultado.txt', resultado_poligonos, function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
  fs.writeFile('usos.txt', data_uso, function (err) {
    if (err) throw err;
    console.log('Saved2!');
  });
   // split([separator][, limit]);
   // var utmObj = require('utm-latlng');
   // var utm=new utmObj(); //Default Ellipsoid is 'WGS 84'
    
    
   
   
        //Camino_80097
  
        
    if (req.session.tipoUsuario == "Administrador") {
      res.render('proyectos', { nom });
    }
    if (req.session.tipoUsuario == "Usuario") {
      res.render('proyectosV2', { nom });
    }
  })

  //PARA CAMINOS

  router.get('/proyectos', isLoggedIn, async (req, res, next) => {
    idUsua = req.session.idUsu;
   var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
    console.log(rows2[0].fullname);
    req.session.fullname = rows2[0].fullname;
    var nom = req.session.fullname;
    var consulta_vals = "";
    var data_uso ="";
    
  //var rows2 = await pool.query('SELECT * FROM lineapuntos');
  var rows2 = await pool.query('SELECT * FROM canchapuntos'); 
  
  console.log("LISTADO PUNTOS POLIGONO");
    let c = 0;
    var utmObj = require('utm-latlng');
    
  
    var utm=new utmObj();
    var contador_pares = 1;
    var inserciones = [];
    var contador_vueltas = 0;
    
    console.log("CANTIDAD DE POLIGONOS "+rows2.length);
    rows2.forEach(row => {
      //console.log("Elemento "+c);
      
      console.log(row.puntos_pol);
      let lista_act= row.puntos_pol;
    //  data_uso = data_uso+"=Predio ID: "+row.IDPREDIO+"/ID RODAL: "+row.IDRODAL+"/TIPO USO:"+row.TIPOUSO+"/USO ACTUAL:"+row.IDUSOACTUA+"/ AÑO Plantanción"+row.ANOPANTAC+"/"+"/SUP"+row.SUPERFICIE+"/SECCIÓN"+row.SECCION+"\n";
      var newarr = lista_act.split(",");
      console.log( 'Nuevo aar');
      console.log( newarr);
       
      consulta_vals = "#";
       for(var a =0; a<newarr.length;a=a+2){
          console.log("INICIOLECTURA");
      //  if(newarr[a] !== "" && newarr[a+1] !=" "){
           console.log("LAT " +newarr[a+1]+"  lg :"+newarr[a]);
           if(newarr[a+1] != "" && newarr[a+1] != undefined){
              let s =  utm.convertLatLngToUtm(newarr[a+1], newarr[a],5);
              console.log("LAT TO UTM");
              console.log(s.Easting);
              console.log(s.Northing);
              if(s.Easting != NaN && s.Easting != "NaN"){
              consulta_vals = consulta_vals+s.Easting+"/"+s.Northing;
              consulta_vals = consulta_vals+"#";
              }
           }
           
          
        //  if(consulta_vals.length>6){
        //    console.log(consulta_vals);
        //  }
        
        }
     // }
     inserciones.push(consulta_vals);
      c++;
  });
  console.log("RESULTADO INSERCIONES");
   console.log(inserciones);
   console.log("CANTIDAD ELEMENTOS");
   console.log(inserciones.length);
   var resultado_poligonos ="";
  for(var i = 0; i<inserciones.length;i++){
  resultado_poligonos= resultado_poligonos+inserciones[i]+"$";
  console.log("Linea numero "+i);
  console.log(inserciones[i]);
   
  
  }
  
  //-33.45008365948, -70.66429779660
  //-37.373838699156, -73.463709509738
  var test = utm.convertLatLngToUtm( -33.45008365948,-70.66429779660,8);
    console.log("RESULTADO PRUEBA 12&/12 .. "+test.Easting+"  "+test.Northing);
    
  fs.writeFile('resultado.txt', resultado_poligonos, function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
  
  /*
  fs.writeFile('usos.txt', data_uso, function (err) {
    if (err) throw err;
    console.log('Saved2!');
  });*/
   // split([separator][, limit]);
   // var utmObj = require('utm-latlng');
   // var utm=new utmObj(); //Default Ellipsoid is 'WGS 84'
    
    
   
   
        //Camino_80097
  
        
    if (req.session.tipoUsuario == "Administrador") {
      res.render('proyectos', { nom });
    }
    if (req.session.tipoUsuario == "Usuario") {
      res.render('proyectosV2', { nom });
    }
  })
