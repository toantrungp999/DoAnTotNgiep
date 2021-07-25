class Response {
  constructor(status, data = null, message = "Success") {
    this.status = status;
    this.data = data;
    this.message = message;
  }
}

module.exports = Response;
