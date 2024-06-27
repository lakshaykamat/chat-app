const express = require("express")
const userRouter = require("./user")
const chatRouter = require("./chat")
const messaegeRouter = require("./message")
const isAuthenticated = require("../middleware/isAuthenticated")
const router = express.Router()

router.use("/users",userRouter)
router.use("/chat",isAuthenticated,chatRouter)
router.use("/message",isAuthenticated,messaegeRouter)
module.exports  = router