const speakeasy = require('speakeasy')
const nodeMailer = require('nodemailer')
const redis = require('redis')
require('dotenv').config()

const redisClient = redis.createClient({
    url:process.env.REDIS_URL
})

redisClient.on('error', err => console.log('Redis Client Error', err))

redisClient.connect().then(() => {
    console.log('Connected to Redis!');

    //Test Redis set/get operations
    redisClient.set('testKey', 'Redis is working!', (err, reply) =>{
         if(err) console.error('Set Error:', err);
         else console.log('Set Reply:',reply); //Should print 'OK' if working

         //Now, test getting the value
         redisClient.get('testKey', (err, value) =>{
             if(err) console.error('Get Error:', err)
                 else console.log('Get Value:', value);//Should print 'Redis is working'
         })
     }) 
});
 

//Configure nodemailer
const transporter = nodeMailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    },
});


module.exports = {redisClient,transporter}
