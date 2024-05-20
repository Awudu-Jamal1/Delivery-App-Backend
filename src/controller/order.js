const { Op } = require("sequelize");
const { Order, Order_Item, Trip, Agent, User } = require("../models");
const shortId = require("short-unique-id");
const uid = new shortId({ length: 10 });

module.exports = {
  async placeOrder(req, res) {
    try {
      const { transaction_id, role, receiver_no, receiver_name, total_price, from, to, status, type, weight } = req.body.order;
      const { product_name, quantity } = req.body.item;

      const roleField = type === "Customer" ? "customer_id" : "merchant_id";
      const order = await Order.create({
        transaction_id,
        receiver_name,
        receiver_no,
        [roleField]: role,
        total_price,
        order_location: from,
        delivery_location: to,
        status,
        type,
        weight
      });

      const orderItem = await Order_Item.create({
        product_name,
        quantity,
        price: total_price,
        order_id: order.id,
      });

      return res.send({ order, order_items: orderItem });
    } catch (error) {
      console.error(error);
      return res.status(500).send("An error occurred while placing the order.");
    }
  },

  async getAll(req, res) {
    try {
      const orders = await Order.findAll({
        where: { status: "1"},
        include: [Order_Item]
      });
      console.log(orders)

      return res.send({ orders });
    } catch (error) {
      console.error(error);
      return res.status(500).send("An error occurred while fetching orders.");
    }
  },

  async historyA(req, res) {
    try {
      const { id } = req.query;
      const orders = await Order.findAll({
        where: { agent_id: id },
        include: [Order_Item]
      });

      return res.send({ orders });
    } catch (error) {
      console.error(error);
      return res.status(500).send("An error occurred while fetching the order history.");
    }
  },

  async getOrder(req, res) {
    try {
      const { type, Id } = req.query;
      const roleField = type === "Customer" ? "customer_id" : "merchant_id";

      const orders = await Order.findAll({
        where: {
          status: { [Op.or]: ["1", "2", "3","4"] },
          [roleField]: Id
        },
        include: [
          { model: Order_Item },
          { model: Agent, include: [User] }
        ]
      });

      return res.send({ orders });
    } catch (error) {
      console.error(error);
      return res.status(500).send("An error occurred while fetching the orders.");
    }
  },

  async updated(req, res) {
    try {
      const { id, status, agent } = req.body;

      await Order.update({ status, agent_id: agent }, { where: { id } });

      return res.send('Updated');
    } catch (error) {
      console.error(error);
      return res.status(500).send("An error occurred while updating the order.");
    }
  },

  async active(req, res) {
    try {
      const { id } = req.query;
      const orders = await Order.findAll({
        where: {
          status: { [Op.or]: ["2", "3"] },
          agent_id: id
        },
        include: [Order_Item]
      });

      return res.send({ orders });
    } catch (error) {
      console.error(error);
      return res.status(500).send("An error occurred while fetching active orders.");
    }
  },

  async track(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.findOne({
        where: { transaction_id: id },
        include: [Order_Item]
      });

      return res.send({ order });
    } catch (error) {
      console.error(error);
      return res.status(500).send("An error occurred while tracking the order.");
    }
  },

  async cancelOrder(req, res) {
    try {
      const { transaction_id, status, trip, id } = req.body;

      if (status === "delivered") {
        await Trip.update({ no_trip: trip }, { where: { agent_id: id } });
      }

      await Order.update({ status }, { where: { transaction_id } });

      return res.status(200).send("Successfully cancelled");
    } catch (error) {
      console.error(error);
      return res.status(500).send("An error occurred while cancelling the order.");
    }
  },

  async agentShow(req, res) {
    try {
      const { Id } = req.body;
      const trip = await Trip.findOne({ where: { agent_id: Id } });

      const tripStatus = trip.no_trip >= 5 ? "denied" : "allowed";
      const orders = await Order.findAll({ where: { status: 'placed' }, include: [Order_Item] });

      return res.send({ orders, tripStatus });
    } catch (error) {
      console.error(error);
      return res.status(500).send("An error occurred while showing agent information.");
    }
  },

  async status(req, res) {
    try {
      const { id, transaction_id, status } = req.body;

      await Order.update({ status, agent_id: id }, { where: { transaction_id } });

      return res.status(200).send("Successfully accepted");
    } catch (error) {
      console.error(error);
      return res.status(500).send("An error occurred while updating the status.");
    }
  }
};