import Model, { attr } from '@ember-data/model';
export default class KudoModel extends Model {
  @attr('number') date;
  @attr('string') ideaID;
  @attr('string') userRecordID;
  @attr('number') numberOfVotes;
}
