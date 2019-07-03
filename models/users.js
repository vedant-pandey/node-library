const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    username: { type:String, required:true },
    password: { type:String, required:true },
    isAdmin: { type:Boolean, default: false }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);