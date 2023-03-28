/*const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('./DBConnection');
const helpers = require('../lib/helpers');
//signin
passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async(req, username, password, done) =>{
  const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  if (rows.length > 0) {
    const user = rows[0];
    const validPassword = await helpers.matchPassword(password, user.password)
    
    if (validPassword) {
      done(null, user,console.log(user.tipoUsuario));
    } else {
      done(null, false, console.log("Contraseña inválida"), req.flash('message', 'Incorrect Password'));  
    }
  } else {
    return done(null, false, console.log("usuario no existe"), req.flash('message', 'The Username does not exists.'));
  }
}));

//Listar

/*passport.list = (req, res) => {
  req.getConnection((err, conn) => {
    conn.query('SELECT * FROM users', (err, users) => {
     if (err) {
      res.json(err);
     }
     res.render('prueba', {
        data: users
     });
    });
  });
};*/



//signup
/*passport.use('local.signup', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {

  const { fullname } = req.body;
  let newUser = {
    fullname,
    username,
    password
  };
  newUser.password = await helpers.encryptPassword(password);
  // Saving in the Database
  const result = await pool.query('INSERT INTO users SET ? ', newUser);
  newUser.id = result.insertId;
  return done(null, newUser);
}));*/
/*
passport.serializeUser((user, done) => {
  done(null, user.id);
  
});

passport.deserializeUser(async (id, done) => {
  const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  done(null, rows[0]);
  
});

module.exports= passport; */