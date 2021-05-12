import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { Changeset } from 'ember-changeset';
import voteValidators from '../../../validations/vote';
import lookupValidator from 'ember-changeset-validations';
export default class KudosComponent extends Component {
  @service store;
  @service session;
  @service firebase;

  @tracked votes;
  @tracked users;
  @tracked numberOfVotes;
  @tracked isOpen = false;
  @tracked changeset = false;
  @tracked isMine;

  constructor() {
    super(...arguments);
    this.currentUser = this.firebase.auth().currentUser;
    this.findVotesTask.perform();
    this.findUsersTask.perform();
  }

  @task({ restartable: true }) *findVotesTask() {
    const votes = yield this.store.findAll('kudo');
    this.votes = votes.filter(
      (vote) => vote.ideaID == this.args.idea.get('id')
    );

    this.sumVotes();
  }

  @task({ restartable: true }) *findUsersTask() {
    this.users = yield this.store.findAll('user');
    this.findUserRecord();
    this.isMine = this.checkIfMine();
  }

  findUserRecord() {
    [this.userRecord] = this.users.filter(
      (user) => user.email == this.currentUser.email
    );
  }

  checkIfMine() {
    return this.args.idea.get('userUID') === this.currentUser.uid;
  }

  sumVotes() {
    let sum = 0;
    this.votes.forEach((vote) => {
      sum += vote.numberOfVotes;
    });
    this.numberOfVotes = sum;
  }

  @action
  openVoteForm() {
    this.isOpen = true;
    this.voteModel = this.store.createRecord('kudo');
    this.changeset = new Changeset(
      this.voteModel,
      lookupValidator(voteValidators),
      voteValidators
    );
  }

  @action
  closeVoteForm() {
    this.voteModel.destroyRecord();
    this.isOpen = false;
  }

  @action
  setValue({ target: { name, value } }) {
    this.changeset[name] = value;
  }

  clearForm() {
    document.getElementById('numberOfVotes').value = '';
    this.isOpen = false;
  }

  @action
  vote() {
    this.changeset.ideaID = this.args.idea.get('id');
    this.changeset.userRecordID = this.userRecord.id;
    this.changeset.date = new Date().getTime();
    this.changeset.validate().then(() => {
      if (this.changeset.get('isValid')) {
        this.changeset.save().then(() => {
          this.clearForm();
          alert(`${this.args.idea.get('user')} Thank you for voiting!`);
          this.findVotesTask.perform();
        });
      }
    });
  }
}
