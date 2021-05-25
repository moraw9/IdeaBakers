export default function () {
  // These comments are here to help you get started. Feel free to delete them.

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */

  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  // this.namespace = '';    // make this `/api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

  // Shorthand cheatsheet:
  this.resource('ideas');
  this.resource('users');
  this.resource('comments');

  this.post('/ideas');
  this.get('/ideas');
  this.put('/ideas'); // or this.patch
  this.del('/ideas');
  // this.get('/users', () => {
  //   return {
  //     data: [
  //       {
  //         id: 1,
  //         type: 'users',
  //         attributes: {
  //           name: 'Asia',
  //           surname: 'Jamroz',
  //           email: 'asai@wp.pl',
  //           photoUrl: null,
  //           pswd: '1234578',
  //           rpswd: '12345678',
  //           userKudos: 35,
  //         },
  //       },
  //     ],
  //   };
  // });

  // https://www.ember-cli-mirage.com/docs/route-handlers/shorthands
}
