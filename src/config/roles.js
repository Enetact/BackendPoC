/**
 * A map of roles and their permissions.
 */
const rolePermissions = {
  user: [
    'createPayment',
    'getQuotation',
    'getQuotationByUserId',
    'getPolicyByUserId',
    'updateMember',
    'getUser',
    'updateUser',
  ],
  admin: [
    'getPayments',
    'managePolicies',
    'getQuotation',
    'manageMembers',
    'getPolicyByUserId',
    'getMembers',
    'createUser',
    'listUsers',
    'getUser',
    'updateUser',
    'deleteUser',
  ],
  service: ['updatePolicyNumber'],
};

/**
 * The role names.
 */
const roles = Object.keys(rolePermissions);
/**
 * A Map where the role name is the key and the permissions are the values.
 */
const roleRights = new Map(Object.entries(rolePermissions));

module.exports = {
  roles,
  roleRights,
};
