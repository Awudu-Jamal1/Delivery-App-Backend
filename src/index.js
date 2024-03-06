const express = require("express");
const http = require("http");
const bodyParse = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const { sequelize } = require("./models");
const { Server } = require("socket.io");
const { Order,Order_Item,Agent,User} = require("../src/models")
const dotenv =require('dotenv')
dotenv.config()



const Port =process.env.PORT

const app = express();
app.use(bodyParse.json());
app.use(cors());
app.use(morgan("combined"));

//Importing routes
const accounts = require("./routes/account");
const transaction = require("./routes/transaction");
const { Op } = require("sequelize");

//using routes
app.use("/user", accounts);
app.use("/order", transaction);
const server = http.createServer(app);
const io = new Server(server
  , {
  cors: {
    origin:
    "*",
    methods: ['GET', "POST", "PUT", "DELETE"],
    credentials: true
  },
});

io.on('connection',(socket) => {
  console.log("a user connected: ", socket.id)


  socket.on('update',async (data) => {

    const {id,status,agent} =data
    console.log(id,status,agent)
    const check = await Order.findOne({where:{id:id}})
    if(check.dataValues.status !==6){

await  Order.update({status:status,agent_id:agent},{where:{id:id}})}
const orders =await Order.findAll(
{where:{status:
  {[Op.or]:[1,2,3,4]}},

  include:[{model:Order_Item,model:Agent,include:User}]})
      io.emit('update',orders)
  })

  socket.on("news", async(data) => {
      io.emit('news', data);
      console.log(data)
  })


  socket.on("disconnect", () => {
      console.log("User Disconnected: " + socket.id);
  })
})



sequelize.sync({ alter: true}).then(() => {
  server.listen(Port);
  server.on("listening", () => {
    console.log(`Listening on Port ${Port}`);
  });
});
