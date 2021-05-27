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
  @service('current-user') user;

  @tracked votes;
  @tracked numberOfVotes;
  @tracked isOpen = false;
  @tracked changeset = false;
  @tracked isMine;
  @tracked sumYourVotes;
  @tracked percent;
  @tracked userRecord;

  constructor() {
    super(...arguments);

    this.findUsersTask.perform();
    this.findVotesTask.perform();
  }

  @task({ restartable: true }) *findVotesTask() {
    const votes = yield this.store.findAll('kudo');
    this.votes = votes.filter(
      (vote) => vote.ideaId == this.args.idea.get('id')
    );
    this.sumVotes();
  }

  @task({ restartable: true }) *findUsersTask() {
    if (this.session.isAuthenticated) {
      this.currentUser = yield this.user.currentUser;
    }
    if (this.currentUser) {
      this.findUserRecord();
    }
    this.isMine = this.checkIfMine();
  }

  findUserRecord() {
    const [res] = this.args.users.filter(
      (user) => user.email == this.currentUser.email
    );
    this.userRecord = res;
  }

  checkIfMine() {
    if (!this.currentUser) return;
    return this.args.idea.get('userUid') === this.currentUser.uid;
  }

  sumVotes() {
    let sum = 0;
    let sumYourVotes = 0;

    this.votes.forEach((vote) => {
      sum += vote.numberOfVotes;
      if (this.userRecord && vote.userRecordId === this.userRecord.id) {
        sumYourVotes += vote.numberOfVotes;
      }
    });

    this.numberOfVotes = sum;
    this.sumYourVotes = sumYourVotes;
    this.difference = 5 - this.sumYourVotes;

    this.setValueToBar();

    if (!this.currentUser) return;
    if (this.userRecord.userKudos === 0 || this.difference === 0) {
      document.getElementById('addVoteButton').disabled = true;
    }
  }

  setValueToBar() {
    this.percent = Math.round(
      (this.numberOfVotes * 100) / this.args.idea.get('numberOfKudos')
    );
    document.querySelector('.value').textContent = `${this.percent}%`;
    if (this.percent > 100) {
      document.querySelector('.progress-bar').style.width = `100%`;
    } else {
      document.querySelector('.progress-bar').style.width = `${this.percent}%`;
    }
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

  updateUserKudos() {
    this.store.findRecord('user', this.userRecord.id).then((user) => {
      user.userKudos = this.userRecord.userKudos - this.changeset.numberOfVotes;
      user.save();
    });
  }

  @action
  vote() {
    if (
      this.userRecord.userKudos >= this.changeset.numberOfVotes &&
      this.difference >= this.changeset.numberOfVotes
    ) {
      this.changeset.ideaID = this.args.idea.get('id');
      this.changeset.userRecordId = this.userRecord.id;
      this.changeset.date = new Date().getTime();
      this.changeset.validate().then(() => {
        if (this.changeset.get('isValid')) {
          this.changeset.save().then(() => {
            alert(`${this.args.idea.get('user')} thanks you for voiting!`);
            this.updateUserKudos();
            this.findVotesTask.perform();
          });
          this.clearForm();
        }
      });
    } else if (this.userRecord.userKudos < this.changeset.numberOfVotes) {
      alert(`You have only ${this.userRecord.userKudos} kudos to give`);
    } else {
      alert(`You can give max ${this.difference} kudos!`);
    }
  }
}
