import Model, { attr } from '@ember-data/model';
export default class KudoModel extends Model {
  @attr('number') date;
  @attr('string') ideaId;
  @attr('string') userId;
  @attr('number') numberOfVotes;
}
