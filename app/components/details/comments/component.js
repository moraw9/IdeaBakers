import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import firebase from 'firebase';
// eslint-disable-next-line ember/no-computed-properties-in-native-classes

export default class CommentsComponent extends Component {
  @service store;
  @service session;
  @tracked hasComments = false;
  @tracked comments;

  constructor() {
    super(...arguments);
    this.findCommentsTask.perform();
    this.currentUser = firebase.auth().currentUser;
  }
  @task({ restartable: true }) *findCommentsTask() {
    const comments = yield this.store.findAll('comment');
    const result = comments.filter(
      (comment) => comment.postID === this.args.postID
    );
    if (result.length > 0) {
      this.hasComments = true;
    }
    this.comments = result;
  }

  @action
  submitComment() {
    const newComment = this.store.createRecord('comment');
    // eslint-disable-next-line no-undef
    newComment.username = this.currentUser.displayName;
    newComment.content = document.querySelector('textarea').value;
    newComment.postID = this.args.postID;
    newComment.userUID = this.currentUser.uid;
    newComment.save();
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
    //alert is to remove, but I have to find solution to remove it from page in real time (without page reload)
    comToDelete.destroyRecord().then(() => alert('Deleted'));
  }
}
