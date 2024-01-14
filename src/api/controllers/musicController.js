const asyncHandler = require('express-async-handler')
const Music = require("../models/musicModel");

exports.listAllMusic =asyncHandler(
    async(req, res) => {
        const musics = await Music.find({})     
        res.status(200).json(musics);
    
        }) 

exports.createAMusiic =asyncHandler(
    async (req, res) => {
        const {title,artist,link}=req.body
        const newMusic = new Music({
            title:title,
            artist:artist,
            link:link
        });
        
        const createdMusic = await newMusic.save();
        res.status(201);
        res.json(createdMusic);
        
    }
)

exports.getMusic =asyncHandler(
    async (req, res) => {   
        const music = await Music.findById(req.params.id)
    
        if (music) {
            res.status(200).json(music)
        } else {
            res.status(404)
            throw new Error('Music not found')
        }  
    }
) 


exports.updateMusic =asyncHandler(
    async (req, res) => {
         const {
             title,
             artist,
             link
           } = req.body
         
           const music = await Music.findById(req.params.id)
           if(!music){
            res.status(404)
            throw new Error('Music not found')
           }
         
           music.title = title
           music.artist = artist
           music.link=link

           const updatedMusic = await music.save()
           res.status(200).json(updatedMusic)
        }   
)
  
exports.deleteMusic =asyncHandler(
    async (req, res) => {

         const music = await Music.findById(req.params.id)
         if (music) {
           await Music.findByIdAndDelete(req.params.id)
           res.json({ message: 'Music removed' })
         } else {
           res.status(404)
           throw new Error('Music not found')
         }
        }
) 