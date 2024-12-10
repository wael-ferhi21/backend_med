const express = require('express');
const router = express.Router();


const verifyJWT=require('../middelware/verifyJWT');
const adminController = require('../controllers/adminController');
const {verifyRoles}=require('../middelware/verifyRoles');




router.use(verifyJWT);
router.route('/users').get( verifyRoles('admin','patient'), adminController.getUsers);         
router.route('/users/search/:query').get(verifyRoles('admin'), adminController.searchUsers); 
       
router.route('/users/update/:userId').put(verifyRoles('admin'), adminController.updateUser); 
router.route('/users/delete/:userId').delete(verifyRoles('admin'),adminController.deleteUser); 

module.exports = router;
