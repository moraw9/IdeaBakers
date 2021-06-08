import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
// eslint-disable-next-line ember/no-computed-properties-in-native-classes

export default class CommentsComponent extends Component {
  @service store;
  @service session;
  @service('current-user') user;

  @tracked hasComments = false;
  @tracked comments;
  @tracked currentUser;

  constructor() {
    super(...arguments);
    this.getCurrentUserTask.perform();
    this.findCommentsTask.perform();
  }

  @task *getCurrentUserTask() {
    this.currentUser = yield this.user.getCurrentUser();
  }

  @task({ restartable: true }) *findCommentsTask() {
    const comments = yield this.store.findAll('comment');
    const result = comments.filter(
      (comment) => comment.postId === this.args.postID
    );
    if (result.length > 0) {
      this.hasComments = true;
    }
    this.comments = result;
  }

  @action
  submitComment() {
    const newComment = this.store.createRecord('comment');
    newComment.content = document.querySelector('textarea').value;
    newComment.postId = this.args.postID;
    newComment.userId = this.currentUser.id;
    newComment.save();
    this.cancel();
    this.findCommentsTask.perform();
  }

  @action
  cancel() {
    document.querySelector('textarea').value = '';
  }

  @action
  toggleDisable() {
    document.getElementById('submitButton').disabled =
      document.querySelector('textarea').value !== '' ? false : true;
  }
  @action
  removeComment(commentId) {
    const comToDelete = this.store.peekRecord('comment', commentId);
    comToDelete.destroyRecord().then(() => this.findCommentsTask.perform());
  }
}
