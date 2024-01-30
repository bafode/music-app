const asyncHandler = require('express-async-handler')
const Session = require("../models/sessionModel");

exports.listAllSessions =asyncHandler(
    async(req, res) => {
        const sessions = await Session.find({})
        .sort({ createdAt: -1 })
        .populate(
            {
                path:'musics',
                model:'Music'
            }
            )
        res.status(200).json(sessions);
    
        }) 

exports.createASession =asyncHandler(
    async (req, res) => {
        const {moduleName,expirationDate}=req.body

        const session=await Session.findOne({moduleName:moduleName})
        if (session) {
          res.status(400)
          throw new Error('Session Already Exist')
        }
        const newSession = new Session({
           moduleName:moduleName,
           expirationDate:expirationDate
        });
        
        const createdSession = await newSession.save();
        res.status(201).json(createdSession)
        
    }
)

exports.getSession =asyncHandler(
    async (req, res) => {   
        const session = await Session.findById(req.params.id).populate(
            {
                path:'musics',
                model:'Music'
            }
            );
    
        if (session) {
            res.status(200).json(session)
        } else {
            res.status(404)
            throw new Error('Session not found')
        }  
    }
) 


exports.addMusicToASession =asyncHandler(
    async (req, res) => {
         const {
            musicId
           } = req.body
         
           console.log(req.body)
           const session = await Session.findById(req.params.id)

           if (session) {
            const alreadyAdded = session.musics.find(
              (m) => m.toString() ===musicId.toString()
            )
        
            if (alreadyAdded) {
              res.status(400).json({message:"Music already added"})
            }
    
            session.musics.push(musicId)
        
        
            await session.save()
            res.status(201).json({ message: 'Music added added' })
          } else {
            res.status(404).json({message:"Session not found"})
          }
        }   
)
  
exports.deleteSession =asyncHandler(
    async (req, res) => {

         const session = await Session.findById(req.params.id)
         if (session) {
           await Session.findByIdAndDelete(req.params.id)
           res.json({ message: 'Session removed' })
         } else {
           res.status(404)
           throw new Error('Session not found')
         }
        }
) 