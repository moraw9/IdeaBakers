import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';

export default class VoteComponent extends Component {
  @service store;
  @service session;
  @service firebase;

  @tracked user;

  constructor() {
    super(...arguments);
    this.findUserTask.perform();
    this.voteDate = new Date(this.args.vote.date).toLocaleString();
  }

  @task({ restartable: true }) *findUserTask() {
    this.users = yield this.store.findAll('user');
    const [res] = this.users.filter(
      (user) => user.id === this.args.vote.userId
    );
    this.user = res;
  }
}
