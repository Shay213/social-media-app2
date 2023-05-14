const SECRET = process.env?.SECRET;
export default () => {
  if (!SECRET) throw new Error("Secret key for jwt not defined!");
  return SECRET;
};
