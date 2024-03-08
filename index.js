import express from "express"
import dotenv from 'dotenv';
import swaggerJSDoc from "swagger-jsdoc";
import SwaggerUi from 'swagger-ui-express';
import accountController from './controllers/accountController.js'
import database from './services/database.js';

dotenv.config();
const app = express();

app.use(express.urlencoded({extended : false}));
app.use(express.json());



const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'FindScooter API Documentation',
            version: '1.0.0',
            description: 'This is my first Swagger documentation'
        },
    },
    apis: ['./controllers/accountController.js']
}


const  swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', SwaggerUi.serve,SwaggerUi.setup(swaggerDocs));



app.use('/api/account',accountController);

const port = process.env.PORT;

database
.sync()
.then(results => {
    app.listen(port, () => {
        console.log(`Server is running via port ${port}`);
    })
})
.catch(error => {
    console.log(error);
})