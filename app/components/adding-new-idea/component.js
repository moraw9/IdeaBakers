import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { Changeset } from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import IdeaValidators from '../../validations/idea';
import { task } from 'ember-concurrency';
export default class AddingNewIdeaComponent extends Component {
  @service session;
  @service store;
  @service firebase;

  constructor() {
    super(...arguments);
    this.createChangeset();
  }
  createChangeset() {
    this.ideaModel = this.store.createRecord('idea');
    this.changeset = new Changeset(
      this.ideaModel,
      lookupValidator(IdeaValidators),
      IdeaValidators
    );
  }

  @action
  setValue({ target: { name, value, files } }) {
    this.changeset[name] = value;
    if (name === 'imageURL') {
      this.changeset[name] = files[0];
    }
  }
  @task({ restartable: true }) *setImageURLTask() {
    if (typeof this.changeset.imageURL === 'undefined') return;

    const storageRef = this.firebase
      .storage()
      .ref(
        'project/' +
          this.changeset.imageURL.name +
          '/' +
          this.changeset.imageURL.lastModified
      );

    yield storageRef
      .put(this.changeset.imageURL)
      .catch((error) => console.log(error));

    const url = yield storageRef.getDownloadURL();
    return url;
  }

  @action
  async addIdea() {
    await this.setImageURLTask.perform();
    this.changeset.user = this.args.currentUser.displayName;
    this.changeset.imageURL = this.setImageURLTask.lastSuccessful.value;

    this.changeset.validate().then(() => {
      if (this.changeset.get('isValid')) {
        this.changeset.save().then(() => {
          document.getElementById('closeModalButton').click();
          alert('Congratulations! The idea has been added successfully!');
          this.createChangeset();
          this.rollback();
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
