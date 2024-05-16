function myNew(constructor: Function, ...args: any[]) {
  // Create a new object with the prototype of the constructor function
  const obj = Object.create(constructor.prototype);

  // Call the constructor function with the new object as the context
  const res = constructor.apply(obj, args);

  // If the constructor function returns an object, return that object
  // Otherwise, return the new object
  return (res instanceof Object || typeof res === 'function') ? res : obj;
}

export default myNew
