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
const { data } = require('jquery');
const { sendEmail } = require('../utils/email.util');
const { Console } = require('console');
//google

//aquí toma el redireccionamiento del botón de google y le digo que use el plugin para logear llamado passport
//usando en esta ocasion a google, al llamar el passport.authenticate('google') va directamente a mi estrategia
// 
//y establezco que el alcance (scope) es el email y el profile, estas son las variables que jugaran un rol 
//en la respuesta de parte de google. 
router.get('/auth/google',
  passport.authenticate('google', passport.authenticate('google', {
    scope: ['email', 'profile']
  })));

//aquí solo llamo a la libreria de passport google oauth2 para poder usarla, además establezco 
//las credenciales que me entrega google dentro de "GOOGLE_CLIENT_ID" y "GOOGLE_CLIENT_SECRET" y así
//establecer la relación con mi proyecto creado en google (https://console.cloud.google.com/projectselector2/apis)
//video de como obtener credenciales https://www.youtube.com/watch?v=uqUVQ2tW3SY

var GoogleStrategy = require('passport-google-oauth2').Strategy;
const GOOGLE_CLIENT_ID = "604521871686-r8gl6jik58g1dqkihvqn6kqis28gdjs9.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
//estrategia
//aquí inicia la estrategia, le pasamos las credenciales, una callbackURL y el alcance que habíamos definido
//luego en una función asincrona  hago una comparación en nuestra base de datos donde están los usuarios
//y lo comparo con el email de la cuenta google que quiere ingresar, si está en nuestra base de datos, esta
//puede entrar
//si se cumple todo, se retorna un user de nuestra base de datos y se serializa para iniciar la sesion
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://arbim.sa-east-1.elasticbeanstalk.com/auth/google/callback",
  passReqToCallback: true,
  scope: ['email', 'profile']
}, async function (req, accessToken, refreshToken, profile, done) {
  console.log(profile.email)
  var rows = await pool.query('SELECT * FROM users WHERE username = ?', [profile.email]);
  if (rows.length > 0) {

    const user = rows[0];
    done(null, user);
  } else {
    return done(null, false, console.log("usuario no existe"), req.flash('message', 'Usuario no existe.'));
  }

}));
//Si se cumple la estrategia puede  ir por dos caminos dependiendo si logró ingresar o no, en caso de que
//el ingreso sea efectivo, esta redirecciona al index.ejs y si no, devuelve al signin.ejs.
router.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/profile',
    failureRedirect: '/signin'
  })
);

//signin
router.get('/signin', isNotLoggedIn, (req, res, next) => {
  res.render('signin', { message: req.flash('message') });
})


router.post(
  '/signin',
  passport.authenticate('local.signin', {
    failureRedirect: '/signin',
    failureFlash: true
  }), async (req, res) => {
    if (req.session.passport.user.tipoUsuario == "Administrador") {
      var nom = req.session.passport.user.fullname;
      var nom2 = req.session.passport.user.username;
      res.render('profile', { nom, nom2 });
    }
    if (req.session.passport.user.tipoUsuario == "Editor") {
      var nom = req.session.passport.user.fullname;
      res.render('profileV3', { nom, nom2 });
    }
    if (req.session.passport.user.tipoUsuario == "Visualizador") {
      var nom = req.session.passport.user.fullname;
      res.render('profileV2', { nom, nom2 });
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
      done(null, user);
    } else {
      done(null, false, console.log("Contraseña inválida"), req.flash('message', 'Contraseña incorrecta.'));
    }
  } else {
    return done(null, false, console.log("usuario no existe"), req.flash('message', 'Usuario no existe.'));
  }
}));

//serialize user
passport.serializeUser((user, done) => {
  done(null, {
    tipoUsuario: user.tipoUsuario,
    fullname: user.fullname,
    username: user.username,
    idUsu: user.idUsu
  });
});

passport.deserializeUser(async (user, done) => {
  const rows = await pool.query('SELECT * FROM users WHERE idUsu = ?', [user.idUsu]);
  done(null, rows[0]);

});

//botón editar del formulario editar2
router.post('/editar2/:idUsu', isLoggedIn, async (req, res) => {
  idUsua = req.session.passport.user.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.passport.user.fullname = rows2[0].fullname;
  var nom = req.session.passport.user.fullname;
  if (req.session.passport.user.tipoUsuario == "Administrador") {
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
  if (req.session.passport.user.tipoUsuario == "Editor") {
    res.redirect('index');
  }
  if (req.session.passport.user.tipoUsuario == "Visualizador") {
    res.redirect('index');
  }
});
//editar2
router.get('/edit/:idUsu', isLoggedIn, async (req, res) => {
  idUsua = req.session.passport.user.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.passport.user.fullname = rows2[0].fullname;
  var nom = req.session.passport.user.fullname;
  if (req.session.passport.user.tipoUsuario == "Administrador") {
    const { idUsu } = req.params;
    const data = await pool.query('SELECT * FROM users WHERE idUsu= ?', [idUsu]);
    res.render('editar2', { data: data[0], nom });
  }
  if (req.session.passport.user.tipoUsuario == "Editor") {
    res.redirect('index');
  }
  if (req.session.passport.user.tipoUsuario == "Visualizador") {
    res.redirect('index');
  }
});
//edit
router.get('/edit', isLoggedIn, async (req, res) => {
  idUsua = req.session.passport.user.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.passport.user.fullname = rows2[0].fullname;
  var nom = req.session.passport.user.fullname;
  if (req.session.passport.user.tipoUsuario == "Administrador") {
    const data = await pool.query('SELECT * FROM users');
    res.render('edit', { data, nom });

  }
  if (req.session.passport.user.tipoUsuario == "Editor") {
    res.redirect('index');

  } if (req.session.passport.user.tipoUsuario == "Visualizador") {
    res.redirect('index');
  }
})


//delete
router.get('/delete', isLoggedIn, async (req, res) => {
  idUsua = req.session.passport.user.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.passport.user.fullname = rows2[0].fullname;
  var nom = req.session.passport.user.fullname;
  if (req.session.passport.user.tipoUsuario == "Administrador") {
    const data = await pool.query('SELECT * FROM users');

    res.render('delete', { data, nom });

  }
  if (req.session.passport.user.tipoUsuario == "Editor") {
    res.redirect('index');

  } if (req.session.passport.user.tipoUsuario == "Visualizador") {
    res.redirect('index');
  }
})

router.get('/delete2/:idUsu', isLoggedIn, async (req, res) => {
  idUsua = req.session.passport.user.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.passport.user.fullname = rows2[0].fullname;
  var nom = req.session.passport.user.fullname;
  if (req.session.passport.user.tipoUsuario == "Administrador") {
    const { idUsu } = req.params;
    await pool.query('DELETE FROM users WHERE idUsu = ?', [idUsu]);
    res.redirect('/delete');
  }
  if (req.session.passport.user.tipoUsuario == "Editor") {
    res.redirect('index');
  } if (req.session.passport.user.tipoUsuario == "Visualizador") {
    res.redirect('index');
  }
});

router.get('/deleteVista/:idVS', isLoggedIn, async (req, res) => {
  idUsua = req.session.passport.user.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.passport.user.fullname = rows2[0].fullname;
  var nom = req.session.passport.user.fullname;
  if (req.session.passport.user.tipoUsuario == "Administrador") {
    const { idVS } = req.params;
    console.log("ID DELTE");
    console.log(idVS);
    await pool.query('DELETE FROM vistas_save WHERE ids = ?', [idVS]);
    res.redirect('/index');
  }
  if (req.session.passport.user.tipoUsuario == "Editor") {
    const { idVS } = req.params;
    await pool.query('DELETE FROM vistas_save WHERE ids = ?', [idVS]);
    res.redirect('/indexV3');
  }
  //rev 
  if (req.session.passport.user.tipoUsuario == "Visualizador") {
   res.redirect('indexV2');
  }
});

router.get('/delete/:idUsu', isLoggedIn, async (req, res) => {
  idUsua = req.session.passport.user.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.passport.user.fullname = rows2[0].fullname;
  var nom = req.session.passport.user.fullname;
  if (req.session.passport.user.tipoUsuario == "Administrador") {
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

  }
  if (req.session.passport.user.tipoUsuario == "Editor") {
    res.redirect('index');

  } if (req.session.passport.user.tipoUsuario == "Visualizador") {
    res.redirect('index');
  }
});

// SIGNUP
router.get('/signup', isLoggedIn, async (req, res) => {
  idUsua = req.session.passport.user.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.passport.user.fullname = rows2[0].fullname;
  var nom = req.session.passport.user.fullname;
  if (req.session.passport.user.tipoUsuario == "Administrador") {
    console.log("pasó por la authen")
    const data = await pool.query('SELECT * FROM users');
    res.render('signup', { data, nom });

  }
  if (req.session.passport.user.tipoUsuario == "Editor") {
    res.redirect('index');

  } if (req.session.passport.user.tipoUsuario == "Visualizador") {
    res.redirect('index');
  }
});


///////GET DATA USUARIO / PROYECTOS //

router.get('/getAsignaciones', isLoggedIn, async (req, res) => {
  idUsua = req.session.passport.user.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.passport.user.fullname = rows2[0].fullname;
  var nom = req.session.passport.user.fullname;
  if (req.session.passport.user.tipoUsuario == "Administrador") {
    console.log("pasó por la authen")
    const data = await pool.query('SELECT * FROM proyectos_usuario');
    res.send( { data });

  }
  if (req.session.passport.user.tipoUsuario == "Editor") {
    res.redirect('index');

  } if (req.session.passport.user.tipoUsuario == "Visualizador") {
    res.redirect('index');
  }
});

router.post('/signup', isLoggedIn, async (req, res) => {
  idUsua = req.session.passport.user.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.passport.user.fullname = rows2[0].fullname;
  var nom = req.session.passport.user.fullname;
  if (req.session.passport.user.tipoUsuario == "Administrador") {
    const { fullname, username, password, tipoUsuario } = req.body;
    const newUser = {
      fullname,
      username,
      password,
      tipoUsuario
    };
    //Arreglar
    //Y en el caso de que el usuario ya esté?
    newUser.password = await helpers.encryptPassword(password);
    const data = await pool.query('SELECT * FROM users');
    var rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
      res.render('signup', {
        alert: true,
        alertTitle: "¡Ups!",
        alertMessage: "¡Usuario ya registrado!",
        alertIcon: 'error',
        showConfirmButton: false,
        ruta: 'signup',
        data,
        nom
      })

    }
    else {
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
    }

    // res.redirect('signup');
  }
  if (req.session.passport.user.tipoUsuario == "Editor") {
    res.redirect('index');
  } if (req.session.passport.user.tipoUsuario == "Visualizador") {
    res.redirect('index');
  }
});
router.get('/prueba', isLoggedIn, async (req, res, next) => {
  idUsua = req.session.passport.user.idUsu;
  
  const { urn } = req.body;
  console.log("URN BUSCA VISTAS");
  console.log(urn);
  console.log(req.body)
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.passport.user.fullname = rows2[0].fullname;
  var nom = req.session.passport.user.fullname;
  //guardo los datos de la tabla en datavista
  const datavista = await pool.query('SELECT * FROM vistas_save WHERE urn LIKE "'+urn+'"');
  if (req.session.passport.user.tipoUsuario == "Administrador") {
    res.send(datavista);
    console.log(datavista);
  }
  if (req.session.passport.user.tipoUsuario == "Editor") {
    res.send(datavista);
    console.log(datavista);
  }
  //rev
  if (req.session.passport.user.tipoUsuario == "Visualizador") {
    res.send(datavista);
    console.log(datavista);
  }

});

