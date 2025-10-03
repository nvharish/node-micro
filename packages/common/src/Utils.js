class Utils {
  static uuid() {
    return require('crypto').randomUUID();
  }
}

module.exports = Utils;