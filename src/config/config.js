module.exports = function () {
  // set config
  if (!process.env.SECRET_STRING) {
    console.error("FATAL ERROR: key privet key is not define");
    process.exit(1);
  }
};
