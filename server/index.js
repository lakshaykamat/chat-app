const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDatabase = require("./config/mongo.js");
const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler.js");
const notFound = require("./middleware/notFound.js");
const socketIo = require("socket.io");

const PORT = process.env.PORT || 5000;
const app = express();
connectDatabase();

// Middleware for logging HTTP requests
app.use(morgan("dev"));
app.use(cors());

// Middleware for parsing JSON and URL-encoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for redirecting "/" to "/api/v1"
app.get("/", (req, res) => {
  res.redirect("/api/v1");
});

// Routes
app.use("/api/v1", routes);

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

// const io = require("socket.io")(server,{
//     pingTimeout:60000,
//     cors:{
//         origin:"http://localhost:5173"
//     }
// })

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

        socket.in(user._id).emit('message recieved',newMessage)
    })
  })
});
