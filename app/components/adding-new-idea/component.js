import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { Changeset } from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import IdeaValidators from '../../validations/idea';
import { task } from 'ember-concurrency';
export default class AddingNewIdeaComponent extends Component {
  @service session;
  @service store;
  @service firebase;

  @tracked changeset;
  @tracked userRecord;
  @tracked ideaModel;

  constructor() {
    super(...arguments);
    this.findUserRecordTask.perform();
  }

  @task({ restartable: true }) *findUserRecordTask() {
    const users = yield this.store.findAll('user');
    const [res] = users.filter(
      (user) => user.email === this.args.currentUser.email
    );
    this.userRecord = res;
  }

  @action
  openModal() {
    this.ideaModel = this.store.createRecord('idea');
    this.changeset = new Changeset(
      this.ideaModel,
      lookupValidator(IdeaValidators),
      IdeaValidators
    );
  }

  @action
  closeModal() {
    document.getElementById('imageURL').value = null;
    this.ideaModel.destroyRecord();
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
    this.changeset.userRecordID = this.userRecord.id;
    this.changeset.userUID = this.args.currentUser.uid;
    this.changeset.imageURL = this.setImageURLTask.lastSuccessful.value;

    this.changeset.validate().then(() => {
      if (this.changeset.get('isValid')) {
        this.changeset.save().then(() => {
          document.getElementById('closeModalButton').click();
          alert('Congratulations! The idea has been added successfully!');
        });
      }
    });
  }
}
