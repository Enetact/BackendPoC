const express = require('express');
const faqController = require('../../controllers/faq.controller');

const router = express.Router();

router.route('/').get(faqController.getFaqs);

router.route('/').post(faqController.createFaq);

router.route('/').put(faqController.updateFaqs);

router.route('/').delete(faqController.deleteFaqs);

router.route('/:id').get(faqController.getFaq);

router.route('/programs/:programId/types/:type').get(faqController.getFaqByProgramType);

router.route('/programs/:programId').get(faqController.getFaqByProgram);

module.exports = router;
