export default function validateUniqueness(opts) {
  return (key, newValue, oldValue, changes, content) => {
    return new Promise((resolve) => {
      // validation logic
      // resolve with `true` if valid || error message string if invalid
      resolve(true);
    });
  };
}