router.post('/buscaVistas', isLoggedIn, async (req, res, next) => {
  idUsua = req.session.passport.user.idUsu;
  
  const { urn } = req.body;
  console.log("URN BUSCA VISTAS2");
  console.log(urn);
  console.log("todo");

  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.passport.user.fullname = rows2[0].fullname;
  var nom = req.session.passport.user.fullname;
  //guardo los datos de la tabla en datavista
  const datavista = await pool.query('SELECT * FROM vistas_save WHERE urn LIKE "'+urn+'"');
  if (req.session.passport.user.tipoUsuario == "Administrador") {
   
    console.log("Resultado Ids");
    console.log(datavista);
    res.send(datavista);
  }
  if (req.session.passport.user.tipoUsuario == "Editor") {
   
    console.log(datavista);
    res.send(datavista);
  }
  //rev
  if (req.session.passport.user.tipoUsuario == "Visualizador") {
   
    console.log(datavista);
    res.send(datavista);
  }

});
//Prueba recuperacion contraseña
router.get('/restaurar_password', isNotLoggedIn, async (req, res, next) => {
  res.render('restaurar_password');
});
//generador de token
const generateRandomString = (num) => {
  return [...Array(num)].map(() => {
    const randomNum = ~~(Math.random() * 36);
    return randomNum.toString(36);
  })
    .join('')
    .toUpperCase();
}
//
const getEmailTemplate = (data) => {
  //entró
  const { email, token } = data;
  console.log(email);
  const emailUser = email.split('@')[0].toString();
  const url = 'http://localhost:31000/cambiar_password';

  return `
  <form>
    <div>
      <label>Hola ${emailUser}</label>
      <br>
      <a href="${url}?token=${token}" target="_blank">Recuperar contraseña</a>
    </div>
  </form>
  `;
}
router.post('/recuperacion', isNotLoggedIn, async (req, res) => {
  const { username } = req.body;
  var rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  if (rows.length > 0) {
    //usuario encontrado hay que mandar el email
    console.log("usuario encontrado");
    const token = generateRandomString(16);
    console.log(token);
    const isUsed = "falso";
    //una vez creado el token debo guardarlo en la base de datos
    const newToken = {
      username,
      token,
      isUsed
    };
    console.log(newToken);
    //insert token
    try {
      await pool.query('INSERT INTO token_cambio_password set ?', [newToken], async (error, results) => {
        if (error) {
          console.log(error);
        } else {
          console.log("token añadido");
          //si se insertó, procedemos a mandar el mail 
          const data = { email: username, token }
          const email = username;
          const correo = getEmailTemplate(data);
          console.log("email " + email);
          await sendEmail(email, 'Recuperar contraseña', correo);
          res.render('restaurar_password', {
            alert: true,
            alertTitle: "Email",
            alertMessage: "¡Email enviado!",
            alertIcon: 'success',
            showConfirmButton: false,
            ruta: 'restaurar_password'
          })

        }
      });

    } catch (error) {
      console.log("Errorrrr", error.message)
    }



  }
  else {
    res.render('restaurar_password', {
      alert: true,
      alertTitle: "¡Ups!",
      alertMessage: "¡Usuario no registrado!",
      alertIcon: 'error',
      showConfirmButton: false,
      ruta: 'restaurar_password'
    })
  }


});

//cambio de contraseña con token
router.get('/cambiar_password', isNotLoggedIn, async (req, res, next) => {
  res.render('cambiar_password');
});


router.post('/getOrdenesMaestroFierros', isNotLoggedIn, async (req, res, done) => {
  const { password, password2, tokenId } = req.body;
});

