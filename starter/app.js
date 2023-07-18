require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const connectDB = require('./db/connect')
const authenticateUser = require('./middleware/authentication')
const authRoutes = require('./routes/auth')
const jobRoutes = require('./routes/jobs')

// extra packages

const hemlet = require('helmet')
const cros = require('cors')
const xss = require('xss-clean')
const rteLimiter = require('express-rate-limit')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);
app.use(rteLimiter({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)

}))
app.use(express.json());
app.use(hemlet())
app.use(cros())
app.use(xss())


app.get('/',(req ,res)=>{
  res.send('jobs api')
})
// routes
app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/jobs',authenticateUser,jobRoutes)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
