const Respones = require("./Respones");

class NotFound extends Respones {
  constructor(message = "NotFound") {
    const status = 404;
    const data = null;
    super(status, (data = null), message);
  }
}

module.exports = NotFound;
