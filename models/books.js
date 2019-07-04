const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const BookSchema = new mongoose.Schema({
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

BookSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Book', BookSchema);