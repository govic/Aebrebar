const path = require('path');
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const validator = require('express-validator');
const passport = require('passport');

const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');


const { database } = require('./public/js/keys');


const PORT = process.env.PORT || 3000;
const config = require('./config');
if (config.credentials.client_id == null || config.credentials.client_secret == null) {
    console.error('Missing FORGE_CLIENT_ID or FORGE_CLIENT_SECRET env. variables.');
    return;
}



//initializations
let app = express();
require('./public/js/passport');


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '50mb' }));
app.set('view engine', 'ejs');
// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'faztmysqlnodemysql',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());


app.use('/api/forge/oauth', require('./routes/oauth'));
app.use('/api/forge/oss', require('./routes/oss'));
app.use('/api/forge/modelderivative', require('./routes/modelderivative'));
app.use(require('./routes/authentication'));
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode).json(err);
    app.locals.user = req.user;
    app.locals.success = req.flash('success');
    next();
});


//starting the server
app.listen(PORT, () => { console.log(`Server listening on port ${PORT}`); });
// To facilitate launching web browser
console.log('http://localhost:' + PORT)
