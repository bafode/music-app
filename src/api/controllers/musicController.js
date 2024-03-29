const asyncHandler = require('express-async-handler')
const axios =require("axios")
const Music = require("../models/musicModel");

exports.listAllMusic =asyncHandler(
    async(req, res) => {

      const pageSize = 10
      const page = Number(req.query.pageNumber) || 1

      const query = {};
      if(req.query.search) {
        query.title = { $regex: req.query.search, $options: 'i' };
      }
      if (req.query.session && req.query.session != 'All') {
        query.session = req.query.session;
      }  

        const count = await Music.countDocuments(query)
        
        console.log(query)
        const musics = await Music.find(query)
        .sort({ rating: -1 })
        .limit(pageSize)
        .skip(pageSize * (page - 1))  
        
        res.json({ musics, page, pages: Math.ceil(count / pageSize) })
    
        }) 

exports.createAMusiic =asyncHandler(
    async (req, res) => {
        const {title,artist,link}=req.body
        const newMusic = new Music({
            title:title,
            artist:artist,
            link:link,
        });
        
        const createdMusic = await newMusic.save();
        if(!createdMusic){
          res.status(500).json({message:"internal server error"})
        }
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
            res.status(404).json({message:'Music not found'})
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
            res.status(404).json({message:'Music not found'})
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
           res.status(200).json({ message: 'Music removed' })
         } else {
           res.status(404).json({message:'Music not found'})
         }
        }
) 


exports.createMusicVote =asyncHandler(
    async (req, res) => {

        const { rating, comment } = req.body

  const music = await Music.findById(req.params.id)

  if (music) {
    const alreadyVoted = music.votes.find(
      (v) => v.user.toString() === req.user._id.toString()
    )

    if (alreadyVoted) {
      res.status(400).json({message: 'you have already voted for this music'})   
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }

    music.votes.push(review)

    music.numVote = music.votes.length

    music.rating =
      music.votes.reduce((acc, item) => item.rating + acc, 0) /
      music.votes.length

    await music.save()
    res.status(201).json({ message: 'vote added' })
  } else {
    res.status(404).json({message:'Music not found'})
  }
}) 


exports.topMusics = asyncHandler(async (req, res) => {
    const musics = await Music.find({}).sort({ rating: -1 }).limit(20)
    res.json(musics)
  })



const getSpotifyAccessToken = asyncHandler(async () => {
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  
    const url = process.env.SPOTIFY_ACCESS_TOKEN_URL;
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(
           client_id + ':' + client_secret
          ).toString('base64'),
      },
    };
  
    const body ={
      grant_type: "client_credentials",
      redirect_uri: process.env.SPOTIFY_REDIRECT_URL,
    };
  
    try {
      const { data } = await axios.post(url, body, config);
      return data
    } catch (error) {
      console.error('Error fetching token from Spotify:', error.message);
    }
  });

  
  exports.getMusicFromSpotify = asyncHandler(async (req, res) => {
    const query=req.query.search
    const url=`${process.env.SPOTIFY_SEARCH_ENDPOINT}?q=${query}&type=track&limit=10`
    const token=await getSpotifyAccessToken()
    const config = {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    }

    const { data } = await axios.get(url, config)
    if(!data){
      res.status(500).json({message:"Error occured while fetching music from spotify api"})
    }
    const results=data.tracks.items.map((t)=>{
      return{
        title:t.name,
        artist:t.artists.map((a)=>a.name),
        link:t.preview_url
      }
    })
    res.status(200).json({results})
  });