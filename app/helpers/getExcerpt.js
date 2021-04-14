import { helper } from '@ember/component/helper';

function getExcerpt(string) {
  let result = string.slice(0,100);
  result +='...';
  return result;
}

export default helper(getExcerpt);