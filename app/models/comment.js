import Model, { attr } from '@ember-data/model';
export default class CommentModel extends Model {
  @attr('string') username;
  @attr('number', {
    defaultValue() {
      return new Date().getTime();
    },
  })
  date;
  @attr('string') content;
  @attr('string') postId;
  @attr('string') userUid;
  @attr('string') userPhoto;
}
