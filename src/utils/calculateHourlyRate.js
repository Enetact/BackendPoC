const logger = require('../config/logger');

/**
 * Calculate the quote rate per hour.
 * @param {number} quoteRate The quote rate amount.
 * @param {Object} jobDuration A JobDuration object.
 * @returns {number} The calculated quote rate per hour.
 */
const calculateHourlyRate = (quoteRate = 0, jobDuration) => {
  logger.debug('utils::calculateHourlyRate');
  let totalHours = 1;

  if (jobDuration) {
    switch (jobDuration.type) {
      case 'week':
        totalHours = Number(jobDuration.unit) * 40;
        break;
      case 'day':
        totalHours = Number(jobDuration.unit) * 8;
        break;
      case 'hour':
        totalHours = Number(jobDuration.unit);
    }
  }

  return Math.round(Number(quoteRate) / totalHours);
};

module.exports = calculateHourlyRate;
