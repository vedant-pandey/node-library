const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    username: { type:String, required:true },
    password: { type:String, required:true },
    whichUser: { type:String, default: 'student' }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);