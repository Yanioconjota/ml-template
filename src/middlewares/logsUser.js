const fs = require('fs');
const path = require('path');

const logsPath = path.join(__dirname, '../logs/userLogs.log');

let logsMiddleware = (req, res, next) => {
  fs.appendFileSync(logsPath, 'USUARIO: ' + req.body.name + "\n");
  next();
}

module.exports = logsMiddleware;