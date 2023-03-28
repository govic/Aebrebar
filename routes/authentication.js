const express = require('express');
const router = express.Router();
const pool = require('../public/js/DBConnection');
//const passport = require('../public/js/passport');
const { isLoggedIn, isNotLoggedIn } = require('../routes/auth');
const { redirect } = require('server/reply');
const helpers = require('../public/lib/helpers');
const swall = require('sweetalert');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var fs = require('fs');

//signin
router.get('/signin', isNotLoggedIn, (req, res, next) => {
  res.render('signin', { message: req.flash('message') });
})

/*router.post('/signin',  passport.authenticate('local.signin', {

    successRedirect: '/index',
    failureRedirect: '/signin'

  })
);
*/
router.post(
  '/signin',
  passport.authenticate('local.signin', {
    failureRedirect: '/signin',
    failureFlash: true
  }),  async (req, res) => {
    if (req.session.tipoUsuario == "Administrador") {
      var nom = req.session.fullname;
      res.render('proyectos', { nom });
    }
    if (req.session.tipoUsuario == "Usuario") {
      var nom = req.session.fullname;
      res.render('indexV2', { nom });
    }
  });

  
passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  var rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  if (rows.length > 0) {
    const user = rows[0];
    const validPassword = await helpers.matchPassword(password, user.password)

    if (validPassword) {
      done(null, user, req.session.tipoUsuario = rows[0].tipoUsuario, req.session.fullname = rows[0].fullname, req.session.username = rows[0].username, req.session.idUsu = rows[0].idUsu);
    } else {
      done(null, false, console.log("Contraseña inválida"), req.flash('message', 'Contraseña incorrecta.'));
    }
  } else {
    return done(null, false, console.log("usuario no existe"), req.flash('message', 'Usuario no existe.'));
  }
}));

//serialize user
passport.serializeUser((user, done) => {
  done(null, user.idUsu);

});

passport.deserializeUser(async (id, done) => {
  const rows = await pool.query('SELECT * FROM users WHERE idUsu = ?', [id]);
  done(null, rows[0]);

});

//botón editar del formulario editar2
router.post('/editar2/:idUsu', isLoggedIn, async (req, res) => {
  idUsua = req.session.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.fullname = rows2[0].fullname;
  var nom = req.session.fullname;
  if (req.session.tipoUsuario == "Administrador") {
    const { idUsu } = req.params;
    const data = await pool.query('SELECT * FROM users WHERE idUsu= ?', [idUsu]);
    const { fullname, username, password, tipoUsuario } = req.body;

    if (password == "") {
      if (tipoUsuario == "") {
        const newUser = {
          fullname,
          username
        };
        await pool.query('UPDATE users set ? WHERE idUsu = ?', [newUser, idUsu], async (error, results) => {
          if (error) {
            console.log(error);
          } else {

            res.render('editar2', {
              alert: true,
              alertTitle: "¡Correcto!",
              alertMessage: "¡Usuario editado exitosamente!",
              alertIcon: 'success',
              showConfirmButton: false,
              ruta: 'edit',
              data: data[0],
              nom
            })
          }
        });
        console.log("full y user");
        console.log(newUser);
      }

      if (tipoUsuario != "") {
        const newUser = {
          fullname,
          username,
          tipoUsuario
        };
        await pool.query('UPDATE users set ? WHERE idUsu = ?', [newUser, idUsu], async (error, results) => {
          if (error) {
            console.log(error);
          } else {

            res.render('editar2', {
              alert: true,
              alertTitle: "¡Correcto!",
              alertMessage: "¡Usuario editado exitosamente!",
              alertIcon: 'success',
              showConfirmButton: false,
              ruta: 'edit',
              data: data[0],
              nom
            })
          }
        });
        console.log("full y user");
        console.log(newUser);
      }
    }
    if (password != "") {
      if (tipoUsuario == "") {

        const newUser = {
          fullname,
          username,
          password
        };
        newUser.password = await helpers.encryptPassword(password);
        await pool.query('UPDATE users set ? WHERE idUsu = ?', [newUser, idUsu], async (error, results) => {
          if (error) {
            console.log(error);
          } else {

            res.render('editar2', {
              alert: true,
              alertTitle: "¡Correcto!",
              alertMessage: "¡Usuario editado exitosamente!",
              alertIcon: 'success',
              showConfirmButton: false,
              ruta: 'edit',
              data: data[0],
              nom
            })
          }
        });
        console.log("full, user y contra");
        console.log(newUser);
      }
      if (tipoUsuario != "") {

        const newUser = {
          fullname,
          username,
          password,
          tipoUsuario
        };
        newUser.password = await helpers.encryptPassword(password);
        await pool.query('UPDATE users set ? WHERE idUsu = ?', [newUser, idUsu], async (error, results) => {
          if (error) {
            console.log(error);
          } else {

            res.render('editar2', {
              alert: true,
              alertTitle: "¡Correcto!",
              alertMessage: "¡Usuario editado exitosamente!",
              alertIcon: 'success',
              showConfirmButton: false,
              ruta: 'edit',
              data: data[0],
              nom
            })
          }
        });
        console.log("full, user y contra");
        console.log(newUser);

      }
    }
  }
  if (req.session.tipoUsuario == "Usuario") {
    res.render('indexV2', { nom });
  }
});
//editar2
router.get('/edit/:idUsu', isLoggedIn, async (req, res) => {
  idUsua = req.session.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.fullname = rows2[0].fullname;
  var nom = req.session.fullname;
  if (req.session.tipoUsuario == "Administrador") {
    const { idUsu } = req.params;
    const data = await pool.query('SELECT * FROM users WHERE idUsu= ?', [idUsu]);
    res.render('editar2', { data: data[0], nom });
  }
  if (req.session.tipoUsuario == "Usuario") {
    res.render('indexV2', { nom });
  }
});
//edit
router.get('/edit', isLoggedIn, async (req, res) => {
  idUsua = req.session.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.fullname = rows2[0].fullname;
  var nom = req.session.fullname;
  if (req.session.tipoUsuario == "Administrador") {
    const data = await pool.query('SELECT * FROM users');
    res.render('edit', { data, nom });

  } if (req.session.tipoUsuario == "Usuario") {
    res.render('indexV2', { nom });
  }
})


