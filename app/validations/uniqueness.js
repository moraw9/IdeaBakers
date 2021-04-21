
export default function validateUniqueness(opts) {
  return (key, newValue, oldValue, changes, content) => {
    return new Promise((resolve, reject) => {
      fetch(`https://console.firebase.google.com/u/0/project/ideabakers-c756c/firestore`, {mode: 'no-cors'}).then(response =>{
        if(!response.ok) reject(new Error('error'));
         response.json();
      }).then( data => console.log(data));
      resolve(true);
      });
    // });
  };
}