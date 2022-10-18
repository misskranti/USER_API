const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const middleware = require('../middleware/auth');

//------------------------RESTFUL API's----------------------------------------------------//

                //---POST METHOD----//
router.post('/user', userController.createUser);
router.post('/login', userController.loginUser);

                //----GET METHOD-----//
router.get('/user',middleware.authenticate,userController.getAllUser);

                //----PUT METHOD----//
router.put('/user/:userId',
    middleware.authenticate,
    middleware.authorise,
    userController.updateUser);

                //---DELETE METHOD----//
router.delete(
  '/user/:userId',
  middleware.authenticate,
  middleware.authorise,
  userController.deleteByParams
);


module.exports = router;