//delete
router.get('/delete', isLoggedIn, async (req, res) => {
  idUsua = req.session.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.fullname = rows2[0].fullname;
  var nom = req.session.fullname;
  if (req.session.tipoUsuario == "Administrador") {
    const data = await pool.query('SELECT * FROM users');

    res.render('delete', { data, nom });

  } if (req.session.tipoUsuario == "Usuario") {
    res.render('indexV2', { nom });
  }
})

router.get('/delete2/:idUsu', isLoggedIn, async (req, res) => {
  idUsua = req.session.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.fullname = rows2[0].fullname;
  var nom = req.session.fullname;
  if (req.session.tipoUsuario == "Administrador") {
    const { idUsu } = req.params;
    await pool.query('DELETE FROM users WHERE idUsu = ?', [idUsu]);
    res.redirect('/delete');
  } if (req.session.tipoUsuario == "Usuario") {
    res.render('indexV2', { nom });
  }
});

router.get('/deleteVista/:idVS', isLoggedIn, async (req, res) => {
  idUsua = req.session.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.fullname = rows2[0].fullname;
  var nom = req.session.fullname;
  if (req.session.tipoUsuario == "Administrador") {
    const { idVS } = req.params;
    await pool.query('DELETE FROM vistas_save WHERE idVS = ?', [idVS]);
    res.redirect('/index');
  } if (req.session.tipoUsuario == "Usuario") {
    res.render('index', { nom });
  }
});

router.get('/delete/:idUsu', isLoggedIn, async (req, res) => {
  idUsua = req.session.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.fullname = rows2[0].fullname;
  var nom = req.session.fullname;
  if (req.session.tipoUsuario == "Administrador") {
    const { idUsu } = req.params;
    const data = await pool.query('SELECT * FROM users');
    console.log("En proceso de eliminar1");
    const data2 = await pool.query('SELECT * FROM users', async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        const idv1 = idUsu;
        res.render('delete', {
          alert: true,
          alertTitle: "¿Está seguro?",
          alertMessage: "¡Una vez eliminado, no podrá recuperar este archivo!",
          alertIcon: 'warning',
          data,
          idv1,
          nom
        })
      }
    });

  } if (req.session.tipoUsuario == "Usuario") {
    res.render('indexV2', { nom });
  }
});

// SIGNUP
router.get('/signup', isLoggedIn, async (req, res) => {
  idUsua = req.session.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.fullname = rows2[0].fullname;
  var nom = req.session.fullname;
  if (req.session.tipoUsuario == "Administrador") {
    console.log("pasó por la authen")
    const data = await pool.query('SELECT * FROM users');
    res.render('signup', { data, nom });

  } if (req.session.tipoUsuario == "Usuario") {
    res.redirect('indexV2');
  }
});

router.post('/signup', isLoggedIn, async (req, res) => {
  idUsua = req.session.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.fullname = rows2[0].fullname;
  var nom = req.session.fullname;
  if (req.session.tipoUsuario == "Administrador") {
    const { fullname, username, password, tipoUsuario } = req.body;
    const newUser = {
      fullname,
      username,
      password,
      tipoUsuario
    };
    newUser.password = await helpers.encryptPassword(password);
    const data = await pool.query('SELECT * FROM users');
    await pool.query('INSERT INTO users set ?', [newUser], async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.render('signup', {
          alert: true,
          alertTitle: "¡Correcto!",
          alertMessage: "¡Usuario agregado exitosamente!",
          alertIcon: 'success',
          showConfirmButton: false,
          ruta: 'signup',
          data,
          nom
        })
      }
    });
    console.log("insertó");
    // res.redirect('signup');
  } if (req.session.tipoUsuario == "Usuario") {
    res.render('indexV2', { nom });
  }
});
router.get('/prueba', isLoggedIn, async (req, res, next) => {
  idUsua = req.session.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.fullname = rows2[0].fullname;
  var nom = req.session.fullname;
  //guardo los datos de la tabla en datavista
    const datavista = await pool.query('SELECT * FROM vistas_save');
  if (req.session.tipoUsuario == "Administrador") {
    res.send( datavista );
    console.log( datavista );
  }

});


router.get('/listaProyecto', isLoggedIn, async (req, res, next) => {
  idUsua = req.session.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.fullname = rows2[0].fullname;
  var nom = req.session.fullname;
  //guardo los datos de la tabla en datavista
    const datavista = await pool.query('SELECT * FROM modelo');
  if (req.session.tipoUsuario == "Administrador") {
    res.send( datavista );
    console.log( datavista );
  }

});

router.get('/listaDBIDS', isLoggedIn, async (req, res, next) => {
  idUsua = req.session.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
 // console.log(rows2[0].fullname);
  req.session.fullname = rows2[0].fullname;
  var nom = req.session.fullname;
  //guardo los datos de la tabla en datavista
  const { nombre, ids } = req.body;
    const datavista = await pool.query('SELECT * FROM plan');
  if (req.session.tipoUsuario == "Administrador") {
    res.send( datavista );
   // console.log( "GET IDS PLAN" );
   // console.log( datavista );
  }

});