router.post('/cambio_de_pass', isNotLoggedIn, async (req, res, done) => {
  const { password, password2, tokenId } = req.body;
  console.log("tokennuevo : " + tokenId);
  var rows = await pool.query('SELECT username FROM token_cambio_password WHERE token = ?', [tokenId]);
  var IsUsedToken = await pool.query('SELECT isUsed FROM token_cambio_password WHERE token = ?', [tokenId]);
  console.log("Fue usado el token?: " + IsUsedToken[0].isUsed);
  if (IsUsedToken[0].isUsed == "true") {
    res.render("cambiar_password", {
      alert: true,
      alertTitle: "¡Ups!",
      alertMessage: "¡Este token ya fue utilizado!",
      alertIcon: 'error',
      showConfirmButton: false,
      ruta: 'cambiar_password'

    })
  }
  else {
    if (rows.length > 0) {
      console.log("token encontrado en la bd");
      console.log("username de la base de datos de token: " + rows[0].username);
      if (password == password2) {
        if (password == "" && password2 == "") {
          console.log("deben estar rellenos ambos campossss");

          /*
          res.render("/cambiar_password", {
            alert: true,
            alertTitle: "¡Ups!",
            alertMessage: "¡La contraseña no puede estar vacía!",
            alertIcon: 'error',
            showConfirmButton: false,
            ruta: 'cambiar_password'
  
          })*/

        }
        if (password2 != "" && password != "") {
          if (password.length >= 6 && password.length <= 15) {

            const newPass = {
              password
            };
            newPass.password = await helpers.encryptPassword(password);
            await pool.query('UPDATE users set ? WHERE username = ?', [newPass, rows[0].username], async (error, results) => {
              if (error) {
                console.log(error);
              } else {

                res.render('cambiar_password', {
                  alert: true,
                  alertTitle: "¡Correcto!",
                  alertMessage: "¡Contraseña editada correctamente!",
                  alertIcon: 'success',
                  showConfirmButton: false,
                  ruta: 'cambiar_password',

                })
                //cambiar el token a usado
                await pool.query('UPDATE token_cambio_password set isUsed = ? WHERE token = ?', ["true", tokenId], async (error, results) => {
                  if (error) {
                    console.log(error);
                  }
                  else {
                    console.log("cambio el estado");
                  }
                });
              }
            });


          }
          else {
            //la contraseña debe ser mayor a 6 y menor a 15 caracteres!

            /*res.render('profile', {
              alert: true,
              alertTitle: "¡Ups!",
              alertMessage: "¡La contraseña debe ser mayor a 6 y menor a 15 caracteres!",
              alertIcon: 'error',
              showConfirmButton: false,
              ruta: 'profile',
    
            })*/
          }
        }
      }
      if (password != password2) {

        //las contraseñas no coinciden, vuelva a intentar
        console.log("las pass no coinciden");
        //document.getElementById("error").style.display="block";

        return false;
        /*res.render('profile', {
          alert: true,
          alertTitle: "¡Ups!",
          alertMessage: "¡Las contraseñas no coinciden, vuelva a intentar!",
          alertIcon: 'error',
          showConfirmButton: false,
          ruta: 'profile',
        })*/

      }

    }
  }



});

router.get('/listaProyecto', isLoggedIn, async (req, res, next) => {
  idUsua = req.session.passport.user.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.passport.user.fullname = rows2[0].fullname;
  var nom = req.session.passport.user.fullname;
  //guardo los datos de la tabla en datavista
  const datavista = await pool.query('SELECT * FROM modelo');
  if (req.session.passport.user.tipoUsuario == "Administrador") {
    res.send(datavista);
    console.log(datavista);
  }
  if (req.session.passport.user.tipoUsuario == "Editor") {
    res.send(datavista);
    console.log(datavista);
  }
  //rev
  if (req.session.passport.user.tipoUsuario == "Visualizador") {
    res.send(datavista);
    console.log(datavista);
  }

});

router.get('/listaDBIDS', isLoggedIn, async (req, res, next) => {
  idUsua = req.session.passport.user.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  // console.log(rows2[0].fullname);
  req.session.passport.user.fullname = rows2[0].fullname;
  var nom = req.session.passport.user.fullname;
  //guardo los datos de la tabla en datavista
  const { nombre, ids } = req.body;
  const datavista = await pool.query('SELECT * FROM plan');
  if (req.session.passport.user.tipoUsuario == "Administrador") {
    res.send(datavista);
    // console.log( "GET IDS PLAN" );
    // console.log( datavista );
  }
  if (req.session.passport.user.tipoUsuario == "Editor") {
    res.send(datavista);
    // console.log( "GET IDS PLAN" );
    // console.log( datavista );
  }
  //rev
  if (req.session.passport.user.tipoUsuario == "Visualizador") {
    res.send(datavista);
    // console.log( "GET IDS PLAN" );
    // console.log( datavista );
  }

});

router.get('/getUsers',isLoggedIn,async (req,res,next)=>{
  idUsua = req.session.passport.user.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  req.session.passport.user.fullname = rows2[0].fullname;
  var nom = req.session.passport.user.fullname;
  if (req.session.passport.user.tipoUsuario == "Administrador") {
    var rows3 = await pool.query('SELECT username, idUsu FROM users');
    console.log("Lista de Usuarios");
    console.log(rows3);
    res.send(rows3);
    // console.log( "GET IDS PLAN" );
    // console.log( datavista );
  }
})
router.post('/listaDBIDSPlan', isLoggedIn, async (req, res, next) => {
  idUsua = req.session.passport.user.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  // console.log(rows2[0].fullname);
  req.session.passport.user.fullname = rows2[0].fullname;
  var nom = req.session.passport.user.fullname;
  //guardo los datos de la tabla en datavista
  const { urn } = req.body;
  const datavista = await pool.query('SELECT * FROM plan WHERE fecha_plan != "" AND urn LIKE "'+urn+'"');
  if (req.session.passport.user.tipoUsuario == "Administrador") {
    res.send(datavista);
    // console.log( "GET IDS PLAN" );
    // console.log( datavista );
  }
  if (req.session.passport.user.tipoUsuario == "Editor") {
    res.send(datavista);
    // console.log( "GET IDS PLAN" );
    // console.log( datavista );
  }
  //rev
  if (req.session.passport.user.tipoUsuario == "Visualizador") {
    res.send(datavista);
    // console.log( "GET IDS PLAN" );
    // console.log( datavista );
  }

});
router.post('/insertDBIDS', isLoggedIn, async (req, res, next) => {




  //guardo los datos de la tabla en datavista
  const { fecha_plan, fecha_base, dbId,urn } = req.body;

  const insertPlan = { dbId, fecha_plan, fecha_base,urn };

console.log("llega urn");

  await pool.query('INSERT INTO  plan set ?', [insertPlan], async (error, results) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Inserción Exitosa")
    }
  });

});
//
router.post('/transferenciaDatos', isLoggedIn, async (req, res, next) => {
  idUsua = req.session.passport.user.idUsu;
  const { emisor, receptor } = req.body;
  console.log("datos emisor y receptor");
  console.log(emisor);
  console.log(receptor);
  if (req.session.passport.user.tipoUsuario == "Administrador") {
    await pool.query('UPDATE pedido set urn_actual ="'+receptor+'" WHERE urn_actual LIKE "'+emisor+'"', async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        await pool.query('UPDATE adicionales_pedidos set urn ="'+receptor+'" WHERE urn LIKE "'+emisor+'"', async (error, results) => {
          if (error) {
            console.log(error);
          } else {
            await pool.query('UPDATE vistas_save set urn ="'+receptor+'" WHERE urn LIKE "'+emisor+'"', async (error, results) => {
              if (error) {
                console.log(error);
              } else {
                  res.send("ok");
        
              }
            });
    
          }
        });

      }
    });

   

   
   
   
  }
  res.send("proyectos");
});

router.post('/updateDBIDS', isLoggedIn, async (req, res, next) => {


  idUsua = req.session.passport.user.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
   await pool.query('UPDATE pedido set ? WHERE dbId = ?', [updatePlan, i], async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log("update exitoso");

      }
    });


  //guardo los datos de la tabla en datavista

  const { fecha_plan, fecha_base, dbId,urn } = req.body;
  let i = parseInt('' + dbId, 0);

  const updatePlan = { fecha_plan, fecha_base };
  console.log('ENVIO UPDATE');
  console.log(req.body);
  if (req.session.passport.user.tipoUsuario == "Administrador") {
    await pool.query('UPDATE plan set fecha_base='+fecha_base+', fecha_plan ='+fecha_plan+' WHERE dbId ='+i+' AND urn LIKE "'+urn+'"', async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log("update exitoso");

      }
    });
    res.send(datavista);

    console.log(datavista);
  }
  if (req.session.passport.user.tipoUsuario == "Editor") {
    await pool.query('UPDATE plan set ? WHERE dbId = ?', [updatePlan, i], async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log("update exitoso");

      }
    });
    res.send(datavista);

    console.log(datavista);
  }
  //rev
  if (req.session.passport.user.tipoUsuario == "Visualizador") {
    await pool.query('UPDATE plan set ? WHERE dbId = ?', [updatePlan, i], async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log("update exitoso");

      }
    });
    res.send(datavista);

    console.log(datavista);
  }

});


