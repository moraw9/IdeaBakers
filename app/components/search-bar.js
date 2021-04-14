import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class SearchBarComponent extends Component {
  @tracked query = '';
}