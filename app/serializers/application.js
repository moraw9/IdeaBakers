import CloudFirestoreSerializer from 'ember-cloud-firestore-adapter/serializers/cloud-firestore';
import JSONAPISerializer from '@ember-data/serializer/json-api';
import config from '../config/environment';
import { camelize, dasherize } from '@ember/string';
const AppSerializer =
  config.environment === 'test' ? JSONAPISerializer : CloudFirestoreSerializer;

export default class ApplicationSerializer extends AppSerializer {
  // keyForAttribute(key) {
  //   if (key === 'photoURL') {
  //     return 'photoURL';
  //   }
  //   console.log(camelize(key), key);
  //   return key;
  // }
  keyForAttribute(key) {
    console.log(key);
    return camelize(key);
  }
}
