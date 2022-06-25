const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const stateRoute = require('./state.route');
const quotationRoute = require('./quotation.route');
const jobCategoryRoute = require('./jobcategory.route');
const limitRoute = require('./limit.route');
const completeProjectRoute = require('./completeproject.route');
const jobDurationRoute = require('./jobduration.route');
const crewRoute = require('./crew.route');
const memberRoute = require('./member.route');
const policyRoute = require('./policy.route');
const paymentRoute = require('./payment.route');
const programRoute = require('./program.route');
const faqRoute = require('./faq.route');
const healthRoute = require('./health.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/health',
    route: healthRoute,
  },
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/states',
    route: stateRoute,
  },
  {
    path: '/quotes',
    route: quotationRoute,
  },
  {
    path: '/jobcategories',
    route: jobCategoryRoute,
  },
  {
    path: '/limits',
    route: limitRoute,
  },
  {
    path: '/completeprojects',
    route: completeProjectRoute,
  },
  {
    path: '/jobdurations',
    route: jobDurationRoute,
  },
  {
    path: '/crews',
    route: crewRoute,
  },
  {
    path: '/members',
    route: memberRoute,
  },
  {
    path: '/policies',
    route: policyRoute,
  },
  {
    path: '/payments',
    route: paymentRoute,
  },
  {
    path: '/programs',
    route: programRoute,
  },
  {
    path: '/faqs',
    route: faqRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
