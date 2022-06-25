const QuoteError = require('../errors/quote-error');
const { Quotation } = require('../models');
const completeProjectService = require('./completeproject.service');
const crewSizeService = require('./crewsize.service');
const jobCategoryService = require('./jobcategory.service');
const jobDurationService = require('./jobduration.service');
const limitService = require('./limit.service');
const stateService = require('./state.service');
const calculateHourlyRate = require('../utils/calculateHourlyRate');
const logger = require('../config/logger');

const createQuotation = async (quotationBody) => {
  logger.debug('QuotationService::createQuotation');
  quotationBody.isActive = 1;
  quotationBody.isComplete = 0;
  return await Quotation.create(quotationBody);
};

/**
 * Get quotation by user id
 * @param {ObjectId} userid
 * @returns {Promise<Quotation>}
 */
const getQuotationByUserId = async (userid) => {
  logger.debug('QuotationService::getQuotationByUserId');
  return await Quotation.find({ userId: userid }).exec();
};

/**
 * Get quotation by id
 * @param {ObjectId} id
 * @returns {Promise<Quotation>}
 */
const getQuotationById = async (id) => {
  logger.debug('QuotationService::getQuotationById');
  return Quotation.findById(id);
};

const updateCompleteQuotation = async (quotationId) => {
  logger.debug('QuotationService::updateCompleteQuotation');
  var quote = await Quotation.findById(quotationId);
  quote.isComplete = 1;
  await quote.save();
};

/**
 * Create an insurance quote using the supplied request attributes.
 * @param {Object} quoteRequest The quote request.
 * @returns {Promise<Quotation>} A Promise which resolves to a Quote object if successful; otherwise
 * rejects with an error.
 */
const getEstimatedQuoteWithoutPersistence = async (quoteRequest = {}) => {
  logger.debug('QuotationService::getEstimatedQuoteWithoutPersistence');
  return calculateEstimatedQuote(quoteRequest, false);
};

/**
 * Query for quotation
 * @param {Object} quotationBody
 * @returns {Promise<Quotation>}
 */
const getEstimatedQuotation = async (quotationBody) => {
  logger.debug('QuotationService::getEstimatedQuotation');
  if (quotationBody) {
    if (quotationBody.IsOrigami && quotationBody.IsOrigami == 1) {
      return null;
    } else {
      return calculateEstimatedQuote(quotationBody, true);
    }
  } else {
    return null;
  }
};

/**
 * Calculate and create a quote for insurance. If requested, persist the quote in the data store.
 * @param {Object} quoteRequest The quote request attributes.
 * @param {boolean} isPersistent A boolean flag indicating when to persist the quote in the data store. Persist when true.
 * @returns {Promise<Object|null>} A Promise containing a Quote object if successful, null if not successfull;
 * otherwise rejects with an Error.
 */
const calculateEstimatedQuote = async (quoteRequest = {}, isPersistent = false) => {
  logger.debug('QuotationService::calculateEstimatedQuote');
  try {
    // initialize quote result values
    let estimatedRate = 0;
    let quotationResult = null;

    // fetch the quote rating factor options.
    const state = await stateService.getStateByZipCode(quoteRequest.zipCode);
    if (!state) throw new QuoteError('Unsupported State');
    const zipCode = state.zipCodes.find((zipCode) => zipCode.zipcode === quoteRequest.zipCode);
    if (!zipCode) throw new QuoteError('Unsupported ZIP Code');
    const jobCategories = await jobCategoryService.listJobCategoriesByCode(quoteRequest.categoryCodes);
    const jobDuration = await jobDurationService.getJobDurationByCode(quoteRequest.jobDurationCode);
    const limit = await limitService.getLimitByCode(quoteRequest.limitCode);
    const crew = await crewSizeService.getCrewSizeByCode(quoteRequest.crewSizeCode);
    const completeProject = await completeProjectService.getCompleteProjectByCode(quoteRequest.completeProjectCode);

    // set the base estimated rate
    estimatedRate = Number(state.rate);
    logger.debug(`estimated rate (state): ${estimatedRate}`);

    // for each quote rating factor, apply refine the calculated rate using the requested rating factor option
    if (zipCode) {
      estimatedRate = Number(estimatedRate) * Number(zipCode.factor);
    }
    logger.debug(`estimated rate (zip code): ${estimatedRate}`);

    if (jobCategories) {
      estimatedRate = jobCategories
        .map((jobCategory) => Number(jobCategory.factor))
        .reduce((estimatedRate, jobCategoryFactor) => {
          return Number(estimatedRate) * Number(jobCategoryFactor);
        }, estimatedRate);
    }
    logger.debug(`estimated rate (job category): ${estimatedRate}`);

    if (jobDuration) {
      estimatedRate = Number(estimatedRate) * Number(jobDuration.factor);
    }
    logger.debug(`estimated rate (job duration): ${estimatedRate}`);

    if (limit) {
      estimatedRate = Number(estimatedRate) * Number(limit.factor);
    }
    logger.debug(`estimated rate (limit): ${estimatedRate}`);

    if (crew) {
      estimatedRate = Number(estimatedRate) * Number(crew.factor);
    }
    logger.debug(`estimated rate (crew): ${estimatedRate}`);

    if (completeProject) {
      estimatedRate = Number(estimatedRate) * Number(completeProject.factor);
    }
    logger.debug(`estimated rate (completeProject): ${estimatedRate}`);

    if (quoteRequest.additionalInsuredCoverage && quoteRequest.additionalInsuredCoverage === 1) {
      estimatedRate = estimatedRate + (Number(estimatedRate) / 100) * 20;
    }
    logger.debug(`estimated rate (addl insured): ${estimatedRate}`);

    if (quoteRequest.waiverOfSubrogation && quoteRequest.waiverOfSubrogation === 1) {
      estimatedRate = estimatedRate + (Number(estimatedRate) / 100) * 4;
    }
    logger.debug(`estimated rate (subrogation): ${estimatedRate}`);

    // TODO The Leased or Rented Tools rating factor requirement is TBD
    // if (quoteRequest.leasedOrRentedToolsEquipment && quoteRequest.leasedOrRentedToolsEquipment === 1) {
    //   estimatedRate = estimatedRate + Number(await calculateAdditional(quoteRequest));
    // }
    // logger.debug(`estimated rate (leased tools): ${estimatedRate}`);

    // TODO The Extended Property Damage Coverage rating factor requirment is TBD
    // if (quoteRequest.extendedPropDamCoverage && quoteRequest.extendedPropDamCoverage === 1) {
    //   estimatedRate = estimatedRate + Number(await calculateAdditional(quoteRequest));
    // }
    // logger.debug(`estimated rate (property damage): ${estimatedRate}`);

    // persist the quote if requested
    if (isPersistent) {
      quotationResult = await createQuotation(quoteRequest);
    }

    // calculate the hourly rate
    const hourlyRate = calculateHourlyRate(estimatedRate, jobDuration);
    if (quotationResult && quotationResult.id) {
      return {
        quotationId: quotationResult.id,
        rate: parseFloat(estimatedRate.toFixed(2)),
        hourlyRate,
      };
    } else {
      return {
        rate: parseFloat(estimatedRate.toFixed(2)),
        hourlyRate,
      };
    }
  } catch (err) {
    logger.error('Error caught creating estimated quote.', err);
    throw new QuoteError(err.message, 500);
  }
};

module.exports = {
  getEstimatedQuotation,
  getQuotationByUserId,
  getQuotationById,
  updateCompleteQuotation,
  getEstimatedQuoteWithoutPersistence,
  createQuotation,
};