router.get('/listaDBIDSPlan', isLoggedIn, async (req, res, next) => {
  idUsua = req.session.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
 // console.log(rows2[0].fullname);
  req.session.fullname = rows2[0].fullname;
  var nom = req.session.fullname;
  //guardo los datos de la tabla en datavista
  const { nombre, ids } = req.body;
    const datavista = await pool.query('SELECT * FROM plan WHERE fecha_plan != "" ');
  if (req.session.tipoUsuario == "Administrador") {
    res.send( datavista );
   // console.log( "GET IDS PLAN" );
   // console.log( datavista );
  }

});
router.post('/insertDBIDS', isLoggedIn, async (req, res, next) => {
 



  //guardo los datos de la tabla en datavista
  const { fecha_plan, fecha_base, dbId } = req.body;
  
  const insertPlan = { dbId,fecha_plan,fecha_base};
 

  await pool.query('INSERT INTO  plan set ?', [insertPlan], async (error, results) => {
    if (error) {
      console.log(error);
    } else {
        console.log("Inserción Exitosa")
    }
  });

});


router.post('/updateDBIDS', isLoggedIn, async (req, res, next) => {
  idUsua = req.session.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);



  //guardo los datos de la tabla en datavista
  
  const { fecha_plan, fecha_base, dbId } = req.body;
  let i = parseInt(''+dbId,0);
 
  const updatePlan = { fecha_plan,fecha_base};
  console.log('ENVIO UPDATE');
  console.log(req.body);
  if (req.session.tipoUsuario == "Administrador") {
    await pool.query('UPDATE plan set ? WHERE dbId = ?', [updatePlan, i], async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log( "update exitoso" );
        
      }
    });
    res.send( datavista );
    
    console.log( datavista );
  }

});


//guardar generico
router.post('/prueba', isLoggedIn, async (req, res) => {
  console.log("Entro en el guardar1")
  //esto es para el nombre e iniciales
  console.log(req.body);
  //aquí traigo el id de la sesión activa
  console.log("REQ")
  idUsua = req.session.idUsu;
  //aquí traigo al usuario el cual tiene la id que traje
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  //asigno
  console.log(rows2[0].fullname);
  req.session.fullname = rows2[0].fullname;
  req.session.username = rows2[0].username;
  var nom = req.session.fullname;
  var nom2 = req.session.username;
//id de la sesión
  const idUsu = req.session.idUsu;

  //ahora empieza la función
  if (req.session.tipoUsuario == "Administrador") {
    const datavista = await pool.query('SELECT * FROM vistas_save');

    //aquí le paso los datos de los inputs (Los capto a través del "name")
    const { nombre, ids } = req.body;
    console.log("body");
    console.log(req.body);
    console.log(req.body.nombre);
      //entonces en la variable newDatos pongo los datos a insertar
        const newDatos = {
          nombre,
          ids
        };
        // aquí le digo que cambie la tabla usuario con los datos del nuevo usuario que tiene la id de isUsu, o sea la de la sesión
        await pool.query('INSERT vistas_save set ?', [newDatos], async (error, results) => {
          if (error) {
            console.log(error);
          }
          //si todo sale bien muestra el siguiente mensaje pasandole las variables para las iniciales  
          else {
            
            res.render('prueba', {
              datavista,
              alert: true,
              alertTitle: "¡Correcto!",
              alertMessage: "¡Datos correctamente agregados!",
              alertIcon: 'success',
              showConfirmButton: false,
              ruta: 'prueba',
              nom,
              nom2
              
            })
          }
        });
        console.log("nom: "+ nom);
        console.log("nom2: "+ nom2);
        console.log("datos: "+newDatos);


  }
});

//guardar modelo activo
router.post('/vista', isLoggedIn, async (req, res) => {
  console.log("Entro en el guardar22222")
  //esto es para el nombre e iniciales
  console.log(req.body);
  //aquí traigo el id de la sesión activa
  console.log("REQ")
  idUsua = req.session.idUsu;
  //aquí traigo al usuario el cual tiene la id que traje
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  //asigno
  console.log(rows2[0].fullname);
  req.session.fullname = rows2[0].fullname;
  req.session.username = rows2[0].username;
  var nom = req.session.fullname;
  var nom2 = req.session.username;
//id de la sesión
  const idUsu = req.session.idUsu;

  //ahora empieza la función
  if (req.session.tipoUsuario == "Administrador") {
    const datavista = await pool.query('SELECT * FROM modelo');

    //aquí le paso los datos de los inputs (Los capto a través del "name")
    const { nombre, ids } = req.body;
    console.log("body");
    console.log(req.body);
    console.log(req.body.nombre);
      //entonces en la variable newDatos pongo los datos a insertar
        const newDatos = {
          nombre
        };
        // aquí le digo que cambie la tabla usuario con los datos del nuevo usuario que tiene la id de isUsu, o sea la de la sesión
        await pool.query('UPDATE modelo  set ? WHERE id = ?', [newDatos,1], async (error, results) => {
          if (error) {
            console.log(error);
          }
          //si todo sale bien muestra el siguiente mensaje pasandole las variables para las iniciales  
          else {
            
            res.render('prueba', {
              datavista,
              alert: true,
              alertTitle: "¡Correcto!",
              alertMessage: "¡Datos correctamente agregados!",
              alertIcon: 'success',
              showConfirmButton: false,
              ruta: 'prueba',
              nom,
              nom2
              
            })
          }
        });
        console.log("nom: "+ nom);
        console.log("nom2: "+ nom2);
        console.log("datos: "+newDatos);


  }
});
/*router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '#',
  failureRedirect: '/signup',
  failureFlash: true
}));*/

