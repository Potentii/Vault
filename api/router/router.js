

module.exports = mongoose => {
   return {
      images: {},
      apps: {},
      api: require('./routes/api.js')(mongoose)
   }
};
