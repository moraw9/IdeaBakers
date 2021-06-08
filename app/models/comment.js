import Model, { attr } from '@ember-data/model';
export default class CommentModel extends Model {
  @attr('number', {
    defaultValue() {
      return new Date().getTime();
    },
  })
  date;
  @attr('string') content;
  @attr('string') postId;
  @attr('string') userId;
}