//modals
/*router.get('/modals', (req, res, next) => {
  if (req.session.tipoUsuario == "Administrador") {
  res.render('modals');
}
if (req.session.tipoUsuario == "Usuario") {
 res.render('modalsV2');
}})*/

//--
//index
router.get('/index2', isLoggedIn, async (req, res, next) => {
  idUsua = req.session.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.fullname = rows2[0].fullname;
  var nom = req.session.fullname;
      var nom2 = req.session.username;

  var rows3 = await pool.query('SELECT * FROM filtros WHERE id = ?', [1]);
   const  filtro_1 = rows3[0].filtro_1;
   const  filtro_2 = rows3[0].filtro_2;
 
   const rows4 = await pool.query('SELECT * FROM gantt', [idUsua]);
   const categoria_01 = rows4[0].categoria_01;
   const categoria_02 = rows4[0].categoria_02;
   const categoria_03= rows4[0].categoria_03;
   const categoria_04 = rows4[0].categoria_04;
   const parametro_nivel = rows4[0].parametro_nivel;
   const parametro_fecha  =  rows4[0].parametro_fecha;
  if (req.session.tipoUsuario == "Administrador") {

    res.render('index2',  {
      alert: true,
      alertTitle: "¡Correcto!",
      alertMessage: "¡Datos correctamente editados!",
      alertIcon: 'success',
      showConfirmButton: false,
      ruta: 'index2',
      nom,
      nom2,
      idUsua,filtro_1,filtro_2,categoria_01,categoria_02,categoria_03,categoria_04,parametro_nivel,parametro_fecha
    });
  }
  if (req.session.tipoUsuario == "Usuario") {
    res.render('index2', { nom,filtro_1 });
  }
})


//index
router.get('/index', isLoggedIn, async (req, res, next) => {
  idUsua = req.session.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.fullname = rows2[0].fullname;
  var nom = req.session.fullname;
      var nom2 = req.session.username;

  var rows3 = await pool.query('SELECT * FROM filtros WHERE id = ?', [1]);
   const  filtro_1 = rows3[0].filtro_1;
   const  filtro_2 = rows3[0].filtro_2;
 
   const rows4 = await pool.query('SELECT * FROM gantt', [idUsua]);
   const categoria_01 = rows4[0].categoria_01;
   const categoria_02 = rows4[0].categoria_02;
   const categoria_03= rows4[0].categoria_03;
   const categoria_04 = rows4[0].categoria_04;
   const parametro_nivel = rows4[0].parametro_nivel;
   const parametro_fecha  =  rows4[0].parametro_fecha;
  if (req.session.tipoUsuario == "Administrador") {

    res.render('index',  {
      alert: true,
      alertTitle: "¡Correcto!",
      alertMessage: "¡Datos correctamente editados!",
      alertIcon: 'success',
      showConfirmButton: false,
      ruta: 'index',
      nom,
      nom2,
      idUsua,filtro_1,filtro_2,categoria_01,categoria_02,categoria_03,categoria_04,parametro_nivel,parametro_fecha
    });
  }
  if (req.session.tipoUsuario == "Usuario") {
    res.render('indexV2', { nom,filtro_1 });
  }
})


//indexV2
router.get('/indexV2', isLoggedIn, async (req, res, next) => {
  idUsua = req.session.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.fullname = rows2[0].fullname;
  var nom = req.session.fullname;
  if (req.session.tipoUsuario == "Administrador") {
    res.render('index', { nom });
  }
  if (req.session.tipoUsuario == "Usuario") {
    res.render('indexV2', { nom });
  }
})

router.get('/config', isLoggedIn, async (req, res, next) => {
  idUsua = req.session.idUsu;
  const rows2 = await pool.query('SELECT * FROM gantt', [idUsua]);
  console.log(rows2[0].categoria_01);

  const categoria_01 = rows2[0].categoria_01;
  const categoria_02 = rows2[0].categoria_02;
  const categoria_03= rows2[0].categoria_03;
  const categoria_04 = rows2[0].categoria_04;
  const parametro_nivel = rows2[0].parametro_nivel;
  const parametro_fecha  =  rows2[0].parametro_fecha;


  var nom = req.session.fullname;

  var rows3 = await pool.query('SELECT * FROM filtros', [idUsua]);
  const filtro_1 = rows3[0].filtro_1;
  const filtro_2 = rows3[0].filtro_2;

  const idUsu = req.session.idUsu;
  if (req.session.tipoUsuario == "Administrador") {
    res.render('config', { nom,  idUsu,filtro_1,filtro_2,categoria_01,categoria_02,categoria_03,categoria_04,parametro_nivel,parametro_fecha });
  }
  if (req.session.tipoUsuario == "Usuario") {
    res.render('config',{ nom,  idUsu,categoria_01,categoria_02,categoria_03,categoria_04,parametro_nivel,parametro_fecha,filtro_1,filtro_2 });
    console.log(idUsu);
  }
})



