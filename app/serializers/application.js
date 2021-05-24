import CloudFirestoreSerializer from 'ember-cloud-firestore-adapter/serializers/cloud-firestore';
// import RESTSerializer from '@ember-data/serializer/rest';
import JSONAPISerializer from '@ember-data/serializer/json-api';
import config from '../config/environment';
const AppSerializer =
  config.environment === 'test' ? JSONAPISerializer : CloudFirestoreSerializer;

export default class ApplicationSerializer extends AppSerializer {}
