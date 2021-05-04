import Model, { attr } from '@ember-data/model';
export default class CommentModel extends Model {
  @attr('string') username;
  // @attr('timestamp', {
  //   defaultValue() {
  //     const currentDate = new Date();
  //     return currentDate.getTime();
  //   },
  // })
  // date;
  @attr('string') content;
  @attr('string') postID;
}
