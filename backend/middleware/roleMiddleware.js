export const isCEO = (req, res, next) => {
  if (req.user.role !== "CEO") {
    return res.status(403).json({
      message: "Access denied. CEO only.",
    });
  }
  next();
};

export const isEmployee = (req, res, next) => {
  if (req.user.role !== "EMPLOYEE") {
    return res.status(403).json({
      message: "Access denied. Employee only.",
    });
  }
  next();
};