router.post('/filtro', isLoggedIn, async (req, res) => {
  const categorias = { filtro_v1,filtro_v2} = req.body;
  await pool.query('UPDATE filtros set ? WHERE id = ?', [categorias, 1], async (error, results) => {
    if (error) {
      console.log(error);
    } else {
      idUsua = req.session.idUsu;
      const rows2 = await pool.query('SELECT * FROM gantt', [idUsua]);
      console.log(rows2[0].categoria_01);
      const filtro_v1 ="";
      const filtro_v2 ="";


      const categoria_01 = rows2[0].categoria_01;
      const categoria_02 = rows2[0].categoria_02;
      const categoria_03= rows2[0].categoria_03;
      const categoria_04 = rows2[0].categoria_04;
      const parametro_nivel = rows2[0].parametro_nivel;
      const parametro_fecha  =  rows2[0].parametro_fecha;


      var nom = req.session.fullname;
      var nom2 = req.session.username;

      var rows3 = await pool.query('SELECT * FROM filtros', [idUsua]);
      const filtro_1 = rows3[0].filtro_1;
      const filtro_2 = rows3[0].filtro_2;

      
      const idUsu = req.session.idUsu;
      if (req.session.tipoUsuario == "Administrador") {
        res.render('config', {
          alert: true,
          alertTitle: "¡Correcto!",
          alertMessage: "¡Datos correctamente editados!",
          alertIcon: 'success',
          showConfirmButton: false,
          ruta: 'config',
          nom,
          nom2,
          idUsu,filtro_1,filtro_2,categoria_01,categoria_02,categoria_03,categoria_04,parametro_nivel,parametro_fecha
        })
      }
      if (req.session.tipoUsuario == "Usuario") {
        res.render('config', {
          alert: true,
          alertTitle: "¡Correcto!",
          alertMessage: "¡Datos correctamente editados!",
          alertIcon: 'success',
          showConfirmButton: false,
          ruta: 'config',
          nom,
          nom2,
          idUsu,filtro_1,filtro_2,categoria_01,categoria_02,categoria_03,categoria_04,parametro_nivel,parametro_fecha
        })
        console.log(idUsu);
      }
     
    }
  });
})

router.post('/parametro_fecha', isLoggedIn, async (req, res) => {
  const categorias = { parametro_fecha} = req.body;
  await pool.query('UPDATE gantt set ? WHERE id = ?', [categorias, 1], async (error, results) => {
    if (error) {
      console.log(error);
    } else {
      idUsua = req.session.idUsu;
      const rows2 = await pool.query('SELECT * FROM gantt', [idUsua]);
      console.log(rows2[0].categoria_01);
      const  filtro_1 = rows2[0].filtro_1;
      const  filtro_2 = rows2[0].filtro_2;


      const categoria_01 = rows2[0].categoria_01;
      const categoria_02 = rows2[0].categoria_02;
      const categoria_03= rows2[0].categoria_03;
      const categoria_04 = rows2[0].categoria_04;
      const parametro_nivel = rows2[0].parametro_nivel;
      const parametro_fecha  =  rows2[0].parametro_fecha;


      var nom = req.session.fullname;
      var nom2 = req.session.username;

      const idUsu = req.session.idUsu;
      if (req.session.tipoUsuario == "Administrador") {
        res.render('config', {
          alert: true,
          alertTitle: "¡Correcto!",
          alertMessage: "¡Datos correctamente editados!",
          alertIcon: 'success',
          showConfirmButton: false,
          ruta: 'config',
          nom,
          nom2,
          idUsu,filtro_1,filtro_2,categoria_01,categoria_02,categoria_03,categoria_04,parametro_nivel,parametro_fecha
        })
      }
      if (req.session.tipoUsuario == "Usuario") {
        res.render('config', {
          alert: true,
          alertTitle: "¡Correcto!",
          alertMessage: "¡Datos correctamente editados!",
          alertIcon: 'success',
          showConfirmButton: false,
          ruta: 'config',
          nom,
          nom2,
          idUsu,filtro_1,filtro_2,categoria_01,categoria_02,categoria_03,categoria_04,parametro_nivel,parametro_fecha
        })
        console.log(idUsu);
      }
     
    }
  });
})

router.post('/parametro_niveles', isLoggedIn, async (req, res) => {
  const categorias = { parametro_nivel} = req.body;
  await pool.query('UPDATE gantt set ? WHERE id = ?', [categorias, 1], async (error, results) => {
    if (error) {
      console.log(error);
    } else {
      idUsua = req.session.idUsu;
      const rows2 = await pool.query('SELECT * FROM gantt', [idUsua]);
      console.log(rows2[0].categoria_01);
      const  filtro_1 = rows2[0].filtro_1;
      const  filtro_2 = rows2[0].filtro_2;


      const categoria_01 = rows2[0].categoria_01;
      const categoria_02 = rows2[0].categoria_02;
      const categoria_03= rows2[0].categoria_03;
      const categoria_04 = rows2[0].categoria_04;
      const parametro_nivel = rows2[0].parametro_nivel;
      const parametro_fecha  =  rows2[0].parametro_fecha;


      var nom = req.session.fullname;
      var nom2 = req.session.username;

      const idUsu = req.session.idUsu;
      if (req.session.tipoUsuario == "Administrador") {
        res.render('config', {
          alert: true,
          alertTitle: "¡Correcto!",
          alertMessage: "¡Datos correctamente editados!",
          alertIcon: 'success',
          showConfirmButton: false,
          ruta: 'config',
          nom,
          nom2,
          idUsu,filtro_1,filtro_2,categoria_01,categoria_02,categoria_03,categoria_04,parametro_nivel,parametro_fecha
        })
      }
      if (req.session.tipoUsuario == "Usuario") {
        res.render('config', {
          alert: true,
          alertTitle: "¡Correcto!",
          alertMessage: "¡Datos correctamente editados!",
          alertIcon: 'success',
          showConfirmButton: false,
          ruta: 'config',
          nom,
          nom2,
          idUsu,filtro_v1,filtro_v2,categoria_01,categoria_02,categoria_03,categoria_04,parametro_nivel,parametro_fecha
        })
        console.log(idUsu);
      }
     
    }
  });
})


