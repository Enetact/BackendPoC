/**
 * The QuoteError class represents a specific type of Error which occurs when
 * creating an insurance Quote.
 */
class QuoteError extends Error {
  /**
   * Create a new QuoteError instance.
   * @param {string} message The error message
   * @param {number} [code] An optional error code value. Default: 500.
   */
  constructor(message, code = 500) {
    super(message);
    this.name = 'QuoteError';
    this.code = code;
  }
}

module.exports = QuoteError;
