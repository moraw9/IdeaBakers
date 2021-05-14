import Model, { attr } from '@ember-data/model';
export default class IdeaModel extends Model {
  @attr('string') title;
  @attr('string') description;
  @attr('string') imageURL;
  @attr('number') numberOfKudos;
  @attr('string') userUID;
  @attr('string') userRecordID;
}