router.post('/categorias', isLoggedIn, async (req, res) => {
  const categorias = { categoria_01, categoria_02, categoria_03, categoria_04 } = req.body;
  await pool.query('UPDATE gantt set ? WHERE id = ?', [categorias, 1], async (error, results) => {
    if (error) {
      console.log(error);
    } else {
      idUsua = req.session.idUsu;
      const rows2 = await pool.query('SELECT * FROM gantt', [idUsua]);
      console.log(rows2[0].categoria_01);
      const  filtro_1 = rows2[0].filtro_1;
      const  filtro_2 = rows2[0].filtro_2;

      const categoria_01 = rows2[0].categoria_01;
      const categoria_02 = rows2[0].categoria_02;
      const categoria_03= rows2[0].categoria_03;
      const categoria_04 = rows2[0].categoria_04;
      const parametro_nivel = rows2[0].parametro_nivel;
      const parametro_fecha  =  rows2[0].parametro_fecha;


      var nom = req.session.fullname;
      var nom2 = req.session.username;

      const idUsu = req.session.idUsu;
      if (req.session.tipoUsuario == "Administrador") {
        res.render('config', {
          alert: true,
          alertTitle: "¡Correcto!",
          alertMessage: "¡Datos correctamente editados!",
          alertIcon: 'success',
          showConfirmButton: false,
          ruta: 'config',
          nom,
          nom2,
          idUsu,filtro_1,filtro_2,categoria_01,categoria_02,categoria_03,categoria_04,parametro_nivel,parametro_fecha
        })
      }
      if (req.session.tipoUsuario == "Usuario") {
        res.render('config', {
          alert: true,
          alertTitle: "¡Correcto!",
          alertMessage: "¡Datos correctamente editados!",
          alertIcon: 'success',
          showConfirmButton: false,
          ruta: 'config',
          nom,
          nom2,
          idUsu,filtro_v1,filtro_v2,categoria_01,categoria_02,categoria_03,categoria_04,parametro_nivel,parametro_fecha
        })
        console.log(idUsu);
      }
     
    }
  });
})

/**GUARDAR FECHAS */
router.post('/saveDates', isLoggedIn, async (req, res) => {
  const { nombre, ids } = req.body;
  const newSelect = {
    nombre,
    ids
  };
  newUser.password = await helpers.encryptPassword(password);

  await pool.query('INSERT INTO  plan set ?', [newUser], async (error, results) => {
    if (error) {
      console.log(error);
    } else {
      res.render('signup', {
        alert: true,
        alertTitle: "¡Correcto!",
        alertMessage: "¡Usuario agregado exitosamente!",
        alertIcon: 'success',
        showConfirmButton: false,
        ruta: 'signup',
        data,
        nom
      })
    }
  });
})


//*******GUARDAR IDS ORDENES *///
router.post('/saveOrdenes', isLoggedIn, async (req, res) => {
  const {  ids,nombre_pedido,fecha,pesos,largos,listado_largos,listado_pesos,urn_actual } = req.body;
  const newSelect = {
    fecha,
    ids,
    pesos,
    largos,
    listado_largos,
    listado_pesos,
    nombre_pedido,
    urn_actual
  };

  /////********GUARDAR PISO 1 */////
  
  //newUser.password = await helpers.encryptPassword(password);

  await pool.query('INSERT INTO  pedido set ?', [newSelect], async (error, results) => {
    if (error) {
      console.log(error);
    } else {
      console.log("gUARDADO EL PEDIDO");
      console.log(newSelect);

    }
  });
})

//*******peso nivel 1*************************** */
router.post('/peso_nivel_1', isLoggedIn, async (req, res) => {
  const categorias = { uno} = req.body;
  console.log("VALOR PESO 1 "+req.body);
  await pool.query('UPDATE pesos_nivel set ? WHERE id = ?', [categorias, 1], async (error, results) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Registro peso nivel 1 Exitoso "+categorias.pesos_nivel );
    }
  });
})


//***************************************************** */

router.post('/saveAddOrdenes', isLoggedIn, async (req, res) => {
  const {  nombre_pedido,cantidad,diametro,largo } = req.body;
  const newSelect = {
    nombre_pedido,
    cantidad,
    diametro,
    largo
  };
  //newUser.password = await helpers.encryptPassword(password);
  console.log("ENVIADO ADD ORDENES");
  await pool.query('INSERT INTO  adicionales_pedidos set ?', [newSelect], async (error, results) => {
    if (error) {
      console.log("error ADD ORDENES");
      console.log(error);
    } else {
      console.log("Guardado Adicionales en Pedido");
      console.log(newSelect);

    }
  });
})
///////////////************************************ */

//*******GUet IDS ORDENES *///
router.get('/getOrdenes', isLoggedIn, async (req, res, next) => {
  console.log("entro");
  idUsua = req.session.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.fullname = rows2[0].fullname;
  var nom = req.session.fullname;
  //guardo los datos de la tabla en datavista
  const { nombre, ids } = req.body;
    const datavista = await pool.query('SELECT * FROM pedido');
  if (true) {
    console.log( "GET IDS PLAN" );
    res.send( datavista );
    console.log( "GET IDS PLAN" );
    console.log( datavista );
  }

});
/////////////////////// GET ORDENES ADICIONALES/////////
router.post('/getAdicionalesOrdenes', isLoggedIn, async (req, res, next) => {
  console.log("entro");
  idUsua = req.session.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.fullname = rows2[0].fullname;
  var nom = req.session.fullname;
  //guardo los datos de la tabla en datavista
  const newSelect =req.body.nombre_actual;
console.log(newSelect);
console.log(req.body.nombre_actual);

  const datavista = await pool.query('SELECT * FROM adicionales_pedidos WHERE nombre_pedido =?',[newSelect]);
  if (true) {
    console.log( "GET DIAMETROS" );
    res.send( datavista );
    console.log( "GET DIAMETROS" );
    console.log( datavista );
  }

});

//////////////////////////////////////////////////////////
/// eliminar

