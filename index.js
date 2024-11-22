const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const schoolRoute = require('./Routes/school');

const app = express();
const PORT = process.env.PORT


app.use(express.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use('/',schoolRoute);

app.listen(PORT)