const catchAsync = require('../utils/catchAsync');

/**
 * A simple publicly accessible health check endpoint. Used by load balancers, etc. to evaluate the
 * health of the component and ability to handle requests.
 */
const getHealth = catchAsync(async (req, res) => {
  res.send({
    status: 'UP',
  });
});

module.exports = {
  getHealth,
};
