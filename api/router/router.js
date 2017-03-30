

module.exports = mongoose => {
   return {
      images: {},
      apps: require('./routes/apps.js')(mongoose),
      credentials: require('./routes/credentials.js')(mongoose),
      dev: require('./routes/dev.js')(mongoose),
      accesses: require('./routes/accesses.js')(mongoose)
   }
};
