const verifyRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.user?.roles) return res.sendStatus(403);
    const roles = [...allowedRoles];
    const result = req.user.roles.map(role => roles.includes(role)).find(value => value === true);
    if (!result) return res.sendStatus(403);
    next();
  };
};
module.exports = verifyRole;