//guardar generico
router.post('/prueba', isLoggedIn, async (req, res) => {
  console.log("Entro en el guardar1")
  //esto es para el nombre e iniciales
  console.log(req.body);
  //aquí traigo el id de la sesión activa
  console.log("REQ")
  idUsua = req.session.passport.user.idUsu;
  //aquí traigo al usuario el cual tiene la id que traje
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  //asigno
  console.log(rows2[0].fullname);
  req.session.passport.user.fullname = rows2[0].fullname;
  req.session.passport.user.username = rows2[0].username;
  var nom = req.session.passport.user.fullname;
  var nom2 = req.session.passport.user.username;
  //id de la sesión
  const idUsu = req.session.passport.user.idUsu;

  //ahora empieza la función
  if (req.session.passport.user.tipoUsuario == "Administrador") {
    const datavista = await pool.query('SELECT * FROM vistas_save');

    //aquí le paso los datos de los inputs (Los capto a través del "name")
    const { nombre, ids,urn } = req.body;
    console.log("body");
    console.log(req.body);
    console.log(req.body.nombre);
    //entonces en la variable newDatos pongo los datos a insertar
    const newDatos = {
      nombre,
      ids,
      urn
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
    console.log("nom: " + nom);
    console.log("nom2: " + nom2);
    console.log("datos: " + newDatos);


  }
  if (req.session.passport.user.tipoUsuario == "Editor") {
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

        res.render('pruebaV3', {
          datavista,
          alert: true,
          alertTitle: "¡Correcto!",
          alertMessage: "¡Datos correctamente agregados!",
          alertIcon: 'success',
          showConfirmButton: false,
          ruta: 'pruebaV3',
          nom,
          nom2

        })
      }
    });
    console.log("nom: " + nom);
    console.log("nom2: " + nom2);
    console.log("datos: " + newDatos);


  }
  //rev
  if (req.session.passport.user.tipoUsuario == "Visualizador") {
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

        res.render('pruebaV2', {
          datavista,
          alert: true,
          alertTitle: "¡Correcto!",
          alertMessage: "¡Datos correctamente agregados!",
          alertIcon: 'success',
          showConfirmButton: false,
          ruta: 'pruebaV2',
          nom,
          nom2

        })
      }
    });
    console.log("nom: " + nom);
    console.log("nom2: " + nom2);
    console.log("datos: " + newDatos);


  }
});

// buscar seleccionado
router.post('/getModeloSeleccionado', isLoggedIn, async (req, res) => {
  const idUsu = req.session.passport.user.idUsu;
 
  
  var rows = await pool.query('SELECT nombre FROM modelo WHERE modelo = "'+ idUsu+'"');
  console.log("RESULTADO PROYECRTOS ASIGNADOS");
  console.log(rows);
  res.send(rows);
});
//guardar modelo activo
router.post('/vista', isLoggedIn, async (req, res) => {
  console.log("Entro en el guardar22222")
  //esto es para el nombre e iniciales
  console.log(req.body);
  const { nombre } = req.body;
  //aquí traigo el id de la sesión activa
  console.log("REQ")
  idUsua = req.session.passport.user.idUsu;
  //aquí traigo al usuario el cual tiene la id que traje
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  //asigno
  console.log(rows2[0].fullname);
  req.session.passport.user.fullname = rows2[0].fullname;
  req.session.passport.user.username = rows2[0].username;
  var nom = req.session.passport.user.fullname;
  var nom2 = req.session.passport.user.username;
  
  //id de la sesión
  const idUsu = req.session.passport.user.idUsu;
  var modelo =  idUsu;
 const insercion = {nombre,modelo}
  const buscaAsignacion = await pool.query('SELECT * FROM modelo  WHERE modelo = ?', [idUsu]);
  if(buscaAsignacion.length == 0){

    await pool.query('INSERT INTO   modelo set ?', [insercion], async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Inserto");

        res.send('ok');
      }
    });

  }
  else{ // existe una asignacion
    const actualiza = await pool.query('UPDATE modelo  set nombre =  ?  WHERE modelo = ? ',[nombre,idUsu], async (error, results) => {
      console.log(results);
      console.log(error);
      console.log("updatea modelo");
      console.log(nombre);
      console.log(idUsu);
      if (req.session.passport.user.tipoUsuario == "Administrador") {
        res.send('ok');
     
    
    
      }
      if (req.session.passport.user.tipoUsuario == "Editor") {
       
        res.send('ok');
    
    
      }
      //rev
      if (req.session.passport.user.tipoUsuario == "Visualizador") {
       
        res.send('ok');
    
    
      }
    });

  }
  
  
  //ahora empieza la función
 
});
/*router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '#',
  failureRedirect: '/signup',
  failureFlash: true
}));*/

//modals
/*router.get('/modals', (req, res, next) => {
  if (req.session.passport.user.tipoUsuario == "Administrador") {
  res.render('modals');
}
if (req.session.passport.user.tipoUsuario == "Visualizador") {
 res.render('modalsV2');
}})*/

//--
//index
/*router.get('/index2', isLoggedIn, async (req, res, next) => {
  idUsua = req.session.passport.user.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.passport.user.fullname = rows2[0].fullname;
  var nom = req.session.passport.user.fullname;
  var nom2 = req.session.passport.user.username;

  var rows3 = await pool.query('SELECT * FROM filtros WHERE id = ?', [1]);
  const filtro_1 = rows3[0].filtro_1;
  const filtro_2 = rows3[0].filtro_2;

  const rows4 = await pool.query('SELECT * FROM gantt', [idUsua]);
  const categoria_01 = rows4[0].categoria_01;
  const categoria_02 = rows4[0].categoria_02;
  const categoria_03 = rows4[0].categoria_03;
  const categoria_04 = rows4[0].categoria_04;
  const parametro_nivel = rows4[0].parametro_nivel;
  const parametro_fecha = rows4[0].parametro_fecha;
  if (req.session.passport.user.tipoUsuario == "Administrador") {

    res.render('index2', {
      alert: true,
      alertTitle: "¡Correcto!",
      alertMessage: "¡Datos correctamente editados!",
      alertIcon: 'success',
      showConfirmButton: false,
      ruta: 'index2',
      nom,
      nom2,
      idUsua, filtro_1, filtro_2, categoria_01, categoria_02, categoria_03, categoria_04, parametro_nivel, parametro_fecha
    });
  }
  if (req.session.passport.user.tipoUsuario == "Editor") {

    res.render('index2V3', {
      alert: true,
      alertTitle: "¡Correcto!",
      alertMessage: "¡Datos correctamente editados!",
      alertIcon: 'success',
      showConfirmButton: false,
      ruta: 'index2V3',
      nom,
      nom2,
      idUsua, filtro_1, filtro_2, categoria_01, categoria_02, categoria_03, categoria_04, parametro_nivel, parametro_fecha
    });
  }
  if (req.session.passport.user.tipoUsuario == "Visualizador") {
    
    res.render('index2', { nom, filtro_1 });
  }
})
*/

//index
router.get('/index', isLoggedIn, async (req, res, next) => {
  idUsua = req.session.passport.user.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.passport.user.fullname = rows2[0].fullname;
  var nom = req.session.passport.user.fullname;
  var nom2 = req.session.passport.user.username;

  var rows3 = await pool.query('SELECT * FROM filtros WHERE id = ?', [1]);
  const filtro_1 = rows3[0].filtro_1;
  const filtro_2 = rows3[0].filtro_2;
  const filtro_3 = rows3[0].fierro;

  const rows4 = await pool.query('SELECT * FROM gantt', [idUsua]);
  const categoria_01 = rows4[0].categoria_01;
  const categoria_02 = rows4[0].categoria_02;
  const categoria_03 = rows4[0].categoria_03;
  const categoria_04 = rows4[0].categoria_04;
  const parametro_nivel = rows4[0].parametro_nivel;
  const parametro_fecha = rows4[0].parametro_fecha;
  if (req.session.passport.user.tipoUsuario == "Administrador") {

    res.render('index', {
      alert: true,
      alertTitle: "¡Correcto!",
      alertMessage: "¡Datos correctamente editados!",
      alertIcon: 'success',
      showConfirmButton: false,
      ruta: 'index',
      nom,
      nom2,
      idUsua, filtro_1, filtro_2, categoria_01, categoria_02, categoria_03, categoria_04, parametro_nivel, parametro_fecha, filtro_3
    });
  }
  if (req.session.passport.user.tipoUsuario == "Editor") {

    res.render('indexV3', {
      alert: true,
      alertTitle: "¡Correcto!",
      alertMessage: "¡Datos correctamente editados!",
      alertIcon: 'success',
      showConfirmButton: false,
      ruta: 'indexV3',
      nom,
      nom2,
      idUsua, filtro_1, filtro_2, categoria_01, categoria_02, categoria_03, categoria_04, parametro_nivel, parametro_fecha, filtro_3
    });
  }
  if (req.session.passport.user.tipoUsuario == "Visualizador") {
    //res.render('indexV2', { nom, filtro_1 });
    res.render('indexV2', {
      alert: true,
      alertTitle: "¡Correcto!",
      alertMessage: "¡Datos correctamente editados!",
      alertIcon: 'success',
      showConfirmButton: false,
      ruta: 'indexV2',
      nom,
      nom2,
      idUsua, filtro_1, filtro_2, categoria_01, categoria_02, categoria_03, categoria_04, parametro_nivel, parametro_fecha, filtro_3
    });
  }
})



