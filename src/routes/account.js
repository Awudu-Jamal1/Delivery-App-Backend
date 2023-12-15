const express =require('express')
const router =express.Router()

const account =require('../controller/account')
const authentication = require('../policies/authentication')
const wallet =require("../controller/walletInfo")

router.post("/signup",authentication.register,account.register)
router.post('/login',account.login)
router.get("/wallet",wallet.info)

module.exports =router