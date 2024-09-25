const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database'); 
require('dotenv').config();
const helmet = require('helmet');
const morgan = require('morgan');



const sessionRoutes = require('./routes/session-routes');
const openaiRoutes = require('./routes/openai-routes');


connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/api/v1/openai', openaiRoutes);
app.use('/api/v1/session', sessionRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error!');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
