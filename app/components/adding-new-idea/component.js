import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { Changeset } from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import IdeaValidators from '../../validations/idea';
export default class AddingNewIdeaComponent extends Component {
  @service session;
  @service store;

  constructor() {
    super(...arguments);
    this.ideaModel = this.store.createRecord('idea');
    console.log(this.ideaModel);
    this.changeset = new Changeset(
      this.ideaModel,
      lookupValidator(IdeaValidators),
      IdeaValidators
    );
  }

  @action
  setValue({ target: { name, value } }) {
    this.changeset[name] = value;
  }

  @action
  addIdea() {
    this.changeset.user = this.args.currentUser.displayName;
    this.changeset.validate().then(() => {
      if (this.changeset.get('isValid')) {
        this.changeset.imageURL =
          'data:image/png;base64,' + this.changeset.imageURL;
        this.changeset.save().then(() => {
          document.getElementById('closeModalButton').click();
          alert('Congratulations! The idea has been added successfully!');
        });
      }
    });
  }

  @action
  clear() {
    document.querySelectorAll('input').forEach((input) => (input.value = ''));
    document.querySelector('textarea').value = '';
  }

  @action
  rollback() {
    document.querySelectorAll('input').forEach((input) => (input.value = ''));
    document.querySelector('textarea').value = '';
    this.changeset.rollback();
  }
}
