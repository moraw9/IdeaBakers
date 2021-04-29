import { readOnly } from '@ember/object/computed';
import { Ability } from 'ember-can';
import { inject as service } from '@ember/service';

export default class UserAbility extends Ability {
  @service session;
  @readOnly('session.currentUser') canViewProfile;
}
