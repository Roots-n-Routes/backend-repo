const express = require('express')
const passport = require('./Utils/Config/passport')
const session = require('express-session')
const rateLimiter = require('express-rate-limit')
const app = express()
const morgan = require('morgan');
const db = require('./Utils/MongoDb/db');
const authRoutes = require('./routes/authRoutes')
const vendorRoutes = require('./routes/vendorRoutes')
//const PaymentRoutes = require('./Routes/paymentRoutes')
const OrderRoutes = require('./routes/orderRoutes')
const ApartmentRoute = require('./routes/apartmentRoute')
const BookingRoute = require('./routes/bookingRoute')
const PORT = 4000;

db.connectToMongoDb()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(session({secret:process.env.SESSION_SECRET,resave:false,saveUninitialized:true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('tiny'))

const limiter = rateLimiter({
    windowsMs: 15 * 60  * 1000,
    max:5
})

app.use(limiter)

app.use('/auth',authRoutes)
app.use('/vendor',vendorRoutes)
//app.use('/payment',PaymentRoutes)
app.use('/orders',OrderRoutes)
app.use('/apartment',ApartmentRoute)
app.use('/bookings', BookingRoute);


app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)
})
