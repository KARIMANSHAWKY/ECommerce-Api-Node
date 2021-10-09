const express = require("express");
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./middlewares/error-handler')

require("dotenv/config");

// Get Routes
const productRoute = require('./routes/product');
const categoryRoute = require('./routes/category');
const orderRoute = require('./routes/order');
const userRoute = require('./routes/user');
const app = express();

app.use(cors());
app.options("*", cors());

// middleware
app.use(bodyParser.json({limit: '50mb'}));
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler)

//assign routes to app
const api = process.env.API_URL;
app.use(`${api}/products`, productRoute );
app.use(`${api}/users`, userRoute );
app.use(`${api}/categories`, categoryRoute );
app.use(`${api}/orders`, orderRoute );



// connect app to database
mongoose.connect(process.env.CONNECTION_STRING)
.then(()=>{
    console.log('connection is ready');
})
.catch(err=> console.log(err));

// listen server to port
const port = process.env.PORT
app.listen(port, ()=>{
    console.log(`server running http://localhost:${port}`);
});

