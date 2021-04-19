import Model, { attr } from '@ember-data/model';

export default class RegisterModel extends Model {
  @attr('string') name;
  @attr('string') surname;
  @attr('string') email;
  @attr('string') pswd;
  @attr('string') rpswd;
}