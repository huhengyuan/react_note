const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: API endpoints for managing users
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       '200':
 *         description: Successful response
 */
router.get('/users', (req, res) => {
    // 实现获取用户的逻辑
    res.send('Get all users');
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successful response
 */
router.get('/users/:id', (req, res) => {
    // 实现获取单个用户的逻辑
    const userId = req.params.id;
    res.send(`Get user with ID ${userId}`);
});


// 登录
/**
 * @swagger
 * /login:
 *   post:
 *     tags: [Users]
 *     summary: "用户登录接口"
 *     consumes:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - userId
 *               - password
 *     responses:
 *       '200':
 *         description: Successful response
 */
router.post('/login', (req, res) => {
    res.send('login OK')
})

module.exports = router;



// const express = require('express')
// // 创建路由对象
// const router = express.Router()

// // 注册新用户
// router.post('/reguser', (req, res) => {
//     res.send('reguser OK')
// })




// /**
//  * @swagger
//  * /users:
//  *   get:
//  *     summary: Get all users
//  *     responses:
//  *       '200':
//  *         description: Successful response
//  */
// router.get('/users', (req, res) => {
//     // 实现获取用户的逻辑
//     res.send('Get all users');
// });


// /**,
//  * @swagger
//  * /test:
//  *    get:
//  *      tags:
//  *      - 小程序端
//  *      summary: 提交考试答案
//  *      produces:
//  *      - application/json
//  *      responses:
//  *        200:
//  *          description: successful operation
//  *          schema:
//  *            ref: #/definitions/Order
//  *        400:
//  *          description: Invalid ID supplied
//  *        404:
//  *          description: Order not found
//  * */
// router.get("/test", function (req, res, next) {
//     res.send("get 提交");
// });

// // 将路由对象共享出去
// module.exports = router