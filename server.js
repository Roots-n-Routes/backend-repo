const express = require('express')
const passport = require('./Utils/Config/passport')
const session = require('express-session')
const app = express()
const morgan = require('morgan');
const bodyParser = require('body-parser')
const db = require('./Utils/MongoDb/db');
const authRoutes = require('./Routes/authRoutes')
const vendorRoutes =require('./Routes/vendorRoutes')
const PORT = 4000;

db.connectToMongoDb()

app.use(express.json())
//app.use(express.urlencoded({extended:true}))
app.use(bodyParser.urlencoded({ extended: true }))//check this later
app.use(session({secret:process.env.SESSION_SECRET,resave:false,saveUninitialized:true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('tiny'))

app.use('/auth',authRoutes)
app.use('/vendor',vendorRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)
})
