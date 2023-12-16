export const generateUniqueId = (type) => {
  const randomNumber = Math.floor(Math.random() * 1000000000000000).toString();

  return `${type}-${randomNumber.substring(0, 5)}`; // return a unique id
};
