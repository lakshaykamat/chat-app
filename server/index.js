const express = require("express")
const {chats} = require("./data/data.js")
const cors = require('cors')

const app = express()
app.use(cors())
const PORT = process.env.PORT || 5000
app.get("/",(req,res)=>{
    res.send("Api running")
})

app.get("/api/chat",(req,res)=>{
    console.log(chats)
    return res.json(chats)
})


app.get("/api/chat/:id",(req,res)=>{
    const { id } = req.params
    const chat =  chats.find(chat=>chat._id==id)
    res.json(chat)
})

app.listen(PORT,console.log(`Server listening on port http://localhost:${PORT}/`))