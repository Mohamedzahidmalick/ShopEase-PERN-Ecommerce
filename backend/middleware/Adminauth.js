const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const Authheader = req.headers.authorization;

  if (!Authheader)
    return res.status(401).json({
      message: "No token",
    });

    if(!Authheader.startsWith("Bearer")){
        return res.status(401).json({
            message: "Bad token format",
        });
    }
    const token=Authheader.split(" ")[1];

    if(!token){ return res.status(401).json({
        messaeg: "Token missing",
    });
    }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    if (decoded.role !== "admin")
      return res.status(403).json({
        message: "Not Admin",
      });
    req.user = decoded;

    next();
  } catch (err) {
    console.log("JWT Error:",err);
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};