//indexV2
router.get('/indexV2', isLoggedIn, async (req, res, next) => {
  idUsua = req.session.passport.user.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.passport.user.fullname = rows2[0].fullname;
  var nom = req.session.passport.user.fullname;
  if (req.session.passport.user.tipoUsuario == "Administrador") {
    res.render('index', { nom });
  }
  if (req.session.passport.user.tipoUsuario == "Editor") {
    res.render('indexV3', { nom });
  }
  //rev
  if (req.session.passport.user.tipoUsuario == "Visualizador") {
    res.render('indexV2', { nom });
  }
})

router.post('/filtro', isLoggedIn, async (req, res) => {
  const categorias = { filtro_v1, filtro_v2, fierro } = req.body;
  await pool.query('UPDATE filtros set ? WHERE id = ?', [categorias, 1], async (error, results) => {
    if (error) {
      console.log(error);
    } else {
      idUsua = req.session.passport.user.idUsu;
      const rows2 = await pool.query('SELECT * FROM gantt', [idUsua]);
      console.log(rows2[0].categoria_01);
      const filtro_v1 = "";
      const filtro_v2 = "";
      const filtro_v3 = "";

      const categoria_01 = rows2[0].categoria_01;
      const categoria_02 = rows2[0].categoria_02;
      const categoria_03 = rows2[0].categoria_03;
      const categoria_04 = rows2[0].categoria_04;
      const parametro_nivel = rows2[0].parametro_nivel;
      const parametro_fecha = rows2[0].parametro_fecha;


      var nom = req.session.passport.user.fullname;
      var nom2 = req.session.passport.user.username;

      var rows3 = await pool.query('SELECT * FROM filtros', [idUsua]);
      const filtro_1 = rows3[0].filtro_1;
      const filtro_2 = rows3[0].filtro_2;
      const filtro_3 = rows3[0].fierro;

      const idUsu = req.session.passport.user.idUsu;
      if (req.session.passport.user.tipoUsuario == "Administrador") {
        console.log("config V1!!!!!!!!!!!!!!!");
        res.render('config', {
          alert: true,
          alertTitle: "¡Correcto!",
          alertMessage: "¡Datos correctamente editados!",
          alertIcon: 'success',
          showConfirmButton: false,
          ruta: 'config',
          nom,
          nom2,
          idUsu, filtro_1, filtro_2, categoria_01, categoria_02, categoria_03, categoria_04, parametro_nivel, parametro_fecha, filtro_3
        })
      }
      if (req.session.passport.user.tipoUsuario == "Editor") {
        console.log("config V3!!!!!!!!!!!!!!!");
        res.render('configV3', {
          alert: true,
          alertTitle: "¡Correcto!",
          alertMessage: "¡Datos correctamente editados!",
          alertIcon: 'success',
          showConfirmButton: false,
          ruta: 'config',
          nom,
          nom2,
          idUsu, filtro_1, filtro_2, categoria_01, categoria_02, categoria_03, categoria_04, parametro_nivel, parametro_fecha, filtro_3
       })
      }
      if (req.session.passport.user.tipoUsuario == "Visualizador") {
        console.log("config V2!!!!!!!!!!!!!!!");
        res.render('config', {
          alert: true,
          alertTitle: "¡Correcto!",
          alertMessage: "¡Datos correctamente editados!",
          alertIcon: 'success',
          showConfirmButton: false,
          ruta: 'config',
          nom,
          nom2,
          idUsu, filtro_1, filtro_2, categoria_01, categoria_02, categoria_03, categoria_04, parametro_nivel, parametro_fecha, filtro_3
        })
        console.log(idUsu);
      }

    }
  });
})


router.post('/filtro', isLoggedIn, async (req, res) => {
  const categorias = { filtro_v1, filtro_v2 } = req.body;
  await pool.query('UPDATE filtros set ? WHERE id = ?', [categorias, 1], async (error, results) => {
    if (error) {
      console.log(error);
    } else {
      idUsua = req.session.passport.user.idUsu;
      const rows2 = await pool.query('SELECT * FROM gantt', [idUsua]);
      console.log(rows2[0].categoria_01);
      const filtro_v1 = "";
      const filtro_v2 = "";


      const categoria_01 = rows2[0].categoria_01;
      const categoria_02 = rows2[0].categoria_02;
      const categoria_03 = rows2[0].categoria_03;
      const categoria_04 = rows2[0].categoria_04;
      const parametro_nivel = rows2[0].parametro_nivel;
      const parametro_fecha = rows2[0].parametro_fecha;


      var nom = req.session.passport.user.fullname;
      var nom2 = req.session.passport.user.username;

      var rows3 = await pool.query('SELECT * FROM filtros', [idUsua]);
      const filtro_1 = rows3[0].filtro_1;
      const filtro_2 = rows3[0].filtro_2;


      const idUsu = req.session.passport.user.idUsu;
      if (req.session.passport.user.tipoUsuario == "Administrador") {
        res.render('config', {
          alert: true,
          alertTitle: "¡Correcto!",
          alertMessage: "¡Datos correctamente editados!",
          alertIcon: 'success',
          showConfirmButton: false,
          ruta: 'config',
          nom,
          nom2,
          idUsu, filtro_1, filtro_2, categoria_01, categoria_02, categoria_03, categoria_04, parametro_nivel, parametro_fecha
        })
      }
      if (req.session.passport.user.tipoUsuario == "Editor") {
        res.render('configV3', {
          alert: true,
          alertTitle: "¡Correcto!",
          alertMessage: "¡Datos correctamente editados!",
          alertIcon: 'success',
          showConfirmButton: false,
          ruta: 'configV3',
          nom,
          nom2,
          idUsu, filtro_1, filtro_2, categoria_01, categoria_02, categoria_03, categoria_04, parametro_nivel, parametro_fecha
        })
      }
      if (req.session.passport.user.tipoUsuario == "Visualizador") {
        res.render('config', {
          alert: true,
          alertTitle: "¡Correcto!",
          alertMessage: "¡Datos correctamente editados!",
          alertIcon: 'success',
          showConfirmButton: false,
          ruta: 'config',
          nom,
          nom2,
          idUsu, filtro_1, filtro_2, categoria_01, categoria_02, categoria_03, categoria_04, parametro_nivel, parametro_fecha
        })
        console.log(idUsu);
      }

    }
  });
})

