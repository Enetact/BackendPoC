const axios = require('axios');
const httpStatus = require('http-status');
const { Member, Policy, JobDuration } = require('../models');
const calculateHourlyRate = require('../utils/calculateHourlyRate');

const apiBase = process.env.ORIGAMI_BASE_URL;
const email = process.env.ORIGAMI_USER;
const password = process.env.ORIGAMI_PASSWORD;
const accountName = process.env.ORIGAMI_ACCOUNT;
const clientName = process.env.ORIGAMI_CLIENTNAME;
const loginUrl = process.env.ORIGAMI_AUTHENTICATION_ENDPOINT;
const creatMemberUrl = process.env.ORIGAMI_CREATE_MEMBER_ENDPOINT;
const updateMemberUrl = process.env.ORIGAMI_UPDATE_MEMBER_ENDPOINT;
const queryMemberUrl = process.env.ORIGAMI_GET_MEMBER_ENDPOINT;
const creatQuoteUrl = process.env.ORIGAMI_CREATE_QUOTE_ENDPOINT;
const creatQuoteCoverageUrl = process.env.ORIGAMI_CREATE_COVERAGE_ENDPOINT;
const getQuoteRateUrl = process.env.ORIGAMI_GET_RATE_ENDPOINT;
const proposalUrl = process.env.ORIGAMI_PROPOSAL_ENDPOINT;
const maxRps = 10; // max requests per second for throttling
const throttleInterval = 1000 / maxRps;
const underwriteruser = process.env.ORIGAMI_UNDERWRITER_USER;
const getPoliciesUrl = process.env.ORIGAMI_GET_POLICIES_ENDPOINT;

// a small wrapper around axios for this particular API
// this might best live in a separate module
const apiRequest = async ({ headers, method = 'get', url, data }) => {
  const opts = {
    headers,
    method,
    url,
    data,
  };
  return await axios(opts).then((res) => res.data);
};

const getAccessToken = async () => {
  const method = 'post';
  const url = apiBase + '/' + loginUrl;
  const headers = { 'Content-Type': 'application/json' };
  const requestData = JSON.stringify({
    Account: accountName,
    User: email,
    Password: password,
    ClientName: clientName,
  });

  const result = await apiRequest({ headers: headers, method, url, data: requestData });
  return result;
};

const getQuotationRate = async (quotationBody) => {
  const authenticationResult = await getAccessToken();
  if (authenticationResult && authenticationResult.Token) {
    const memberResult = await createMember(authenticationResult.Token, quotationBody);
    if (memberResult && memberResult.MemberID) {
      const quoteResult = await createQuote(authenticationResult.Token, memberResult, quotationBody);
      if (quoteResult && quoteResult.EchoFields.ProposalID) {
        const quoteCoverageResult = await createQuoteCoverage(authenticationResult.Token, quoteResult, quotationBody);
        if (quoteCoverageResult) {
          const quoteRateResult = await getQuoteRate(authenticationResult.Token, quoteResult, quotationBody);
          if (quoteRateResult && quoteRateResult[0].Amount && quoteRateResult[0].Amount > 0) {
            await createPolicyInMiddleware(
              quotationBody,
              memberResult,
              quoteResult.EchoFields.ProposalID,
              quoteRateResult[0].Amount
            );
            const jobDurationResult = await JobDuration.findOne({ code: quotationBody.jobDurationCode });
            const hourlyRate = calculateHourlyRate(quoteRateResult[0].Amount, jobDurationResult);
            return {
              rate: quoteRateResult[0].Amount,
              hourlyRate: hourlyRate,
            };
          } else {
            return 'There is some server issue to get the actual rate.';
          }
        } else {
          return 'Inquiry with Origami not succeeded: Quote rate not found.';
        }
      } else {
        return 'Inquiry with Origami not succeeded: Quote not found.';
      }
    } else {
      return 'Inquiry with Origami not succeeded: Member not found.';
    }
  } else {
    return 'Inquiry with Origami not succeeded: Authentication failed.';
  }
};

const createMember = async (token, quotationBody) => {
  //check user has entry in member table or not, if yes get the memberid, go ahead
  const userMember = await Member.findOne({ userId: quotationBody.userId });
  if (userMember && userMember.origamiMemberId) {
    const memberExistResult = await isMemberExistByMemberId(token, userMember.origamiMemberId);
    if (memberExistResult) {
      return memberExistResult;
    }
  }
  const name = quotationBody.firstName + ' ' + quotationBody.lastName;
  const memberExistResult = await isMemberExist(token, name, quotationBody.email);
  if (memberExistResult && memberExistResult.MemberID > 0) {
    return memberExistResult;
  }
  const method = 'post';
  const createMemberUrl = apiBase + creatMemberUrl + '?fireEvents=true&echoFields=MemberID%2CMemberNumber%2CName';
  const headers = { 'Content-Type': 'application/json', Token: token };

  const requestData = JSON.stringify({
    Name: name,
    ContactEmail: quotationBody.email,
    CustomText2: quotationBody.phone ? quotationBody.phone : '',
    CustomText26: '',
    InceptionDate: new Date(),
  });
  const result = await apiRequest({ headers: headers, method, url: createMemberUrl, data: requestData });
  await createMemberInMiddleware(quotationBody, result.EchoFields);
  return result.EchoFields;
};