router.post('/deleteOrdenes', isLoggedIn, async (req, res) => {
  const {  ids } = req.body;
  const newSelect = {
   
    ids

  };
  //newUser.password = await helpers.encryptPassword(password);

  await pool.query('DELETE FROM  pedido WHERE  ?', [newSelect], async (error, results) => {
    if (error) {
      console.log(error);
    } else {
      console.log(" PEDIDO eliminado");
      console.log(newSelect);

    }
  });
})
//////////////////////////////////////////////////////
// GUARDAR VISUALIZACIONES PRE-DEFINIDAS

router.post('/saveView', isLoggedIn, async (req, res) => {
  const { nombre, ids } = req.body;
  const newSelect = {
    nombre,
    ids
  };
  newUser.password = await helpers.encryptPassword(password);

  await pool.query('INSERT INTO  vistas_save set ?', [newUser], async (error, results) => {
    if (error) {
      console.log(error);
    } else {
      res.render('signup', {
        alert: true,
        alertTitle: "¡Correcto!",
        alertMessage: "¡Usuario agregado exitosamente!",
        alertIcon: 'success',
        showConfirmButton: false,
        ruta: 'signup',
        data,
        nom
      })
    }
  });
})
/*router.get('/icons',(req, res, next) =>{
  res.render('icons');
})*/
//profile
router.get('/profile', isLoggedIn, async (req, res, next) => {
  idUsua = req.session.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.fullname = rows2[0].fullname;
  req.session.username = rows2[0].username;
  var nom = req.session.fullname;
  var nom2 = req.session.username;
  const idUsu = req.session.idUsu;
  if (req.session.tipoUsuario == "Administrador") {
    res.render('profile', { nom, nom2 });
  }
  if (req.session.tipoUsuario == "Usuario") {
    res.render('profileV2', { nom, nom2, idUsu });
    console.log(idUsu);
  }
})

router.post('/profile', isLoggedIn, async (req, res) => {
  idUsua = req.session.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.fullname = rows2[0].fullname;
  req.session.username = rows2[0].username;
  var nom = req.session.fullname;
  var nom2 = req.session.username;

  const idUsu = req.session.idUsu;
  if (req.session.tipoUsuario == "Administrador") {
    const { fullname, username, password, password2 } = req.body;

    if (password == password2) {
      if (password == "" && password2 == "") {

        const newUser = {
          fullname,
          username
        };
        await pool.query('UPDATE users set ? WHERE idUsu = ?', [newUser, idUsu], async (error, results) => {
          if (error) {
            console.log(error);
          } else {
            nom = newUser.fullname;
            nom2 = newUser.username;
            res.render('profile', {
              alert: true,
              alertTitle: "¡Correcto!",
              alertMessage: "¡Datos correctamente editados!",
              alertIcon: 'success',
              showConfirmButton: false,
              ruta: 'profile',
              nom,
              nom2
            })
          }
        });
        console.log("full y user");
        console.log(newUser);

      }
      if(password2!="" && password !="") {
        if (password.length >= 6 && password.length <= 15) {
          
          const newUser = {
            fullname,
            username,
            password
          };
          newUser.password = await helpers.encryptPassword(password);
          await pool.query('UPDATE users set ? WHERE idUsu = ?', [newUser, idUsu], async (error, results) => {
            if (error) {
              console.log(error);
            } else {

              nom = newUser.fullname;
              nom2 = newUser.username;
              res.render('profile', {
                alert: true,
                alertTitle: "¡Correcto!",
                alertMessage: "¡Datos correctamente editados!",
                alertIcon: 'success',
                showConfirmButton: false,
                ruta: 'profile',
                nom,
                nom2
              })
            }
          });
          console.log("full, user y pass");
          console.log(newUser);
        }
        else {
          
          res.render('profile', {
            alert: true,
            alertTitle: "¡Ups!",
            alertMessage: "¡La contraseña debe ser mayor a 6 y menor a 15 caracteres!",
            alertIcon: 'error',
            showConfirmButton: false,
            ruta: 'profile',
            nom,
            nom2
          })
        }
      }
    }
    if (password != password2) {

      res.render('profile', {
        alert: true,
        alertTitle: "¡Ups!",
        alertMessage: "¡Las contraseñas no coinciden, vuelva a intentar!",
        alertIcon: 'error',
        showConfirmButton: false,
        ruta: 'profile',
        nom,
        nom2
      })
    }

  }
  if (req.session.tipoUsuario == "Usuario") {
    const { fullname, username, password, password2 } = req.body;

    if (password == password2) {
      console.log("Son Iguales");
      if (password == "" && password2 == "") {
        console.log("Estan vacías");

        const newUser = {
          fullname,
          username
        };
        await pool.query('UPDATE users set ? WHERE idUsu = ?', [newUser, idUsu], async (error, results) => {
          if (error) {
            console.log(error);
          } else {
            console.log("hizo la query");
            nom = newUser.fullname;
            nom2 = newUser.username;
            res.render('profileV2', {
              alert: true,
              alertTitle: "¡Correcto!",
              alertMessage: "¡Datos correctamente editados!",
              alertIcon: 'success',
              showConfirmButton: false,
              ruta: 'profileV2',
              nom,
              nom2
            })
            console.log("mensaje");

          }
        });
        console.log("full y user");
        console.log(newUser);
        console.log(idUsu);

      }
      //here
      if(password2!="" && password !="") {
        if (password.length >= 6 && password.length <= 15) {
          
          const newUser = {
            fullname,
            username,
            password
          };
          newUser.password = await helpers.encryptPassword(password);
          await pool.query('UPDATE users set ? WHERE idUsu = ?', [newUser, idUsu], async (error, results) => {
            if (error) {
              console.log(error);
            } else {

              nom = newUser.fullname;
              nom2 = newUser.username;
              res.render('profileV2', {
                alert: true,
                alertTitle: "¡Correcto!",
                alertMessage: "¡Datos correctamente editados!",
                alertIcon: 'success',
                showConfirmButton: false,
                ruta: 'profileV2',
                nom,
                nom2
              })
            }
          });
          console.log("full, user y pass");
          console.log(newUser);
        }
        else {
          
          res.render('profileV2', {
            alert: true,
            alertTitle: "¡Ups!",
            alertMessage: "¡La contraseña debe ser mayor a 6 y menor a 15 caracteres!",
            alertIcon: 'error',
            showConfirmButton: false,
            ruta: 'profileV2',
            nom,
            nom2
          })
        }
      }


    }
    if (password != password2) {

      res.render('profileV2', {
        alert: true,
        alertTitle: "¡Ups!",
        alertMessage: "¡Las contraseñas no coinciden, vuelva a intentar!",
        alertIcon: 'error',
        showConfirmButton: false,
        ruta: 'profileV2',
        nom,
        nom2
      })
    }
  }
});

