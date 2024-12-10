const { User,Patient,Medecin } = require('../models/user'); 
const jwt = require('jsonwebtoken');

// pagination
async function getUsers(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query; // Pagination parameters
  
    
      const users = await User.find()
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
  
     
      const totalUsers = await User.countDocuments();
  
      res.status(200).json({
        totalUsers,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / limit),
        users,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  }



  async function searchUsers(req, res) {
    try {
      const { query } = req.params;
  
  
      if (query.length < 3) {
        return res.status(400).json({ message: "La longueur de la query doit dépasser 3" });
      }
  
     
      const foundUsers = await User.find({
        $or: [
          { email: { $regex: query, $options: 'i' } },
          { nom: { $regex: query, $options: 'i' } }, 
          { prenom: { $regex: query, $options: 'i' } }, 
          { role: { $regex: query, $options: 'i' } }, 
          
        ],
      })
        .select("-password") 
        .lean(); 
  
    
      if (foundUsers.length === 0) {
        return res.status(404).json({ message: "No user found" });
      }
  
 
      res.json(foundUsers);
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
  


  async function updateUser(req, res) {
    try {
      const { userId } = req.params;
      const updates = req.body;
  
     
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });
  
   
      let updatedUser;
      if (user instanceof Patient) {
        updatedUser = await Patient.findByIdAndUpdate(userId, updates, { new: true });
      } else if (user instanceof Medecin) {
        updatedUser = await Medecin.findByIdAndUpdate(userId, updates, { new: true });
      } else {
        updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
      }
  
      if (!updatedUser) {
        return res.status(404).json({ error: 'User update failed' });
      }
  
      res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update user' });
    }
  }
  

  async function deleteUser(req, res) {
    try {
      const { userId } = req.params;
  
    
      const user = await User.findById(userId);
  
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      let deletedUser;
      
  
      if (user instanceof Patient) {
        deletedUser = await Patient.findByIdAndDelete(userId);
      } else if (user instanceof Medecin) {
        deletedUser = await Medecin.findByIdAndDelete(userId);
      }  else {
        deletedUser = await User.findByIdAndDelete(userId); 
      }
  
      if (!deletedUser) return res.status(404).json({ error: 'Failed to delete user' });
  
      return res.status(204).json({ message: ` message:User ${deletedUser.nom} ${deletedUser.prenom} deleted successfully` });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to delete user' });
    }
  }
  





  


  module.exports={
    getUsers,
    searchUsers,
    updateUser,
    deleteUser,
   



  }


