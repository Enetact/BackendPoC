const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 10) {
    return helpers.message('password must be at least 8 characters');
  }
  if (value.length > 100) {
    return helpers.message('password must be less than 100 characters');
  }
  if (value.match(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{8})$/)) {
    return helpers.message('password must contain at least 1 upper case, 1 lower case letter and 1 number');
  }
  // if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
  //   return helpers.message('password must contain at least 1 letter and 1 number');
  // }
  return value;
};

module.exports = {
  objectId,
  password,
};
