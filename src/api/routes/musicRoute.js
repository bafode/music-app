module.exports = (server) => {
    const musicController = require("../controllers/musicController");
    const authMiddleware=require("../middleware/authMiddleware")
    
    server.route("/musics")
    .all(authMiddleware.protect)
    .get(musicController.listAllMusic)
    .post(musicController.createAMusiic);

    server.route('/musics/top').get(musicController.topMusics)

    server.route("/musics/:id")
    .all(authMiddleware.protect)
    .get(musicController.getMusic)
    .put(musicController.updateMusic)
    .delete(musicController.deleteMusic)

    server.route('/musics/:id/votes').post(authMiddleware.protect, musicController.createMusicVote)
   
}