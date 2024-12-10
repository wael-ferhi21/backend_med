const allowedRoles = ["patient", "admin", "medecin"];

const verifyRoles = (...rolesToCheck) => {
  return (req, res, next) => {
   
    const userRoles = Array.isArray(req.user.role) ? req.user.role : [req.user.role];

    console.log(userRoles);  

  
    if (!userRoles.some(rol => rolesToCheck.includes(rol))) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();  
  };
};

module.exports = { allowedRoles, verifyRoles };


