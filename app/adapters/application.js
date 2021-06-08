import CloudFirestoreAdapter from 'ember-cloud-firestore-adapter/adapters/cloud-firestore';
import config from '../config/environment';
import JSONAPIAdapter from '@ember-data/adapter/json-api';
const AppAdapter =
  config.environment === 'test' ? JSONAPIAdapter : CloudFirestoreAdapter;

export default class ApplicationAdapter extends AppAdapter {}
