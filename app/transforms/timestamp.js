import Transform from '@ember-data/serializer/transform';
import firebase from 'firebase';

export default class TimestampTransform extends Transform {
  deserialize(date) {
    // return super.deserialize(date);
    return date;
  }

  serialize(date) {
    if (date === firebase.ServerValue.TIMESTAMP) {
      return date;
    }
    return super.serialize(date);
  }
}
