
// *Exporting this module:
module.exports = (mongoose, worker) => {
   // *Building and returning the routes:
   return {
      media: require('./routes/media.js')(mongoose, worker),
      apps: require('./routes/apps.js')(mongoose),
      credentials: require('./routes/credentials.js')(mongoose),
      dev: require('./routes/dev.js')(mongoose),
      accesses: require('./routes/accesses.js')(mongoose)
   };
};
