const mongoose = require('mongoose');

const CheckInOptionsSchema = new mongoose.Schema({
    checkInOptions:{
        has_front_desk:{
        type:Boolean,
        default:false
        },
        has_virtual_frontDesk:{
        type:Boolean,
        default:false
        },
        host_will_be_present:{
        type:Boolean,
        default:false
        },
        is_self_checkIn:{
        type:Boolean,
        default:false
        },
        access_methods:{
        type:String,
        enum:['Access code','Key retrieval at property','Wi-Fi enabled smart lock', 'Other'],
        default:[]
        },
        contact_methods:{
        type:String,
        enum:['Email','Phone'],
        default:[]
        },
        contact_timeframe:{
        type:String,
        enum:[
            'Same day as arrival',
            '24 hours before arrival',
            '2 days before arrival',
            '3 days before arrival',
            '1 week before arrival'
        ],
        default:'24 hours before arrival'
        },
        age_restrictions:{
        type:String,
        enum:[
            '18 years'
        ]
        },
        check_in_time:{
        type:String,
        enum:['Noon']
        }
    },
})

module.exports = CheckInOptionsSchema;