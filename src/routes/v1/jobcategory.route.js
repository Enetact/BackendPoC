const express = require('express');
const jobCategoryController = require('../../controllers/jobcategory.controller');

const router = express.Router();

router.route('/').get(jobCategoryController.getJobCategories);

router.route('/').post(jobCategoryController.createJobCategory);

router.route('/').put(jobCategoryController.updateJobCategories);

router.route('/').delete(jobCategoryController.deleteJobCategories);

router.route('/:jobCategoryId').get(jobCategoryController.getJobCategory);

module.exports = router;
