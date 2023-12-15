const { User, Customer, Agent, Merchant,Wallet } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config.json");

const saltRounds = 10;
function jwtSignUser(user) {
  const ONE_WEEk = 60 * 60 * 24 * 7;
  return jwt.sign(user, config.authentication.jwtSecret, {
    expiresIn: ONE_WEEk,
  });
}

module.exports = {
  async register(req, res) {

    try {
      console.log(req.body);
      const { role, firstName, lastName, email, password, phone, address } =
        req.body.user.User;
      const roles = req.body.user.roles;

      const salt = await bcrypt.genSalt(10);
      const pass = await bcrypt.hash(password, salt);
      const contact = parseInt(phone);
      const user = await User.create({
        role: role,
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: pass,
        phone: contact,
        address: address,
      });
      const userJson = user.toJSON();
      let Id = userJson.id;
let wallet =await Wallet.create({
  user_id:Id,
  balance:0
})

      if (role === "Customer") {
        let customer = await Customer.create({ user_id: Id });
        return res.send({ user: userJson, token: jwtSignUser(userJson) });
      } else if (role === "Merchant") {
        const { business_name, business_address } = roles;
        await Merchant.create({
          user_id: Id,
          business_name: business_name,
          business_address: business_address,
        });
        return res.send({ user: userJson, token: jwtSignUser(userJson) });
      } else {
        const { vehicle_number } = roles;
        await Agent.create({
          user_id: Id,
          vehicle_number: vehicle_number,
        });
        return res.send({ user: userJson, token: jwtSignUser(userJson) });
      }
    } catch (error) {
      res.status(500).send({
        error: "Unable to Signup",
      });
      console.log(error);
    }
  },

  async login(req, res) {
    try {
      console.log(req.body)
      const { role, email, password } = req.body;
      console.log(role)
      let roles;
      if (role === "Customer") {
        roles = Customer;
      } else if (role === "Merchant") {
        roles = Merchant;
      } else {
        roles = Agent;
      }

      let user = await User.findOne({
        where: { email: email },
        include: [roles],
      });

      if (!user) {
        return res.status(403).send({
          error: "Email Does not Exist",
        });
      }

      const isValidate = await bcrypt.compare(password, user.password);
      if (!isValidate) {
        return res.status(403).send({
          error: "wrong Password",
        });
      }

      const userJson = user.toJSON();
      console.log(userJson)
      res.send({ user: userJson, token: jwtSignUser(userJson) });
    } catch (error) {
      res.status(403).send({
        error: "Login error",
      });
    }
  },
};
