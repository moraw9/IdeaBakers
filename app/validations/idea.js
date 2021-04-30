import {
  validatePresence,
  validateLength,
} from 'ember-changeset-validations/validators';

export default {
  title: [validatePresence(true), validateLength({ min: 3 })],
  descrption: [validatePresence(true), validateLength({ min: 100 })],
  numberOfKudos: validatePresence(true),
  imageURL: validatePresence(true),
};
