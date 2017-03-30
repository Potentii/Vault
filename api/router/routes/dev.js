module.exports = mongoose => {
   // *Getting the dependencies:
   const credentials = require('../../configs/credentials.js');



   /**
    * Checks if the environment is not production
    */
   function check(req, res, next){
      // *Checking if the environment is set to production:
      if(process.env.NODE_ENV === 'production'){
         // *If it is:
         // *Blocking this route:
         res.status(404).end();
      } else{
         // *If it's not:
         // *Allowing this route:
         next();
      }
   }



   /**
    * Cleans all the api information
    *  Does require environment check (not available in production)
    *  Does not require admin authentication
    */
   function reset(req, res, next){
      // *Starting a new promise chain:
      new Promise((resolve, reject) => {
         // *Getting all the collections from the database:
         mongoose.connection.db.collections((err, collections) => {
            // *Rejecting if there is some error:
            if(err) return reject(err);
            // *Initializing the 'remove tasks' array:
            const tasks = [];
            // *Getting each collection:
            for(let collection of collections){
               // *Adding the remove promise into the tasks array:
               tasks.push(collection.deleteMany({}));
            }
            // *Resolving with all the tasks to be done:
            resolve(tasks);
         })})
         // *Executing all the tasks in parallel:
         .then(tasks => Promise.all(tasks))
         .then(() => {
            // *Cleaning the credentials:
            credentials.reset();
            // *Sending a '200 OK' response, as the api has been successfully reset:
            res.status(200).end();
         })
         .catch(err => {
            // *Sending a '500 INTERNAL SERVER ERROR' response, as the cause of the error is unknown:
            res.status(500).end();
         });
   }



   // *Returning the middlewares:
   return { reset };
};
