const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const Contact = require('./models/contact');

const app = express();
app.use(bodyParser.json());

sequelize.sync({ force: true })  // For initial table creation
    .then(() => console.log("Database synced!"))
    .catch(err => console.error("Failed to sync database: ", err));

// Placeholder routes
app.use('/identify', require('./routes/identify'));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
