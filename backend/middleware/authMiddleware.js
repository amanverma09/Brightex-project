import jwt from "jsonwebtoken";
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Token exist?
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Access denied. Token missing.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded = { id, role, iat, exp }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