router.post('/parametro_fecha', isLoggedIn, async (req, res) => {
  const categorias = { parametro_fecha } = req.body;
  await pool.query('UPDATE gantt set ? WHERE id = ?', [categorias, 1], async (error, results) => {
    if (error) {
      console.log(error);
    } else {
      idUsua = req.session.passport.user.idUsu;
      const rows2 = await pool.query('SELECT * FROM gantt', [idUsua]);
      console.log(rows2[0].categoria_01);
      const filtro_1 = rows2[0].filtro_1;
      const filtro_2 = rows2[0].filtro_2;


      const categoria_01 = rows2[0].categoria_01;
      const categoria_02 = rows2[0].categoria_02;
      const categoria_03 = rows2[0].categoria_03;
      const categoria_04 = rows2[0].categoria_04;
      const parametro_nivel = rows2[0].parametro_nivel;
      const parametro_fecha = rows2[0].parametro_fecha;


      var nom = req.session.passport.user.fullname;
      var nom2 = req.session.passport.user.username;

      const idUsu = req.session.passport.user.idUsu;
      if (req.session.passport.user.tipoUsuario == "Administrador") {
        res.render('config', {
          alert: true,
          alertTitle: "¡Correcto!",
          alertMessage: "¡Datos correctamente editados!",
          alertIcon: 'success',
          showConfirmButton: false,
          ruta: 'config',
          nom,
          nom2,
          idUsu, filtro_1, filtro_2, categoria_01, categoria_02, categoria_03, categoria_04, parametro_nivel, parametro_fecha
        })
      }
      if (req.session.passport.user.tipoUsuario == "Editor") {
        res.render('configV3', {
          alert: true,
          alertTitle: "¡Correcto!",
          alertMessage: "¡Datos correctamente editados!",
          alertIcon: 'success',
          showConfirmButton: false,
          ruta: 'configV3',
          nom,
          nom2,
          idUsu, filtro_1, filtro_2, categoria_01, categoria_02, categoria_03, categoria_04, parametro_nivel, parametro_fecha
        })
      }
      if (req.session.passport.user.tipoUsuario == "Visualizador") {
        res.render('config', {
          alert: true,
          alertTitle: "¡Correcto!",
          alertMessage: "¡Datos correctamente editados!",
          alertIcon: 'success',
          showConfirmButton: false,
          ruta: 'config',
          nom,
          nom2,
          idUsu, filtro_1, filtro_2, categoria_01, categoria_02, categoria_03, categoria_04, parametro_nivel, parametro_fecha
        })
        console.log(idUsu);
      }

    }
  });
})

