const mongoose = require('mongoose');

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

module.exports = mongoose.model('Book', BookSchema);