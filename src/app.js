const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const cron = require('node-cron');
const mongoose = require('mongoose');
const sessionModel = require('./api/models/sessionModel');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect('mongodb://mongo/music-api-node', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected'.cyan.bold);
}).catch(err => {
  console.error('MongoDB connection error:', err.message.red);
  process.exit(1); // Exit with failure
});

// Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cron job
cron.schedule('* * * * *', async () => {
  try {
    const currentDate = new Date();
    await sessionModel.deleteMany({ expirationDate: { $lt: currentDate } });
    console.log('Expired sessions deleted successfully.'.green);
  } catch (error) {
    console.error('Error deleting expired sessions:'.red, error);
  }
});

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