router.post('/parametro_niveles', isLoggedIn, async (req, res) => {
  const categorias = { parametro_nivel } = req.body;
  await pool.query('UPDATE gantt set ? WHERE id = ?', [categorias, 1], async (error, results) => {
    if (error) {
      console.log(error);
    } else {
      idUsua = req.session.passport.user.idUsu;
      const rows2 = await pool.query('SELECT * FROM gantt', [idUsua]);
      console.log(rows2[0].categoria_01);
      const filtro_1 = rows2[0].filtro_1;
      const filtro_2 = rows2[0].filtro_2;


      const categoria_01 = rows2[0].categoria_01;
      const categoria_02 = rows2[0].categoria_02;
      const categoria_03 = rows2[0].categoria_03;
      const categoria_04 = rows2[0].categoria_04;
      const parametro_nivel = rows2[0].parametro_nivel;
      const parametro_fecha = rows2[0].parametro_fecha;


      var nom = req.session.passport.user.fullname;
      var nom2 = req.session.passport.user.username;

      const idUsu = req.session.passport.user.idUsu;
      if (req.session.passport.user.tipoUsuario == "Administrador") {
        res.render('config', {
          alert: true,
          alertTitle: "¡Correcto!",
          alertMessage: "¡Datos correctamente editados!",
          alertIcon: 'success',
          showConfirmButton: false,
          ruta: 'config',
          nom,
          nom2,
          idUsu, filtro_1, filtro_2, categoria_01, categoria_02, categoria_03, categoria_04, parametro_nivel, parametro_fecha
        })
      }
      if (req.session.passport.user.tipoUsuario == "Editor") {
        res.render('configV3', {
          alert: true,
          alertTitle: "¡Correcto!",
          alertMessage: "¡Datos correctamente editados!",
          alertIcon: 'success',
          showConfirmButton: false,
          ruta: 'configV3',
          nom,
          nom2,
          idUsu, filtro_1, filtro_2, categoria_01, categoria_02, categoria_03, categoria_04, parametro_nivel, parametro_fecha
        })
      }
      if (req.session.passport.user.tipoUsuario == "Visualizador") {
        res.render('config', {
          alert: true,
          alertTitle: "¡Correcto!",
          alertMessage: "¡Datos correctamente editados!",
          alertIcon: 'success',
          showConfirmButton: false,
          ruta: 'config',
          nom,
          nom2,
          idUsu, filtro_v1, filtro_v2, categoria_01, categoria_02, categoria_03, categoria_04, parametro_nivel, parametro_fecha
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
      idUsua = req.session.passport.user.idUsu;
      const rows2 = await pool.query('SELECT * FROM gantt', [idUsua]);
      console.log(rows2[0].categoria_01);
      const filtro_1 = rows2[0].filtro_1;
      const filtro_2 = rows2[0].filtro_2;

      const categoria_01 = rows2[0].categoria_01;
      const categoria_02 = rows2[0].categoria_02;
      const categoria_03 = rows2[0].categoria_03;
      const categoria_04 = rows2[0].categoria_04;
      const parametro_nivel = rows2[0].parametro_nivel;
      const parametro_fecha = rows2[0].parametro_fecha;


      var nom = req.session.passport.user.fullname;
      var nom2 = req.session.passport.user.username;

      const idUsu = req.session.passport.user.idUsu;
      if (req.session.passport.user.tipoUsuario == "Administrador") {
        res.render('config', {
          alert: true,
          alertTitle: "¡Correcto!",
          alertMessage: "¡Datos correctamente editados!",
          alertIcon: 'success',
          showConfirmButton: false,
          ruta: 'config',
          nom,
          nom2,
          idUsu, filtro_1, filtro_2, categoria_01, categoria_02, categoria_03, categoria_04, parametro_nivel, parametro_fecha
        })
      }
      if (req.session.passport.user.tipoUsuario == "Editor") {
        res.render('configV3', {
          alert: true,
          alertTitle: "¡Correcto!",
          alertMessage: "¡Datos correctamente editados!",
          alertIcon: 'success',
          showConfirmButton: false,
          ruta: 'configV3',
          nom,
          nom2,
          idUsu, filtro_1, filtro_2, categoria_01, categoria_02, categoria_03, categoria_04, parametro_nivel, parametro_fecha
        })
      }
      if (req.session.passport.user.tipoUsuario == "Visualizador") {
        res.render('config', {
          alert: true,
          alertTitle: "¡Correcto!",
          alertMessage: "¡Datos correctamente editados!",
          alertIcon: 'success',
          showConfirmButton: false,
          ruta: 'config',
          nom,
          nom2,
          idUsu, filtro_v1, filtro_v2, categoria_01, categoria_02, categoria_03, categoria_04, parametro_nivel, parametro_fecha
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
  const { ids, nombre_pedido, fecha, pesos, largos, listado_largos, listado_pesos, urn_actual } = req.body;
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
      res.send(error);
    } else {
      console.log("gUARDADO EL PEDIDO");
      console.log(newSelect);
      res.send("ok guardado");
    }
  });
})

//*******peso nivel 1*************************** */
router.post('/peso_nivel_1', isLoggedIn, async (req, res) => {
  const categorias = { uno } = req.body;
  console.log("VALOR PESO 1 " + req.body);
  await pool.query('UPDATE pesos_nivel set ? WHERE id = ?', [categorias, 1], async (error, results) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Registro peso nivel 1 Exitoso " + categorias.pesos_nivel);
    }
  });
})



//eliminarAsignacionInterna
router.post('/eliminarAsignacionInterna', isLoggedIn, async (req, res) => {
  const consulta= { namep } = req.body;
  
  //newUser.password = await helpers.encryptPassword(password);

  await pool.query('DELETE FROM  proyectos_usuario WHERE  namep = "'+consulta.namep+'"', async (error, results) => {
    if (error) {
      console.log(error);
    } else {
      console.log(" PEDIDO eliminado");
      console.log(consulta);
      res.redirect('/proyectos');
    }
  });
})

////// ELIMINAR ASIGNACION DE PROYECTO eliminarAsignacion
router.post('/eliminarAsignacion', isLoggedIn, async (req, res) => {
  const consulta= { nameusuario,namep } = req.body;
  
  //newUser.password = await helpers.encryptPassword(password);

  await pool.query('DELETE FROM  proyectos_usuario WHERE  nameusuario = "'+consulta.nameusuario+'" AND namep = "'+consulta.namep+'"', async (error, results) => {
    if (error) {
      console.log(error);
    } else {
      console.log(" PEDIDO eliminado");
      console.log(consulta);
      res.redirect('/proyectos');
    }
  });
})


////// BUSQUEDA DE PROYECTOS ASIGNADOS //

router.post('/getProyectosAsignados',isLoggedIn,async(req,res)=>{
  console.log("consulto proyectos asignados IN");
 console.log(req.session.passport.user);

  if (req.session.passport.user.tipoUsuario == "Administrador" ||req.session.passport.user.tipoUsuario == "Editor" || req.session.passport.user.tipoUsuario =="Visualizador") {
   const nombreusuario = req.session.passport.user.username;
   console.log("NOMBRE USUARIO LOGUEADOD");
   console.log(nombreusuario);
   
   var rows = await pool.query('SELECT * FROM proyectos_usuario WHERE nameusuario = "'+ nombreusuario+'"');
   console.log("RESULTADO PROYECRTOS ASIGNADOS");
console.log(rows);
   res.send(rows);
  }
  

});


//data: JSON.stringify({ 'nombreUsuario': nombreUsuAsig,'idAsignado':usuarioAsig,
//   'urnAsignado':proyectoAsig,'nombreProyecto':nombreProyAsig}),
///////////////insercion de asignacion usuario proyecto///////////////////////////////////////
router.post('/CargarAsignacion', isLoggedIn, async (req, res) => {
  const { nameusuario, usuario, urn, namep } = req.body;
  const newSelect = {
    nameusuario,
    usuario,
    urn,
    namep
  };
  const consulta ={nameusuario,namep};
  //newUser.password = await helpers.encryptPassword(password);
  console.log("ENVIADO ADD ORDENES");

  var rows = await pool.query('SELECT * FROM proyectos_usuario WHERE nameusuario = "'+consulta.nameusuario+'" AND namep = "'+consulta.namep+'"');
  if (rows.length==0) {
    await pool.query('INSERT INTO  proyectos_usuario set ?', [newSelect], async (error, results) => {
      console.log("Inserto - No existe");
      console.log(consulta);
      if (error) {
        console.log("error ADD ORDENES");
        console.log(error);
      } else {
        res.redirect('/proyectos');
  
      }
    });
  }else{
    console.log(rows);
    console.log("EXISTE E");
  }
 
})

//***************************************************** */

router.post('/saveAddOrdenes', isLoggedIn, async (req, res) => {
  const { nombre_pedido, cantidad, diametro, largo,urn } = req.body;
  const newSelect = {
    nombre_pedido,
    cantidad,
    diametro,
    largo,
    urn
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
  idUsua = req.session.passport.user.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.passport.user.fullname = rows2[0].fullname;
  var nom = req.session.passport.user.fullname;
  //guardo los datos de la tabla en datavista
  const { nombre, ids } = req.body;
  const datavista = await pool.query('SELECT * FROM pedido');
 
    console.log("GET IDS PLAN");
    res.send(datavista);
    console.log("GET IDS PLAN");
    console.log(datavista);


});
/////////////////////// GET ORDENES ADICIONALES/////////
router.post('/getAdicionalesOrdenes', isLoggedIn, async (req, res, next) => {
  console.log("entro");
  idUsua = req.session.passport.user.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.passport.user.fullname = rows2[0].fullname;
  var nom = req.session.passport.user.fullname;
  //guardo los datos de la tabla en datavista
  const newSelect = req.body.nombre_actual;
  console.log(newSelect);
  console.log(req.body.nombre_actual);

  const datavista = await pool.query('SELECT * FROM adicionales_pedidos WHERE nombre_pedido =?', [newSelect]);
  if (true) {
    console.log("GET DIAMETROS");
    res.send(datavista);
    console.log("GET DIAMETROS");
    console.log(datavista);
  }

});

//////////////////////////////////////////////////////////
/// eliminar

router.post('/deleteOrdenes', isLoggedIn, async (req, res) => {
  const { ids } = req.body;
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
      res.send("Ok Pedido Eliminado");
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
  idUsua = req.session.passport.user.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.passport.user.fullname = rows2[0].fullname;
  req.session.passport.user.username = rows2[0].username;
  var nom = req.session.passport.user.fullname;
  var nom2 = req.session.passport.user.username;
  const idUsu = req.session.passport.user.idUsu;
  if (req.session.passport.user.tipoUsuario == "Administrador") {
    res.render('profile', { nom, nom2 });
  }
  if (req.session.passport.user.tipoUsuario == "Editor") {
    res.render('profileV3', { nom, nom2 });
  }
  if (req.session.passport.user.tipoUsuario == "Visualizador") {
    res.render('profileV2', { nom, nom2, idUsu });
    console.log(idUsu);
  }
})

getConfigViewParams = async (req) => {
  const userRows = await pool.query('SELECT * FROM users WHERE idUsu = ?', [req.session.passport.user.idUsu]);
  const filtrosRows = await pool.query('SELECT * FROM filtros WHERE id = ?', [1]);
  const ganttRows = await pool.query('SELECT * FROM gantt', [req.session.passport.user.idUsu]);
  return {
    nom: userRows[0].fullname,
    filtro_1: filtrosRows[0].filtro_1,
    filtro_2: filtrosRows[0].filtro_2,
    filtro_3: filtrosRows[0].fierro,
    filtro_v2: "",
    categoria_01: ganttRows[0].categoria_01,
    categoria_02: ganttRows[0].categoria_02,
    categoria_03: ganttRows[0].categoria_03,
    categoria_04: ganttRows[0].categoria_04,
    parametro_fecha: ganttRows[0].parametro_fecha
  }
}

router.get('/config', isLoggedIn, async (req, res, next) => {

  idUsua = req.session.passport.user.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.passport.user.fullname = rows2[0].fullname;
  req.session.passport.user.username = rows2[0].username;
  var nom = req.session.passport.user.fullname;
  var nom2 = req.session.passport.user.username;
  if (req.session.passport.user.tipoUsuario == "Administrador") {
      res.render('config', await getConfigViewParams(req));
      next();
  }
  if (req.session.passport.user.tipoUsuario == "Editor") {
    res.render('configV3', await getConfigViewParams(req));
    next();
}
  
});

router.post('/profile', isLoggedIn, async (req, res) => {
  idUsua = req.session.passport.user.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.passport.user.fullname = rows2[0].fullname;
  req.session.passport.user.username = rows2[0].username;
  var nom = req.session.passport.user.fullname;
  var nom2 = req.session.passport.user.username;

  const idUsu = req.session.passport.user.idUsu;
  if (req.session.passport.user.tipoUsuario == "Administrador") {
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
      if (password2 != "" && password != "") {
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

  if (req.session.passport.user.tipoUsuario == "Editor") {
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
            res.render('profileV3', {
              alert: true,
              alertTitle: "¡Correcto!",
              alertMessage: "¡Datos correctamente editados!",
              alertIcon: 'success',
              showConfirmButton: false,
              ruta: 'profileV3',
              nom,
              nom2
            })
          }
        });
        console.log("full y user");
        console.log(newUser);

      }
      if (password2 != "" && password != "") {
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
              res.render('profileV3', {
                alert: true,
                alertTitle: "¡Correcto!",
                alertMessage: "¡Datos correctamente editados!",
                alertIcon: 'success',
                showConfirmButton: false,
                ruta: 'profileV3',
                nom,
                nom2
              })
            }
          });
          console.log("full, user y pass");
          console.log(newUser);
        }
        else {

          res.render('profileV3', {
            alert: true,
            alertTitle: "¡Ups!",
            alertMessage: "¡La contraseña debe ser mayor a 6 y menor a 15 caracteres!",
            alertIcon: 'error',
            showConfirmButton: false,
            ruta: 'profileV3',
            nom,
            nom2
          })
        }
      }
    }
    if (password != password2) {

      res.render('profileV3', {
        alert: true,
        alertTitle: "¡Ups!",
        alertMessage: "¡Las contraseñas no coinciden, vuelva a intentar!",
        alertIcon: 'error',
        showConfirmButton: false,
        ruta: 'profileV3',
        nom,
        nom2
      })
    }

  }
  if (req.session.passport.user.tipoUsuario == "Visualizador") {
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
      if (password2 != "" && password != "") {
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
  idUsua = req.session.passport.user.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.passport.user.fullname = rows2[0].fullname;
  var nom = req.session.passport.user.fullname;
  var consulta_vals = "";
  var data_uso = "";

  /*var rows2 = await pool.query('SELECT * FROM lineapuntos');
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
  */

  if (req.session.passport.user.tipoUsuario == "Administrador") {


    const data = await pool.query('SELECT * FROM proyectos_usuario');

    res.render('proyectos',  { data, nom });

  }
  if (req.session.passport.user.tipoUsuario == "Editor") {
    res.render('proyectosV3', { nom });
  }
  if (req.session.passport.user.tipoUsuario == "Visualizador") {
    res.render('proyectosV2', { nom });
  }
})

