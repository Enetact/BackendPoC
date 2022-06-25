const express = require('express');
const jobDurationController = require('../../controllers/jobduration.controller');

const router = express.Router();

router.route('/').get(jobDurationController.getJobDurations);

router.route('/').post(jobDurationController.createJobDuration);

router.route('/').put(jobDurationController.updateJobDurations);

router.route('/').delete(jobDurationController.deleteJobDurations);

router.route('/:jobDurationId').get(jobDurationController.getJobDuration);

module.exports = router;
