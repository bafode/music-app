const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let sessionSchema = new Schema({
    moduleName: {
        type: String,
        required: true,
        unique: true,
    },
    expirationDate: {
        type: Date,
        required: 'Le contenu est requis'
    },
    musics:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Music',
        }
    ],
    },
    {
     timestamps: true,
    });

module.exports = mongoose.model('Session', sessionSchema);