const isMemberExist = async (token, memberId, name, email) => {
  const method = 'get';
  const filter = 'Name:eq:' + name + '%26%26ContactEmail:eq:' + email;
  const memberUrl = apiBase + queryMemberUrl + '?columns=MemberID,Name,MemberNumber,ContactEmail&filter=' + filter;
  const headers = { 'Content-Type': 'application/json', Token: token };

  const result = await apiRequest({ headers: headers, method, url: memberUrl });
  if (result && result.List && result.List.length > 0 && result.List[0].MemberID > 0) {
    return result.List[0];
  } else {
    return null;
  }
};

const isMemberExistByMemberId = async (token, memberId) => {
  const method = 'get';
  const filter = 'MemberID:eq:' + memberId;
  const memberUrl = apiBase + queryMemberUrl + '?columns=MemberID,Name,MemberNumber,ContactEmail&filter=' + filter;
  const headers = { 'Content-Type': 'application/json', Token: token };

  const result = await apiRequest({ headers: headers, method, url: memberUrl });
  if (result && result.List && result.List.length > 0 && result.List[0].MemberID > 0) {
    return result.List[0];
  } else {
    return null;
  }
};

const updateMember = async (userId, reqBody) => {
  const userMember = await Member.findOne({ userId: userId });
  if (!userMember || !userMember.origamiMemberId) {
    return 'Member not found.';
  }

  const authenticationResult = await getAccessToken();
  if (authenticationResult && authenticationResult.Token) {
    const memberExistResult = await isMemberExistByMemberId(authenticationResult.Token, userMember.origamiMemberId);
    if (memberExistResult && memberExistResult.MemberID > 0) {
      const method = 'put';
      const updateMemberApi = apiBase + updateMemberUrl + '/' + memberExistResult.MemberID + '/?fireEvents=true';
      const headers = { 'Content-Type': 'application/json', Token: authenticationResult.Token };
      const requestData = JSON.stringify({
        ContactEmail:
          reqBody.emailId && memberExistResult.ContactEmail != reqBody.emailId
            ? reqBody.emailId
            : memberExistResult.ContactEmail,
        Name: reqBody.name && memberExistResult.Name != reqBody.name ? reqBody.name : memberExistResult.Name,
      });

      const result = await apiRequest({ headers: headers, method, url: updateMemberApi, data: requestData });
      if (result && result.IsSuccessful) {
        userMember.contactEmail =
          reqBody.emailId && memberExistResult.ContactEmail != reqBody.emailId
            ? reqBody.emailId
            : memberExistResult.ContactEmail;
        userMember.name = reqBody.name && memberExistResult.Name != reqBody.name ? reqBody.name : memberExistResult.Name;
        await userMember.save();
      }
      return result;
    } else {
      return 'Member not found.';
    }
  } else {
    return 'Authentication failed';
  }
};

const createMemberInMiddleware = async (quotationBody, member) => {
  try {
    if (await Member.findOne({ userId: quotationBody.userId })) {
      console.log('member exist in middleware');
      return;
    }
    const requestData = {
      userId: quotationBody.userId,
      origamiMemberId: member.MemberID,
      name: member.Name,
      contactEmail: quotationBody.email,
      isActive: 1,
    };
    return Member.create(requestData);
  } catch (e) {
    console.log('Error occured in creating member in middleware-');
  }
};

const getPoliciesByMemberId = async (token, memberId) => {
  const method = 'get';
  const filter = 'MemberID:eq:' + memberId;
  const memberUrl =
    apiBase +
    getPoliciesUrl +
    '?columns=PolicyNumber,Member.Name,CustomDate2,CustomDate3,Custom14Code.Description,LimitDecode,CustomMultiSelectCode1,Premium&filter=' +
    filter;
  const headers = { 'Content-Type': 'application/json', Token: token };

  const result = await apiRequest({ headers: headers, method, url: memberUrl });
  if (result && result.List) {
    console.log(result);
    return result;
  } else {
    return 'No Policy Found.';
  }
};

const getPoliciesByUser = async (userId) => {
  const userMember = await Member.find({ userId: userId });
  console.log(userMember);
  if (!userMember || userMember.length == 0 || !userMember[0].origamiMemberId) {
    return 'Member not found.';
  }

  const authenticationResult = await getAccessToken();
  console.log(authenticationResult);
  if (authenticationResult && authenticationResult.Token) {
    return await getPoliciesByMemberId(authenticationResult.Token, userMember[0].origamiMemberId);
  }
};

