import Component from '@glimmer/component';
import { action } from '@ember/object';
export default class CommentComponent extends Component {
  constructor() {
    super(...arguments);
    this.date = new Date(this.args.comment.date).toLocaleString();
  }
  @action
  removeComment() {
    this.args.removeComment(this.args.comment.id);
  }
}
