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

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: Operations related to sessions
 */

/**
 * @swagger
 * /sessions:
 *   get:
 *     summary: Get all sessions
 *     tags: [Sessions]
 *     security:
 *         - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of all sessions
 *         content:
 *           application/json:
 *             example:
 *               - _id: "5f4a3e68c09a1e45fd105155"
 *                 moduleName: Session 1
 *                 expirationDate: "2024-01-14T12:00:00.000Z"
 *                 musics: ["5f4a3e68c09a1e45fd105156", "5f4a3e68c09a1e45fd105157"]
 *               - _id: "5f4a3e68c09a1e45fd105158"
 *                 moduleName: Session 2
 *                 expirationDate: "2024-01-15T12:00:00.000Z"
 *                 musics: ["5f4a3e68c09a1e45fd105159", "5f4a3e68c09a1e45fd105160"]
 *       '401':
 *         description: Unauthorized, missing or invalid token
 *         content:
 *           application/json:
 *             example:
 *               error: Unauthorized
 */

/**
 * @swagger
 * /sessions:
 *   post:
 *     summary: Create a new session
 *     tags: [Sessions]
 *     security:
 *         - bearerAuth: []
 *     requestBody:
 *       description: Session creation data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               moduleName:
 *                 type: string
 *               expirationDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       '201':
 *         description: Session successfully created
 *         content:
 *           application/json:
 *             example:
 *               _id: "5f4a3e68c09a1e45fd105161"
 *               moduleName: Session 3
 *               expirationDate: "2024-01-16T12:00:00.000Z"
 *       '400':
 *         description: Bad request, session already exists or invalid data
 *         content:
 *           application/json:
 *             example:
 *               error: Session already exists
 */

/**
 * @swagger
 * /sessions/{id}:
 *   get:
 *     summary: Get a session by ID
 *     tags: [Sessions]
 *     security:
 *         - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the session to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Session retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               _id: "5f4a3e68c09a1e45fd105162"
 *               moduleName: Session 4
 *               expirationDate: "2024-01-17T12:00:00.000Z"
 *               musics: ["5f4a3e68c09a1e45fd105163", "5f4a3e68c09a1e45fd105164"]
 *       '404':
 *         description: Session not found
 *         content:
 *           application/json:
 *             example:
 *               error: Session not found
 */
/**
 * @swagger
 * /sessions/{id}:
 *   put:
 *     summary: Add music to a session by ID
 *     tags: [Sessions]
 *     security:
 *         - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the session to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Music addition data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               musicId:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Music added to session successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Music added to session successfully
 *       '400':
 *         description: Bad request, music already added or invalid data
 *         content:
 *           application/json:
 *             example:
 *               error: Music already added
 *       '404':
 *         description: Session not found
 *         content:
 *           application/json:
 *             example:
 *               error: Session not found
 */
/**
 * @swagger
 * /sessions/{id}:
 *   delete:
 *     summary: Delete a session by ID
 *     tags: [Sessions]
 *     security:
 *         - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the session to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Session deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Session removed
 *       '404':
 *         description: Session not found
 *         content:
 *           application/json:
 *             example:
 *               error: Session not found
 */