router.get('/proyecto2', isLoggedIn, async (req, res, next) => {
  idUsua = req.session.passport.user.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.passport.user.fullname = rows2[0].fullname;
  var nom = req.session.passport.user.fullname;
  if (req.session.passport.user.tipoUsuario == "Administrador") {
    res.render('proyecto2', { nom });
  }
  if (req.session.passport.user.tipoUsuario == "Editor") {
    res.render('proyecto2V3', { nom });
  }
  if (req.session.passport.user.tipoUsuario == "Visualizador") {
    res.render('proyecto2', { nom });
  }
})
//Morris Charts
router.get('/chart-morris', isLoggedIn, async (req, res, next) => {
  idUsua = req.session.passport.user.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.passport.user.fullname = rows2[0].fullname;
  var nom = req.session.passport.user.fullname;
  if (req.session.passport.user.tipoUsuario == "Administrador") {
    res.render('chart-morris', { nom });
  }
  if (req.session.passport.user.tipoUsuario == "Editor") {
    res.render('chart-morrisV3', { nom });
  }
  if (req.session.passport.user.tipoUsuario == "Visualizador") {
    res.render('chart-morrisV2', { nom });
  }
})

//GANTT
router.get('/gantt', isLoggedIn, async (req, res, next) => {
  idUsua = req.session.passport.user.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.passport.user.fullname = rows2[0].fullname;
  var nom = req.session.passport.user.fullname;
  if (req.session.passport.user.tipoUsuario == "Administrador") {
    res.render('gantt', { nom });
  }
  if (req.session.passport.user.tipoUsuario == "Editor") {
    res.render('ganttV3', { nom });
  }
  if (req.session.passport.user.tipoUsuario == "Visualizador") {
    res.render('gantt', { nom });
  }
})

router.get('/prueba_gantt2', isLoggedIn, async (req, res, next) => {
  idUsua = req.session.passport.user.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.passport.user.fullname = rows2[0].fullname;
  var nom = req.session.passport.user.fullname;
  if (req.session.passport.user.tipoUsuario == "Administrador") {
    res.render('prueba_gantt2', { nom });
  }
  if (req.session.passport.user.tipoUsuario == "Editor") {
    res.render('prueba_gantt2V3', { nom });
  }
  if (req.session.passport.user.tipoUsuario == "Visualizador") {
    res.render('prueba_gantt2', { nom });
  }
})

//Flot Charts
router.get('/chart-flot', isLoggedIn, async (req, res, next) => {
  idUsua = req.session.passport.user.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.passport.user.fullname = rows2[0].fullname;
  var nom = req.session.passport.user.fullname;
  if (req.session.passport.user.tipoUsuario == "Administrador") {
    res.render('chart-flot', { nom });
  }
  if (req.session.passport.user.tipoUsuario == "Editor") {
    res.render('chart-flotV3', { nom });
  }
  if (req.session.passport.user.tipoUsuario == "Visualizador") {
    res.render('chart-flotV2', { nom });
  }
})
//ChartJS
router.get('/chart-chartjs', isLoggedIn, async (req, res, next) => {
  idUsua = req.session.passport.user.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.passport.user.fullname = rows2[0].fullname;
  var nom = req.session.passport.user.fullname;
  if (req.session.passport.user.tipoUsuario == "Administrador") {
    res.render('chart-chartjs', { nom });
  }
  if (req.session.passport.user.tipoUsuario == "Editor") {
    res.render('chart-chartjsV3', { nom });
  }
  if (req.session.passport.user.tipoUsuario == "Visualizador") {
    res.render('chart-chartjsV2', { nom });
  }
})

/// Estadisticas Modelo

router.get('/estadisticasModelo', isLoggedIn, async (req, res, next) => {
  idUsua = req.session.passport.user.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.passport.user.fullname = rows2[0].fullname;
  var nom = req.session.passport.user.fullname;

  const rows4 = await pool.query('SELECT * FROM gantt', [idUsua]);
  const categoria_01 = rows4[0].categoria_01;
  const categoria_02 = rows4[0].categoria_02;
  const categoria_03 = rows4[0].categoria_03;
  const categoria_04 = rows4[0].categoria_04;
  const parametro_nivel = rows4[0].parametro_nivel;
  const parametro_fecha = rows4[0].parametro_fecha;

  var rows3 = await pool.query('SELECT * FROM filtros WHERE id = ?', [1]);
  const filtro_1 = rows3[0].filtro_1;
  const filtro_2 = rows3[0].filtro_2;
  const filtro_3 = rows3[0].fierro;
 
  
  if (req.session.passport.user.tipoUsuario == "Administrador") {
    
    res.render('estadisticasModelo', { nom,idUsua, filtro_1, filtro_2, categoria_01, categoria_02, categoria_03, categoria_04, parametro_nivel, parametro_fecha, filtro_3 });
  }
  if (req.session.passport.user.tipoUsuario == "Editor") {
    res.render('estadisticasModeloV3', { nom, idUsua, filtro_1, filtro_2, categoria_01, categoria_02, categoria_03, categoria_04, parametro_nivel, parametro_fecha, filtro_3 });
  }
  if (req.session.passport.user.tipoUsuario == "Visualizador") {
    res.render('estadisticasModelo2', { nom,idUsua, filtro_1, filtro_2, categoria_01, categoria_02, categoria_03, categoria_04, parametro_nivel, parametro_fecha, filtro_3 });
  }
})
//Echart
router.get('/chart-echart', isLoggedIn, async (req, res, next) => {
  idUsua = req.session.passport.user.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.passport.user.fullname = rows2[0].fullname;
  var nom = req.session.passport.user.fullname;
  if (req.session.passport.user.tipoUsuario == "Administrador") {
    res.render('chart-echart', { nom });
  }
  if (req.session.passport.user.tipoUsuario == "Editor") {
    res.render('chart-echartV3', { nom });
  }
  if (req.session.passport.user.tipoUsuario == "Visualizador") {
    res.render('chart-echartV2', { nom });
  }
})
//Sparkline
router.get('/chart-sparkline', isLoggedIn, async (req, res, next) => {
  idUsua = req.session.passport.user.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.passport.user.fullname = rows2[0].fullname;
  var nom = req.session.passport.user.fullname;
  if (req.session.passport.user.tipoUsuario == "Administrador") {
    res.render('chart-sparkline', { nom });
  }
  if (req.session.passport.user.tipoUsuario == "Editor") {
    res.render('chart-sparklineV3', { nom });
  }
  if (req.session.passport.user.tipoUsuario == "Visualizador") {
    res.render('chart-sparklineV2', { nom });
  }
})
//Chart-peity
router.get('/chart-peity', isLoggedIn, async (req, res, next) => {
  idUsua = req.session.passport.user.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.passport.user.fullname = rows2[0].fullname;
  var nom = req.session.passport.user.fullname;
  if (req.session.passport.user.tipoUsuario == "Administrador") {
    res.render('chart-peity', { nom });
  }
  if (req.session.passport.user.tipoUsuario == "Editor") {
    res.render('chart-peityV3', { nom });
  }
  if (req.session.passport.user.tipoUsuario == "Visualizador") {
    res.render('chart-peityV2', { nom });
  }
})

//prueba
/*router.get('/prueba',isLoggedIn, async (req, res, next) =>{
  idUsua = req.session.passport.user.idUsu;
  var rows2 = await pool.query('SELECT * FROM users WHERE idUsu = ?', [idUsua]);
  console.log(rows2[0].fullname);
  req.session.passport.user.fullname = rows2[0].fullname;
  var nom = req.session.passport.user.fullname;
  res.render('prueba', {nom});
})*/
/*router.get('/prueba',controlador.list,(req, res, next) =>{
  res.render('prueba');
})*/
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) { return next(err); }
    res.redirect('/signin');
    console.log("cerró sesión")
  });
});




module.exports = router;