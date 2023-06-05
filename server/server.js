// imports
const express = require('express')
const passport = require('passport')
const cors = require('cors')
const cookieParser = require('cookie-parser')


//export
const router = require('./src/routers/user.route')
require ('./src/middlewares/passport')
//env
const { PORT } = require('./src/constants')


//initialize
const app = express()
app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use(cookieParser())
app.use(passport.initialize())
app.get('/',(req,res)=>{
    res.json({
        status:'SUCCES',
        message:'connected !'
    })
})
app.use('/api',router)


// server is listing
app.listen(PORT,()=>{console.log(`server is running in port ${PORT}`)})