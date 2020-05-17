const fs = require('fs');

let logsMiddleware = (req, res, next) => {
  fs.writeFileSync('logs.txt', 'Se ingresó en ' + req.url);
  next();
}

module.exports = logsMiddleware;