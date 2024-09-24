const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database'); 
require('dotenv').config();

const sessionRoutes = require('./routes/session-routes');
const openaiRoutes = require('./routes/openai-routes');


connectDB();

const app = express();

app.use('/', sessionRoutes);
app.use('/', openaiRoutes);

app.use(express.json());
app.use(cors());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error!');
});

// Port Ayarlama ve Sunucuyu Başlatma
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
