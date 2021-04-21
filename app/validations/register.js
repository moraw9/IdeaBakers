import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat,

} from 'ember-changeset-validations/validators';

export default {
  name: [
    validatePresence(true),
    validateLength({ min: 4}),

  ],
  surname: validatePresence(true),
  email: [
    validatePresence(true),
    validateFormat({ type: 'email' }),
  ],
  pswd: [
    validatePresence(true),
    validateLength({ min: 8, message: 'Password is too short (minimum is 8 characters)'}),

  ],
  rpswd: [validatePresence(true),
    validateConfirmation({ on: 'pswd', message: `Repeat password doesn't match password` }),
  ]
};
