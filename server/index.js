const express = require("express")
const morgan = require("morgan")
const bodyParser = require("body-parser")
const cors = require('cors')
const connectDatabase = require('./config/mongo.js')
const routes = require("./routes")
const errorHandler = require("./middleware/errorHandler.js")
const notFound = require("./middleware/notFound.js")


const PORT = process.env.PORT || 5000
const app = express()
connectDatabase()

// Middleware for logging HTTP requests
app.use(morgan("dev"));
app.use(cors())

// Middleware for parsing JSON and URL-encoded request bodies
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

// Middleware for redirecting "/" to "/api/v1"
app.get("/",(req,res)=>{
    res.redirect("/api/v1")
})

// Routes
app.use("/api/v1", routes);


// Middleware for handling "Not Found" routes
app.use(notFound);

//Middleware for error
app.use(errorHandler);

app.listen(PORT,console.log(`Server listening on port http://localhost:${PORT}/`.yellow))