const express = require('express');
const dotenv=require('dotenv')
const morgan=require('morgan')
const colors=require('colors')
const cors=require('cors')
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
var cron = require('node-cron');




const hostname = "0.0.0.0";
let port = process.env.PORT||5000



dotenv.config()

const server = express();

const mongoose = require("mongoose");
mongoose.connect("mongodb://mongo/music-api-node");

if (process.env.NODE_ENV === 'development') {
  server.use(morgan('dev'))
}

cron.schedule('* * * * *', async () => {
  console.log('running expired sessionjob every minute'.yellow);
  try {
    const currentDate = new Date();
    await sessionModel.deleteMany({ expirationDate: { $lt: currentDate } });
    console.log('Expired sessions deleted successfully.'.green);
  } catch (error) {
    console.error('Error deleting expired sessions:'.red, error);
  }
});

server.use(cors())
server.use(express.json());
server.use(express.urlencoded({extended:true}));

const userRoute = require("./api/routes/userRoute");
userRoute(server);

const sessionRoute = require("./api/routes/sessionRoute");
sessionRoute(server);

const musicRoute = require("./api/routes/musicRoute");
const sessionModel = require('./api/models/sessionModel');
musicRoute(server);

const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'NODEJS API',
        version: '1.0.0',
        description: 'A sample API for learning nodejs',
      },
      components: {
        securityDefinitions: {
            bearerAuth: {
                type: 'apiKey',
                name: 'Authorization',
                scheme: 'bearer',
                in: 'header',
            },
        }
      },
      security: {
        bearerAuth: [],
      },
      servers: [
        {
          url: 'http://localhost:5000',
        },
      ],
    },
    apis: ['./api/routes/*.js'],
  };
  
const swaggerDocs = swaggerJsDoc(swaggerOptions);
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

server.listen(port, hostname, () => {
    console.log(`Example app listening on port ${port}`)
})