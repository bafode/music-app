const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// MongoDB connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://mongo/music-api-node', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const userRoute = require('./api/routes/userRoute');
const sessionRoute = require('./api/routes/sessionRoute');
const musicRoute = require('./api/routes/musicRoute');

userRoute(app);
sessionRoute(app);
musicRoute(app);

// Swagger Documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NODEJS API',
      version: '1.0.0',
      description: 'A sample API for learning Node.js',
    },
    components: {
      securityDefinitions: {
        bearerAuth: {
          type: 'apiKey',
          name: 'Authorization',
          scheme: 'bearer',
          in: 'header',
        },
      },
    },
    security: {
      bearerAuth: [],
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: ['./api/routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

module.exports = app;
