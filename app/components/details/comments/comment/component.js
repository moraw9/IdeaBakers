import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
export default class CommentComponent extends Component {
  @service store;
  constructor() {
    super(...arguments);
    this.date = new Date(this.args.comment.date).toLocaleString();
    this.commentUser = this.store.findRecord('user', this.args.comment.userId);
  }
  @action
  removeComment() {
    this.args.removeComment(this.args.comment.id);
  }
}
