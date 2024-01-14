module.exports = (server) => {
    const userController = require("../controllers/userController");
    const authMiddleware=require("../middleware/authMiddleware")

    server.route('/users').post(userController.registerUser).get(authMiddleware.protect, userController.getUsers)

    server.route('/users/login').post(userController.login)

    server.route('/users/profile')
    .all(authMiddleware.protect)
    .get( userController.getUserProfile)
    .put(userController.updateUserProfile)
   
   
    server.route('/users/:id')
    .delete(authMiddleware.protect,authMiddleware.admin, userController.deleteUser)
    .get(authMiddleware.protect,authMiddleware.admin, userController.getUserById)
    .put(authMiddleware.protect,authMiddleware.admin, userController.updateUser)
}



/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Operations related to users
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       description: User registration data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '201':
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             example:
 *               _id: "5f4a3e68c09a1e45fd105155"
 *               name: John Doe
 *               email: john@example.com
 *               isAdmin: false
 *               token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       '400':
 *         description: Bad request, user already exists or invalid data
 *         content:
 *           application/json:
 *             example:
 *               error: User already exists
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: User login
 *     tags: [Users]
 *     requestBody:
 *       description: User login data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User successfully logged in
 *         content:
 *           application/json:
 *             example:
 *               _id: "5f4a3e68c09a1e45fd105155"
 *               name: John Doe
 *               email: john@example.com
 *               isAdmin: false
 *               token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       '401':
 *         description: Unauthorized, invalid email or password
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid email or password
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *         - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of all users
 *         content:
 *           application/json:
 *             example:
 *               - _id: "5f4a3e68c09a1e45fd105155"
 *                 name: John Doe
 *                 email: john@example.com
 *                 isAdmin: false
 *               - _id: "5f4a3e68c09a1e45fd105156"
 *                 name: Jane Doe
 *                 email: jane@example.com
 *                 isAdmin: true
 *       '401':
 *         description: Unauthorized, missing or invalid token
 *         content:
 *           application/json:
 *             example:
 *               error: Unauthorized
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *         - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the user to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               _id: "5f4a3e68c09a1e45fd105155"
 *               name: John Doe
 *               email: john@example.com
 *               isAdmin: false
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               error: User not found
 */
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     security:
 *         - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the user to be updated
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: User update data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             example:
 *               _id: "5f4a3e68c09a1e45fd105155"
 *               name: John Doe
 *               email: john@example.com
 *               isAdmin: false
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               error: User not found
 */

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *         - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               _id: "5f4a3e68c09a1e45fd105155"
 *               name: John Doe
 *               email: john@example.com
 *               isAdmin: false
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               error: User not found
 */

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *         - bearerAuth: []
 *     requestBody:
 *       description: User profile update data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             example:
 *               _id: "5f4a3e68c09a1e45fd105155"
 *               name: John Doe
 *               email: john@example.com
 *               isAdmin: false
 *               token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               error: User not found
 */

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     security:
 *         - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the user to be deleted
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: User removed
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               error: User not found
 */
