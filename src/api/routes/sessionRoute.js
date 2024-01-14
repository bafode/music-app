module.exports = (server) => {
    const sessionController = require("../controllers/sessionController");
    const authMiddleware=require("../middleware/authMiddleware")
    
    server.route("/sessions")
    .all(authMiddleware.protect)
    .get(sessionController.listAllSessions)
    .post(authMiddleware.admin,sessionController.createASession);

    server.route("/sessions/:id")
    .all(authMiddleware.protect)
    .get(sessionController.getSession)
    .put(sessionController.addMusicToASession)
    .delete(authMiddleware.admin,sessionController.deleteSession)
}