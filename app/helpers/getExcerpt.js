import { helper } from '@ember/component/helper';

function getExcerpt([string]) {
  return string
    .slice(0, string.length >= 300 ? 300 : string.length)
    .concat('...');
}

export default helper(getExcerpt);