//proyectos/* 
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

router.get('/proyecto2', isLoggedIn, async (req, res, next) => {
  idUsua = req.session.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.fullname = rows2[0].fullname;
  var nom = req.session.fullname;
  if (req.session.tipoUsuario == "Administrador") {
    res.render('proyecto2', { nom });
  }
  if (req.session.tipoUsuario == "Usuario") {
    res.render('proyecto2', { nom });
  }
})
//Morris Charts
router.get('/chart-morris', isLoggedIn, async (req, res, next) => {
  idUsua = req.session.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.fullname = rows2[0].fullname;
  var nom = req.session.fullname;
  if (req.session.tipoUsuario == "Administrador") {
    res.render('chart-morris', { nom });
  }
  if (req.session.tipoUsuario == "Usuario") {
    res.render('chart-morrisV2', { nom });
  }
})

//GANTT
router.get('/gantt', isLoggedIn, async (req, res, next) => {
  idUsua = req.session.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.fullname = rows2[0].fullname;
  var nom = req.session.fullname;
  if (req.session.tipoUsuario == "Administrador") {
    res.render('gantt', { nom });
  }
  if (req.session.tipoUsuario == "Usuario") {
    res.render('gantt', { nom });
  }
}) 

router.get('/prueba_gantt2', isLoggedIn, async (req, res, next) => {
  idUsua = req.session.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.fullname = rows2[0].fullname;
  var nom = req.session.fullname;
  if (req.session.tipoUsuario == "Administrador") {
    res.render('prueba_gantt2', { nom });
  }
  if (req.session.tipoUsuario == "Usuario") {
    res.render('prueba_gantt2', { nom });
  }
}) 

//Flot Charts
router.get('/chart-flot', isLoggedIn, async (req, res, next) => {
  idUsua = req.session.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.fullname = rows2[0].fullname;
  var nom = req.session.fullname;
  if (req.session.tipoUsuario == "Administrador") {
    res.render('chart-flot', { nom });
  }
  if (req.session.tipoUsuario == "Usuario") {
    res.render('chart-flotV2', { nom });
  }
})
//ChartJS
router.get('/chart-chartjs', isLoggedIn, async (req, res, next) => {
  idUsua = req.session.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.fullname = rows2[0].fullname;
  var nom = req.session.fullname;
  if (req.session.tipoUsuario == "Administrador") {
    res.render('chart-chartjs', { nom });
  }
  if (req.session.tipoUsuario == "Usuario") {
    res.render('chart-chartjsV2', { nom });
  }
})

/// Estadisticas Modelo

router.get('/estadisticasModelo', isLoggedIn, async (req, res, next) => {
  idUsua = req.session.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.fullname = rows2[0].fullname;
  var nom = req.session.fullname;
  if (req.session.tipoUsuario == "Administrador") {
    res.render('estadisticasModelo', { nom });
  }
  if (req.session.tipoUsuario == "Usuario") {
    res.render('estadisticasModelo', { nom });
  }
})
//Echart
router.get('/chart-echart', isLoggedIn, async (req, res, next) => {
  idUsua = req.session.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.fullname = rows2[0].fullname;
  var nom = req.session.fullname;
  if (req.session.tipoUsuario == "Administrador") {
    res.render('chart-echart', { nom });
  }
  if (req.session.tipoUsuario == "Usuario") {
    res.render('chart-echartV2', { nom });
  }
})
//Sparkline
router.get('/chart-sparkline', isLoggedIn, async (req, res, next) => {
  idUsua = req.session.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.fullname = rows2[0].fullname;
  var nom = req.session.fullname;
  if (req.session.tipoUsuario == "Administrador") {
    res.render('chart-sparkline', { nom });
  }
  if (req.session.tipoUsuario == "Usuario") {
    res.render('chart-sparklineV2', { nom });
  }
})
//Chart-peity
router.get('/chart-peity', isLoggedIn, async (req, res, next) => {
  idUsua = req.session.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.fullname = rows2[0].fullname;
  var nom = req.session.fullname;
  if (req.session.tipoUsuario == "Administrador") {
    res.render('chart-peity', { nom });
  }
  if (req.session.tipoUsuario == "Usuario") {
    res.render('chart-peityV2', { nom });
  }
})

//prueba
/*router.get('/prueba',isLoggedIn, async (req, res, next) =>{
  idUsua = req.session.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.fullname = rows2[0].fullname;
  var nom = req.session.fullname;
  res.render('prueba', {nom});
})*/
/*router.get('/prueba',controlador.list,(req, res, next) =>{
  res.render('prueba');
})*/
router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/signin');
  console.log("cerró sesión")
});




module.exports = router;