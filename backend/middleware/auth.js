const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.userType = decoded.userType;
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

const doctorAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.userType !== 'doctor') {
      throw new Error();
    }
    
    req.doctorId = decoded.userId;
    req.userType = decoded.userType;
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Doctor authentication required' });
  }
};

const adminMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.userType !== 'admin' && decoded.role !== 'admin') {
      throw new Error();
    }
    
    req.userId = decoded.userId;
    req.userType = decoded.userType || decoded.role;
    
    next();
  } catch (error) {
    res.status(403).json({ message: 'Admin access required' });
  }
};

module.exports = { authMiddleware, doctorAuthMiddleware, adminMiddleware };