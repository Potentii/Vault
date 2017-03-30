module.exports = mongoose => {
   // *Getting the dependencies:
   const uuid = require('uuid');



   /**
    * Retrieves all the app's accesses
    *  Does require admin authentication
    */
   function getAllFromApp(req, res, next){
      // *Getting the app name from the request url:
      const name = req.params.app;

      // *Getting the models:
      const App = mongoose.model('App');
      const Access = mongoose.model('Access');

      // *Finding the app given its name:
      App.findOne({ name })
         .select('_id')
         .exec()
         .then(item => {
            // *Checking if the app exists:
            if(item){
               // *If it does:
               // *Finding all this app's accesses:
               return Access.find({ _app: item._id })
                  .then(items => {
                     // *Sending a '200 OK' response with the found accesses:
                     res.status(200).json(items).end();
                  });
            } else{
               // *If it doesn't:
               // *Sending a '404 NOT FOUND' response, as the given app does not exists:
               res.status(404).end();
            }
         })
         .catch(err => {
            // *Sending a '500 INTERNAL SERVER ERROR' response, as the cause of the error is unknown:
            res.status(500).end();
         });
   }



   /**
    * Registers a new app
    *  Does require admin authentication
    */
   function addOnApp(req, res, next){
      // *Getting the app name from the request url:
      const name = req.params.app;

      // *Getting the models:
      const App = mongoose.model('App');
      const Access = mongoose.model('Access');

      // *Finding the app given its name:
      App.findOne({ name })
         .select('_id')
         .exec()
         .then(item => {
            // *Checking if the app exists:
            if(item){
               // *If it does:
               // *Generating the access key:
               const key = uuid.v4();

               // *Adding a new access into the database:
               return new Access({ key, _app: item._id })
                  .save()
                  .then(item => {
                     // *Sending a '201 CREATED' response, as the access have been successfully created for the given app:
                     res.status(201).json({ key }).end();
                  });
            } else{
               // *If it doesn't:
               // *Sending a '404 NOT FOUND' response, as the given app does not exists:
               res.status(404).end();
            }
         })
         .catch(err => {
            // *Sending a '500 INTERNAL SERVER ERROR' response, as the cause of the error is unknown:
            res.status(500).end();
         });
   }



   /**
    * Removes an existing app
    *  Does require admin authentication
    */
   function removeFromApp(req, res, next){
      // *Getting the app name from the request url:
      const name = req.params.app;
      // *Getting the access key from the request url:
      const key = req.params.key;

      // *Getting the models:
      const App = mongoose.model('App');
      const Access = mongoose.model('Access');

      // *Finding the app given its name:
      App.findOne({ name })
         .select('_id')
         .exec()
         .then(item => {
            // *Checking if the app exists:
            if(item){
               // *If it does:
               // *Removing the access with the given key:
               return Access.remove({ _app: item._id, key })
                  .exec()
                  .then(info => {
                     // *Checking if the query has removed any document:
                     if(info.result.n)
                        // *If it has:
                        // *Sending a '200 OK' response, as the accesses have been successfully removed:
                        res.status(200).end();
                     else
                        // *If it hasn't:
                        // *Sending a '404 NOT FOUND' response, as the given accesss does not exists:
                        res.status(404).end();
                  });
            } else{
               // *If it doesn't:
               // *Sending a '404 NOT FOUND' response, as the given app does not exists:
               res.status(404).end();
            }
         })
         .catch(err => {
            // *Sending a '500 INTERNAL SERVER ERROR' response, as the cause of the error is unknown:
            res.status(500).end();
         });
   }



   /**
    * Removes an existing app
    *  Does require admin authentication
    */
   function removeAllFromApp(req, res, next){
      // *Getting the app name from the request url:
      const name = req.params.app;

      // *Getting the models:
      const App = mongoose.model('App');
      const Access = mongoose.model('Access');

      // *Finding the app given its name:
      App.findOne({ name })
         .select('_id')
         .exec()
         .then(item => {
            // *Checking if the app exists:
            if(item){
               // *If it does:
               // *Removing all of its accesses:
               return Access.remove({ _app: item._id })
                  .exec()
                  .then(info => {
                     // *Sending a '200 OK' response, as the accesses have been successfully removed:
                     res.status(200).end();
                  });
            } else{
               // *If it doesn't:
               // *Sending a '404 NOT FOUND' response, as the given app does not exists:
               res.status(404).end();
            }
         })
         .catch(err => {
            // *Sending a '500 INTERNAL SERVER ERROR' response, as the cause of the error is unknown:
            res.status(500).end();
         });
   }



   // *Returning the middlewares:
   return { getAllFromApp, addOnApp, removeFromApp, removeAllFromApp };
};
