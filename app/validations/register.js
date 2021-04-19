import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat,
  validateInclusion,

} from 'ember-changeset-validations/validators';
import validateUniqueness from './uniqueness';

export default {
  name: [
    validatePresence(true),
    validateLength({ min: 4}),
    // validateInclusion({^[a-zA-Z] });
    
  ],
  surname: validatePresence(true),
  email: [
    validatePresence(true),
    validateFormat({ type: 'email' }),
    validateUniqueness(),
  ],
  pswd: [
    validatePresence(true),
    validateLength({ min: 8, message: 'Password is too short (minimum is 8 characters)'}),
    // validateInclusion([]),
    
  ],
  rpswd: [validatePresence(true),
    validateConfirmation({ on: 'pswd', message: `Repeat password doesn't match password` }),
  ]
};