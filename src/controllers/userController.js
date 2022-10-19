const userModel = require('../model/userModel');
const jwt = require('jsonwebtoken');

//---------------------------------POST/USER--------------------------------------------------------------//

const createUser = async function (req, res) {
  try {
    const userData = req.body;

    const email = await userModel.findOne({ email: userData.email });

    if (Object.keys(userData).length == 0)
      return res.status(400).send({ status: false, msg: 'enter body' });

    let nameRegex = /^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/;
    let mailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
  
    let passRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

    if (!userData.fname)
      return res
        .status(400)
        .send({ status: false, msg: 'first name required' });

    if (!userData.lname)
      return res.status(400).send({ status: false, msg: 'last name required' });

    if (
      !nameRegex.test(userData.fname) ||
      !nameRegex.test(userData.lname)
    ) {
      return res
        .status(400)
        .send({ msg: 'Please enter valid characters only in fname and lname' });
    }

    if (!userData.title)
      return res.status(400).send({ status: false, msg: 'title required' });
    if (
      userData.title != 'Mr' &&
      userData.title != 'Miss'
    )
      return res.status(400).send({ status: false, msg: 'enter valid title' });

    if (!userData.email)
      return res.status(400).send({ status: false, msg: 'email required' });
      
    if (!mailRegex.test(userData.email)) {
      return res.status(400).send({ msg: 'Please enter valid mailId' });
    }
    if (email)
      return res
        .status(400)
        .send({ status: false, msg: 'email already taken' });

    if (!userData.password)
      return res.status(400).send({ status: false, msg: 'password required' });

     if (!passRegex.test(userData.password))
      return res.status(400).send({
        msg: 'Please enter a password which contains min 8 letters, at least a symbol, upper and lower case letters and a number',
      });

    const savedData = await userModel.create(userData);

    res.status(201).send({ status: true, msg: savedData });
   } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

//------------------------------------LOGIN/USER-----------------------------------------------------------//

const loginUser = async function (req, res) {
  try {
    let userName = req.body.emailId;
    if (!userName)
      return res
        .status(400)
        .send({ status: false, msg: 'please enter emailId' });

    let password = req.body.password;
    if (!password)
      return res
        .status(400)
        .send({ status: false, msg: 'please enter password' });

    let findUser = await userModel.findOne({
      email: userName,
      password: password,
    });
    if (!findUser)
      return res.status(404).send({
        status: false,
        msg: 'Email or Password is not valid',
      });

    let token = jwt.sign(
      {
        userId: findUser._id.toString(),
      },
      'project_assignment'
    );
    res.setHeader('x-api-key', token);
    res.status(200).send({ status: true, token: token });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

//---------------------------------GET?USER---------------------------------------------------//

const getAllUser = async function (req, res) {
  try {
    
      let allUsers = await userModel.find();
      res.status(200).send(allUsers);
  
  } catch (err) {
    res.status(500).send({ msg: 'Error', error: err.message });
  }
};

//-----------------------------------UPDATE/USER-------------------------------------------//

const updateUser = async function (req, res) {
  try {
    let id = req.params.userId;
    let data = req.body;
    let user = await userModel.findOne({ _id: id, isDeleted: false });
    if (Object.keys(user).length == 0) {
      return res.status(404).send('No such user found');
    }
    if (data.title) user.title = data.title;
    if (data.fname) user.fname = data.fname;
    if (data.lname) user.lname = data.lname;
    
    let updateData = await userModel.findByIdAndUpdate({ _id: id }, user, {
      new: true,
    });
    res.status(200).send({ status: true, msg: updateData });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

//-------------------------------------DELETE/USER----------------------------------------------------------//

const deleteByParams = async function (req, res) {
  try {
    let id = req.params.userId;
    const allUsers = await userModel.findOne({ _id: id, isDeleted: false });
    if (!allUsers) {
      return res
        .status(404)
        .send({ status: false, msg: 'This user is not found or deleted.' });
    }
    allUsers.isDeleted = true;
    const updated = await userModel.findByIdAndUpdate({ _id: id }, allUsers, {
      new: true,
    });
    res.status(200).send({ status: true, msg: 'Successfully Deleted' });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};



module.exports.createUser = createUser;
module.exports.loginUser = loginUser;
module.exports.getAllUser = getAllUser;
module.exports.updateUser= updateUser;
module.exports.deleteByParams = deleteByParams;