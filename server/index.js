const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDatabase = require("./config/mongo.js");
const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler.js");
const notFound = require("./middleware/notFound.js");
const path = require('path')
const socketIo = require("socket.io");

const PORT = process.env.PORT || 5000;
const app = express();
connectDatabase();

// Middleware for logging HTTP requests

// CORS configuration
const corsOptions = {
  origin: 'https://chat-app-one-brown.vercel.app', // Allow requests from this origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};


app.use(morgan("dev"));
app.use(cors(corsOptions));

// Middleware for parsing JSON and URL-encoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for redirecting "/" to "/api/v1"
app.get("/", (req, res) => {
  res.redirect("/api/v1");
});

// Routes
app.use("/api/v1", routes);


// Deployment


// const __dirname1 = path.resolve()
// if(process.env.NODE_ENV == 'production'){
//     app.use(express.static(path.join(__dirname1,"/client/dist")))

//     app.get('*',(req,res)=>{
//         res.sendFile(path.resolve(__dirname1,"client","dist","index.html"))
//     })
// }

// Middleware for handling "Not Found" routes
app.use(notFound);

//Middleware for error
app.use(errorHandler);

const server = app.listen(
  PORT,
  console.log(`Server listening on port http://localhost:${PORT}/`.yellow)
);
const io = socketIo(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Web socket connected");

  socket.on('setup',(userData)=>{
    if(!userData) return
    socket.join(userData._id)
    socket.emit("connected")
  })

  socket.on('join chat',(room)=>{
    socket.join(room)
    console.log("user joined room"+room)
  })

  socket.on('new message',(newMessage)=>{
    var chat = newMessage.chat
    if(!chat.users) return console.log("Chat.users not defined")

    chat.users.forEach(user=>{
        if(user._id == newMessage.sender._id) return

        console.log("YE KE",JSON.stringify(newMessage))
        socket.in(user._id).emit('message recieved',newMessage)
    })
  })
});
