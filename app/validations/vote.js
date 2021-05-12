import {
  validatePresence,
  validateNumber,
} from 'ember-changeset-validations/validators';

export default {
  numberOfVotes: [validatePresence(true), validateNumber({ gte: 1, lte: 5 })],
};
