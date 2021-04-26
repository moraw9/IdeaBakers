import { htmlSafe as safe } from '@ember/template';
import { helper } from '@ember/component/helper';

function htmlSafe([string]) {
  return safe(string);
}

export default helper(htmlSafe);
