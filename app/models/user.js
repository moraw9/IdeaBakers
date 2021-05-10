import Model, { attr } from '@ember-data/model';
export default class UserModel extends Model {
  @attr('string') name;
  @attr('string') surname;
  @attr('string') email;
  @attr('string', { defaultValue: null }) photoURL;
  @attr('string') pswd;
  @attr('string') rpswd;
}
