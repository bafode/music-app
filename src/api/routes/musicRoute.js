module.exports = (server) => {
    const musicController = require("../controllers/musicController");
    const authMiddleware=require("../middleware/authMiddleware")
    
    server.route("/musics")
    .get(musicController.listAllMusic)
    .post(authMiddleware.protect,musicController.createAMusiic);

    server.route('/musics/top').get(musicController.topMusics)

    server.route("/spotify").get(musicController.getMusicFromSpotify)

    server.route("/musics/:id")
    .all(authMiddleware.protect)
    .get(musicController.getMusic)
    .put(musicController.updateMusic)
    .delete(musicController.deleteMusic)

    server.route('/musics/:id/votes').post(authMiddleware.protect, musicController.createMusicVote)
   
}


/**
 * @swagger
 * tags:
 *   name: Musics
 *   description: Operations related to Musics
 */
/**
 * @swagger
 * /musics:
 *   get:
 *     summary: Get all music
 *     tags: [Musics]
 *     security:
 *         - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of all music
 *         content:
 *           application/json:
 *             example:
 *               - _id: "5f4a3e68c09a1e45fd105165"
 *                 title: Song 1
 *                 artist: Artist 1
 *                 link: "https://example.com/song1"
 *                 votes: []
 *                 rating: 0
 *                 numVote: 0
 *               - _id: "5f4a3e68c09a1e45fd105166"
 *                 title: Song 2
 *                 artist: Artist 2
 *                 link: "https://example.com/song2"
 *                 votes: []
 *                 rating: 0
 *                 numVote: 0
 *       '401':
 *         description: Unauthorized, missing or invalid token
 *         content:
 *           application/json:
 *             example:
 *               error: Unauthorized
 */
/**
 * @swagger
 * /musics:
 *   post:
 *     summary: Create a new music
 *     tags: [Musics]
 *     security:
 *         - bearerAuth: []
 *     requestBody:
 *       description: Music creation data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               artist:
 *                 type: string
 *               link:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Music successfully created
 *         content:
 *           application/json:
 *             example:
 *               _id: "5f4a3e68c09a1e45fd105167"
 *               title: Song 3
 *               artist: Artist 3
 *               link: "https://example.com/song3"
 *               votes: []
 *               rating: 0
 *               numVote: 0
 *       '400':
 *         description: Bad request, music already exists or invalid data
 *         content:
 *           application/json:
 *             example:
 *               error: Music already exists
 */
/**
 * @swagger
 * /musics/{id}:
 *   get:
 *     summary: Get a music by ID
 *     tags: [Musics]
 *     security:
 *         - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the music to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Music retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               _id: "5f4a3e68c09a1e45fd105168"
 *               title: Song 4
 *               artist: Artist 4
 *               link: "https://example.com/song4"
 *               votes: []
 *               rating: 0
 *               numVote: 0
 *       '404':
 *         description: Music not found
 *         content:
 *           application/json:
 *             example:
 *               error: Music not found
 */
/**
 * @swagger
 * /musics/{id}:
 *   put:
 *     summary: Update a music by ID
 *     tags: [Musics]
 *     security:
 *         - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the music to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Music update data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               artist:
 *                 type: string
 *               link:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Music updated successfully
 *         content:
 *           application/json:
 *             example:
 *               _id: "5f4a3e68c09a1e45fd105169"
 *               title: Song 5
 *               artist: Artist 5
 *               link: "https://example.com/song5"
 *               votes: []
 *               rating: 0
 *               numVote: 0
 *       '404':
 *         description: Music not found
 *         content:
 *           application/json:
 *             example:
 *               error: Music not found
 */
/**
 * @swagger
 * /musics/{id}:
 *   delete:
 *     summary: Delete a music by ID
 *     tags: [Musics]
 *     security:
 *         - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the music to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Music deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Music removed
 *       '404':
 *         description: Music not found
 *         content:
 *           application/json:
 *             example:
 *               error: Music not found
 */
/**
 * @swagger
 * /musics/{id}/votes:
 *   post:
 *     summary: Create a vote for a music by ID
 *     tags: [Musics]
 *     security:
 *         - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the music to vote for
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Music vote data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Vote added successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Vote added
 *       '400':
 *         description: Bad request, vote already added or invalid data
 *         content:
 *           application/json:
 *             example:
 *               error: You have already voted for this music
 *       '404':
 *         description: Music not found
 *         content:
 *           application/json:
 *             example:
 *               error: Music not found
 */
/**
 * @swagger
 * /musics/top:
 *   get:
 *     summary: Get top-rated musics
 *     tags: [Musics]
 *     responses:
 *       '200':
 *         description: A list of top-rated musics
 *         content:
 *           application/json:
 *             example:
 *               - _id: "5f4a3e68c09a1e45fd105170"
 *                 title: Top Song 1
 *                 artist: Top Artist 1
 *                 link: "https://example.com/topsong1"
 *                 votes: []
 *                 rating: 4.5
 *                 numVote: 2
 *               - _id: "5f4a3e68c09a1e45fd105171"
 *                 title: Top Song 2
 *                 artist: Top Artist 2
 *                 link: "https://example.com/topsong2"
 *                 votes: []
 *                 rating: 4.0
 *                 numVote: 1
 */
