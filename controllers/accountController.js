import express from "express"
const router = express.Router();
import bcrybtjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import Account from '../models/accountModel.js';

/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          required:
 *              - firstName
 *              - lastName
 *              - email
 *              - password
 *          properties:
 *              id:
 *                  type: integer
 *                  description: The auto-generated id of the user
 *              firstName:
 *                  type: string
 *                  description:  First name of the user
 *              lastName:
 *                  type: string
 *                  description: Last name of the user
 *              email:
 *                  type: string
 *                  description: Email of the user
 *              password:
 *                  type: string
 *                  description: Bcrybted password of the user
 *              verificationCode:
 *                  type: integer
 *                  description: code status of the account
 *              isVerified:
 *                  type: boolean
 *                  description: get defualt value of false untill user is verified
 *          example:
 *              id: 10
 *              firstName: John
 *              lastName: Doe
 *              email: john@doe.com
 *              password: 987654321
 *              verificationCode: 1234
 *              isVerified: false
 */

/**
 * @swagger
 * tags:
 *  name: Accounts
 *  description: The accounts managing API
 */

/**
 * @swagger
 * /api/account/singup:
 *  post:
 *      summary: Create a new accounts
 *      tags: [Accounts]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *      responses:
 *          201:
 *              description: The user account was successfully created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 */

router.post('/singup', (req,res) => {
    //1. Get the user credentials
    const {firstName,lastName,email,password} = req.body;

    //2. Check if email avialable
    Account.findAll({where: {email:email}})
    .then(async results => {
        if(results.length == 0){
            //3. Handle password hash
            const hash = await bcrybtjs.hash(password, 10);
            //4. Generate verivication code
            const code = Math.floor(1000 + Math.random() * 9000);
            //5. Store the new account in db
            Account.create({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hash,
                verificationCode: code,
                isVerified: false 
            })
            //6. Responese
            .then(account_created => {
                return res.status(200).json({
                    massage: account_created
                })
            })
            .catch(error => {
                return res.status(500).json({
                    massage: error
                })
            })

        } else {
            return res.status(401).json({
                massage: 'Username is not available, please try another email'
            })
        }
    })
    .catch(error => {
        return res.status(500).json({
            massage: error
        })
    })
});

/**
 * @swagger
 * /api/account/users:
 *  get:
 *      summary: Return the list of all users
 *      tags: [Accounts]
 *      responses:
 *          200:
 *              description: The list of the users
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/User'
 */
router.get('/users', (req,res) => {
    Account.findAll()
    .then(results => {
        return res.status(200).json({
            message: results
        })
    })
    .catch(error => {
        return res.status(500).json({
            massage: error,
        });
    });
});

/**
 * @swagger
 * /api/account/deleteAccount/{id}:
 *  delete:
 *      summary: Delete an account by id
 *      tags: [Accounts]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *            required: true
 *            description: The user id
 *      responses:
 *          200:
 *              description: The user account was deleted
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 */

router.delete('/deleteAccount/:id', (req,res) => {
    const userId = req.params.id;
    Account.findByPk(userId)
    .then(results => {
        return results.destroy().then((account) => {
            return res.status(200).json({
                message: account,
            })
        })
    })
    .catch(error => {
        return res.status(500).json({
            message: error
        })
    })
})

router.post('/verify', (req,res) => {});

router.post('/login', (req,res) => {});



export default router