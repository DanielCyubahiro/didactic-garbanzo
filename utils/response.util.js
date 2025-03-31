class ApiResponse {
  /**
   * @param {number} statusCode
   * @param {Array} data
   * @param {string} message
   */
  constructor(statusCode, data, message) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}
module.exports = ApiResponse;