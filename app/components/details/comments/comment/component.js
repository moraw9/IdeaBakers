import Component from '@glimmer/component';
export default class CommentComponent extends Component {
  constructor() {
    super(...arguments);
    this.date = new Date(this.args.comment.date).toLocaleString();
  }
}
