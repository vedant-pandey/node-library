const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    name: { type:String, required:true },
    author: { type:String, required:true },
    issuedBy: { 
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        name: String
     }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);