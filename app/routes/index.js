
import Route from '@ember/routing/route';

export default class IndexRoute extends Route {
 async model() {
   
    const result =await this.store.query('idea', {});
    debugger;
      return result;
      // return [];
    }
};
