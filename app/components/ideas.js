import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class IdeasComponent extends Component {
  @tracked query = '';
}