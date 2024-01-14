const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let musicSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: 'Le contenu est requis'
    },
    link: {
        type: String,
        required: 'Le contenu est requis'
    },
    },
    {
     timestamps: true,
    });

module.exports = mongoose.model('Music', musicSchema);