

module.exports = mongoose => {
   return {
      images: {},
      apps: {},
      credentials: require('./routes/credentials.js')(mongoose)
   }
};
