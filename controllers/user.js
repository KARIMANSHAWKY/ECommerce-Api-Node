const User = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// get users
async function getUsers(req, res) {
  const users = await User.find().select("-passwordHash");

  if (!users) {
    res.status(500).json({ success: false });
  }

  res.send(users);
}

// add new user
async function register(req, res) {
  const passwordHash = bcrypt.hashSync(req.body.password, 10);
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone
  });
   user = await user.save();

  if (!user) {
    res
      .status(400)
      .json({ success: false, message: "user can not be created!" });
  }

  res.json({ success: true, data: user });
}

// get a single user 
async function getUserDerails(req, res) {
  const users = await User.findById(req.params.id).select("-passwordHash");

  if (!users) {
    res.status(500).json({ success: false });
  }

  res.send(users);
}


// login

async function login(req, res){
    const user = await User.findOne({email: req.body.email});

    if(!user){
      res.status(400).send("user not found");
    }

    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
      const secret = process.env.SECRET
      const token = jwt.sign(
        {
          userId: user.id,
          isAdmin: user.isAdmin
        },
        secret,
        {expiresIn: '1d'}
      )

      res.status(200).send({user: user.email, token:token});
    }else{
      res.status(400).send("password is wrong");
    }

}


module.exports = {
  getUsers,
  register,
  getUserDerails,
  login
};
