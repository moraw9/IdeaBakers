import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';

export default class ListOfVotesComponent extends Component {
  @service store;
  @service session;
  @service firebase;

  @tracked userVotesList;

  constructor() {
    super(...arguments);
    this.findUserRecordTask.perform();
    this.findUserVotesTask.perform();
  }

  @task({ restartable: true }) *findUserRecordTask() {
    this.users = yield this.store.findAll('user');
    const [res] = this.users.filter(
      (user) => user.email == this.args.currentUser.email
    );
    this.userRecord = res;
  }

  @task({ restartable: true }) *findUserVotesTask() {
    const ideas = yield this.store.findAll('kudo');
    this.userVotesList = ideas.filter(
      (vote) => vote.userRecordID == this.userRecord.id
    );
  }
}
