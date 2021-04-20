
export default function validateUniqueness(opts) {
  console.log(opts);
  return (key, newValue, oldValue, changes, content) => {
    return new Promise((resolve, reject) => {
      fetch(`https://console.firebase.google.com/u/0/project/ideabakers-c756c/firestore`, {mode: 'no-cors'}).then(response =>{
        if(!response.ok) reject(new Error('error'));
         response.json();
      }).then( data => console.log(data));
      // this.store.findRecord('user', newValue).then((user) => {
      //   if(user) reject(`The email '${newValue}' already exists`);
      //     resolve(true);
      });
    // });
  };
}