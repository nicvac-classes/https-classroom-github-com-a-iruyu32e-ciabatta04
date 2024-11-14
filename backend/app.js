const session = require('express-session');
const { v4: uuidv4 }=require('uuid');
const FileStore=require('session-file-store')(session);


const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();

// Configurazione EJS
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    store: new FileStore({
        path:'./session',
        ttl: 86400
    }),
    secret: 'la mia chiave segreta',
    resave: false,
    saveUninitialized: true,
    cookie:{
        maxAge: 24*60*60*1000
    }
}));

app.get('/', (req, res) => {
    if(req.session.name){
        res.render('greet', {
            message: 'Bentornato',
            name: req.session.name
        });
    }else{
        res.render('form');
    }
});

app.post('/greet', (req, res) => {
    const name = req.body.name;
    req.session.name=name;
    req.session.id=uuidv4();
    res.render('greet',{
        message:'Benvenuto',
        name: name
    })
});

app.post('/logout', (req, res) => {
    req.session.destroy((err)=>{
        if(err){
            console.log(err);
        }
        res.redirect('/');
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});