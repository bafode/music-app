const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const voteSchema = mongoose.Schema(
    {
      name: { type: String, required: true },
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
    },
    {
      timestamps: true,
    }
  )
  

let musicSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    artist: [{
        type: String,
        required: 'Le contenu est requis'
    }],
    link: {
        type: String,
        required: 'Le contenu est requis'
    },
    votes: [voteSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numVote: {
      type: Number,
      required: true,
      default: 0,
    },
    },
    {
     timestamps: true,
    });

module.exports = mongoose.model('Music', musicSchema);