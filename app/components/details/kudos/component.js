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
  @service notify;
  @service('current-user') user;

  @tracked votes;
  @tracked numberOfVotes;
  @tracked isOpen = false;
  @tracked changeset = false;
  @tracked isMine;
  @tracked sumYourVotes;
  @tracked percent;
  @tracked currentUser;

  constructor() {
    super(...arguments);
    this.findUserTask.perform();
    this.findVotesTask.perform();
  }
  @task({ restartable: true }) *findUserTask() {
    this.currentUser = yield this.user.getCurrentUser();
    this.isMine = this.checkIfMine();
  }

  @task({ restartable: true }) *findVotesTask() {
    const votes = yield this.store.findAll('kudo');
    this.votes = votes.filter(
      (vote) => vote.ideaId == this.args.idea.get('id')
    );
    this.sumVotes();
  }

  checkIfMine() {
    if (!this.currentUser) return;
    return this.args.idea.get('userId') === this.currentUser.id;
  }

  sumVotes() {
    let sum = 0;
    let sumYourVotes = 0;
    this.votes.forEach((vote) => {
      sum += vote.numberOfVotes;
      if (this.currentUser && vote.userId === this.currentUser.id) {
        sumYourVotes += vote.numberOfVotes;
      }
    });

    this.numberOfVotes = sum;
    this.sumYourVotes = sumYourVotes;
    this.difference = 5 - this.sumYourVotes;

    this.setValueToBar();

    if (!this.currentUser) return;
    if (this.currentUser.userKudos === 0 || this.difference === 0) {
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

  async updateUserKudos() {
    this.currentUser.userKudos =
      this.currentUser.userKudos - this.changeset.numberOfVotes;
    await this.currentUser.save();
  }

  setMessage(time, message, addedClass) {
    this.notify.info(
      {
        html: `<div class="${addedClass}" data-test-vote-info >${message}</div>`,
      },
      {
        closeAfter: time,
      }
    );
  }

  @action
  vote() {
    if (
      this.currentUser.userKudos >= this.changeset.numberOfVotes &&
      this.difference >= this.changeset.numberOfVotes
    ) {
      this.changeset.ideaId = this.args.idea.get('id');
      this.changeset.userId = this.currentUser.id;
      this.changeset.date = new Date().getTime();
      this.changeset.validate().then(() => {
        if (this.changeset.get('isValid')) {
          this.changeset.save().then(() => {
            this.setMessage(4000, `Thank you for voiting!`, 'congratulation');
            this.updateUserKudos();
            this.findVotesTask.perform();
          });
          this.clearForm();
        }
      });
    } else if (this.currentUser.userKudos < this.changeset.numberOfVotes) {
      this.setMessage(
        6000,
        `You have only ${this.currentUser.userKudos} kudos to give`,
        'error'
      );
    } else {
      this.setMessage(
        6000,
        `You can give max ${this.difference} kudos!`,
        'error'
      );
    }
  }
}
