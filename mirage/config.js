export default function () {
  this.passthrough('https://firebasestorage.googleapis.com/**');
  this.passthrough('https://www.googleapis.com/**');

  this.resource('ideas');
  this.resource('users');
  this.resource('comments');
  this.resource('kudos');
}
