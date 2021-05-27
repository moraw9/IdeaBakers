import Model, { attr } from '@ember-data/model';
export default class IdeaModel extends Model {
  @attr('string') title;
  @attr('string') description;
  @attr('string') imageUrl;
  @attr('number') numberOfKudos;
  @attr('string') userId;
}