const createQuote = async (token, member, quotationBody) => {
  const method = 'post';
  const createMemberUrl = apiBase + creatQuoteUrl + '?fireEvents=true&echoFields=ProposalID%2CProposalNumber';
  const headers = { 'Content-Type': 'application/json', Token: token };

  const requestData = JSON.stringify({
    'Custom17Code.DisplayCode': 'E', //Is the member “new” [N] or “existing” [E]. Required. Send “N” if you just created the member.
    UnderwriterUser: underwriteruser, //Blank or a user in Origami
    CustomText30: quotationBody.email, //can be blank
    CustomText31: '1112222', //can be blank
    MemberID: member.MemberID.toString(), //The ID of the member. Required.
    CustomMultiSelectCode1: quotationBody.categoryCodes.toString(), //A list of “job categories”.
    CustomNarrative2: 'Overall project description', //project description
    CustomBool37: 'true', //Acknowledge Exclusion
    CustomText32: quotationBody.address,
    CustomText34: 'addressline2',
    CustomText35: 'city',
    CustomText29: quotationBody.zipCode,
    'State.DisplayCode': quotationBody.stateCode, //state code should be dynamic value
    'Custom14Code.DisplayCode': quotationBody.jobDurationCode, // Job duration code
    'Custom15Code.DisplayCode': quotationBody.crewSizeCode, //crew size code
    Limit: quotationBody.limitCode, //limit code
    'Custom16Code.DisplayCode': '12', //always 12 as per origami documentation
    CustomDate2: quotationBody.startDate, //project start date
    CustomDate3: quotationBody.endDate, //project end date
    EffectiveDate: quotationBody.startDate, //same as project start date,
    ExpiryDate: quotationBody.endDate, //same as project end date,
    PolicyType: 'C', //Required, always C
    BillingFrequency: 'O', //default to O
    CustomBool31: 'false', //Blanket Additional Insured Coverage. Default to false.
    CustomBool32: 'false', //Waiver of Subrogation. Default to false.
    CustomBool33: 'false', //Leased or Rented Tools or Equipment. Default to false.
    CustomBool36: 'false',
    PolicySetID: '19', //Required. Always 19 (but may be different in PROD).
    IsActive: 'true', //Default to true.
    IsEndorsement: 'false', // Default to false.
    Status: 'U', //Default to “U” (Submitted)
    Type: 'A', //Default to “A” (Application)
  });
  const result = await apiRequest({ headers: headers, method, url: createMemberUrl, data: requestData });
  return result;
};

const createQuoteCoverage = async (token, quoteResult, quotationBody) => {
  const method = 'post';
  const createMemberUrl = apiBase + creatQuoteCoverageUrl;
  const headers = { 'Content-Type': 'application/json', Token: token };

  const requestData = JSON.stringify({
    Coverage: '40', //Fixed value
    EffectiveDate: quotationBody.startDate,
    ExpiryDate: quotationBody.endDate,
    PolicySetID: '19', // Fixed value
    ProposalID: quoteResult.EchoFields.ProposalID,
  });
  const result = await apiRequest({ headers: headers, method, url: createMemberUrl, data: requestData });
  return result;
};

const getQuoteRate = async (token, quoteResult, quotationBody) => {
  const method = 'get';
  const getQuoteUrl = apiBase + getQuoteRateUrl + '?proposalID=' + quoteResult.RecordID;
  const headers = { 'Content-Type': 'application/json', Token: token };

  const result = await apiRequest({ headers: headers, method, url: getQuoteUrl, data: {} });
  console.log(result);
  return result;
};

const createPolicyInMiddleware = async (quotationBody, member, proposalId, premiumAmount) => {
  try {
    if (await Policy.findOne({ origamiMemberId: member.MemberID, policyProposalID: proposalId })) {
      console.log('policy exist in middleware');
      return;
    }
    const requestData = {
      userId: quotationBody.userId,
      quotationId: quotationBody.quotationId,
      origamiMemberId: member.MemberID,
      insured: member.Name,
      policyProposalId: proposalId,
      contactEmail: quotationBody.email,
      premiumAmount: premiumAmount,
      effectiveDate: quotationBody.effectiveDate,
      expiryDate: quotationBody.expiryDate,
      isActive: 1,
    };
    return Policy.create(requestData);
  } catch (e) {
    console.log('Error occured in creating policy in middleware-');
  }
};

const sendPaymentConfirmation = async (proposalId, amount) => {
  const authenticationResult = await getAccessToken();
  if (authenticationResult && authenticationResult.Token) {
    const method = 'put';
    const endPoint = apiBase + proposalUrl + proposalId + '/?fireEvents=true';
    const headers = { 'Content-Type': 'application/json', Token: authenticationResult.Token };

    const requestData = JSON.stringify({
      CustomBool38: true,
      CustomNumber13: amount,
      CustomNarrative3: '',
    });

    const result = await apiRequest({ headers: headers, method, url: endPoint, data: requestData });
    return result;
  }
};

module.exports = {
  getAccessToken,
  getQuotationRate,
  updateMember,
  getPoliciesByUser,
  sendPaymentConfirmation,
};
