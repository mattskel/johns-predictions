require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes');
const questionRoutes = require('./routes/questions');
const prospectiveRoutes = require('./routes/prospectives');
const predictionRoutes = require('./routes/predictions')

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// routes
app.use('/api/users', routes);
app.use('/api/user', routes)
app.use('/api/questions', questionRoutes);
app.use('/api/prospectives', prospectiveRoutes);
app.use('/api/predictions', predictionRoutes);

// connect to the db
const url = process.env.MONGO_URL;
mongoose.connect(url);
const connection = mongoose.connection;
connection.once('open', () => {
	console.log('MongoDB database connection established successfully');
});

app.listen(port, () => {
	console.log(`Server is running on port: ${port}`);
});
