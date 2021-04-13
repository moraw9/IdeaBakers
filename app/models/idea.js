// import Model, { attr } from '@ember-data/model';
import DS from 'ember-data';

// export default class IdeaModel extends Model {
//   @attr('string') title;
//   @attr('string') description;
//   @attr('string') imageURL;
//   @attr('string') user;
//   @attr('number') numberOfKudos;
// }
export default DS.Model.extend({
  title: DS.attr('string'),
  description: DS.attr('string'),
  imageURL: DS.attr('string'),
  user: DS.attr('string'),
  numberOfKudos: DS.attr('number'),
});