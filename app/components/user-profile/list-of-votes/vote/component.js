import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';

export default class VoteComponent extends Component {
  @service store;
  @service session;
  @service firebase;

  @tracked idea;

  constructor() {
    super(...arguments);
    this.findIdeaTask.perform();
    this.voteDate = new Date(this.args.vote.date).toLocaleString();
  }

  @task({ restartable: true }) *findIdeaTask() {
    this.ideas = yield this.store.findAll('idea');
    console.log('this.ideas', this.ideas);
    const [res] = this.ideas.filter(
      (idea) => idea.id === this.args.vote.ideaID
    );
    this.idea = res;
  }
}
