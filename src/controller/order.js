const { Op } = require("sequelize");
const { Order, Order_Item ,Trip,Agent,User} = require("../models");
const shortId = require("short-unique-id");
const uid = new shortId({ length: 10 });

module.exports = {
  async placeOrder(req, res) {
    try {
      const { transaction_id, role,reciever_no,reciever_name, Total_price, From, To, status, type,weight } = req.body.order;
      const { product_name, quantity } = req.body.item;
      console.log(req.body.order)

      const roles = type === "Customer" ? "customer_id" : "merchant_id";
      const ordered = await Order.create({
        transaction_id: transaction_id,
        reciever_name: reciever_name,
    reciever_no: reciever_no,
        [roles]: role,
        total_price: Total_price,
        order_location: From,
        delivery_location: To,
        status: status,
        type: type,
        weight:weight
      });

      const items = await Order_Item.create({
        product_name: product_name,
        quantity: quantity,
        price: Total_price,
        order_id: ordered.id,
      });
      res.send({ order: ordered, order_items: items });
    } catch (error) {
      console.log(error);
    }
  },
  async getAll(req,res){

    try {

        const orders =await Order.findAll({where:{
            status:1
        },include:[Order_Item]})

        res.send({orders:orders})
    } catch (error) {
        console.log(error)

    }
  } ,
  async historyA(req,res){
const {id} =req.query
    try {

        const orders =await Order.findAll({where:{
            agent_id:id
        },include:[Order_Item]})

        res.send({orders:orders})
    } catch (error) {
        console.log(error)

    }
  },
  async getOrder(req,res){

    try {
        const {type,Id}=req.query
        const roles = type === "Customer" ? "customer_id" : "merchant_id";
        const orders =await Order.findAll({where:{status:
          {[Op.or]:[1,2,3,4]},
            [roles]:Id
        },include:[{model:Order_Item,model:Agent,include:User}]})
        res.send({orders:orders})
    } catch (error) {
        console.log(error)

    }
  },async updated(req,res){

    try {
      const {id,status,agent} =req.body
      console.log(id, status,agent )


await  Order.update({status:status,agent_id:agent},{where: {id:id}})
      res.send('Updated')

    } catch (error) {
      res.send(error)
    }
  }, async active(req,res){
const {id} =req.query
    try {
        const orders =await Order.findAll({where:{status:
        {[Op.or]:[2,3]},agent_id:id
        },include:[Order_Item]})
        res.send({orders:orders})
    } catch (error) {
        console.log(error)

    }
  }
  ,async track(req,res){


    try {
        const {id}=req.params
        // const roles = type === "Customer" ? "customer_id" : "merchant_id";
        const orders =await Order.findOne({where:{
            transaction_id:id
        },include:[Order_Item]})
        res.send({orders:orders})
    } catch (error) {
        console.log(error)

    }
  },

  async cancelOrder(req,res){
    try {
        const {transaction_id,status,trip,id}=req.body
        if(status ==="delivered"){
          await Trip.update({no_trip:trip},{
            where:{agent_id:id}
          })
        }
        await Order.update({status:status},{
            where:{
                transaction_id:transaction_id
            }
        })
        res.status(200).send("succesfully Cancelled")
    } catch (error) {
        console.log(error)
    }

  },
  async agentShow(req,res){
    try {
      const{Id}=req.body
      const trip=await Trip.findOne({where:{agent_id:Id}})

      const trips= trip.no_trip >= 5?"denied":'allowed'

        const orders = await Order.findAll({where:{status:'placed'},include:Order_Item})
        res.send(orders,trips)
    } catch (error) {
        console.log(error)
    }
  },async status(req,res){
    try {
        const {id,transaction_id,status}=req.body
        await Order.update({status:status,agent_id:id},{
            where:{
                transaction_id:transaction_id
            }
        })
        res.status(200).send("succesfully Accepted")
    } catch (error) {
        console.log(error)
    }

  }

};
