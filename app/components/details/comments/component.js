import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
// eslint-disable-next-line ember/no-computed-properties-in-native-classes

export default class CommentsComponent extends Component {
  @service store;
  @service session;
  @tracked hasComments = false;
  @tracked comments;

  constructor() {
    super(...arguments);
    this.findCommentsTask.perform();
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
  addComment() {}
}
