module.exports = mongoose => {



   /**
    * Registers a new app
    *  Does require admin authentication
    */
   function add(req, res, next){
      // *Getting the app's info from the request body:
      const name = req.body.name;

      // *Getting the App model:
      const App = mongoose.model('App');

      // *Creating a new app instance:
      new App({ name })
         // *Saving it in the database:
         .save()
         .then(item => {
            // *Sending a '201 CREATED' response, as the app have been successfully added:
            res.status(201).end();
         })
         .catch(err => {
            // *Checking the error cause:
            if(err.errors && err.errors.name.kind === 'required')
               // *Sending a '400 BAD REQUEST' response, as the 'name' field is missing:
               res.status(400).end();

            else if(err.errors && err.errors.name.kind === 'regexp')
               // *Sending a '400 BAD REQUEST' response, as the given app name is invalid:
               res.status(400).end();

            else if(err.code == 11000)
               // *Sending a '409 CONFLICT' response, as the given app name already exists:
               res.status(409).end();

            else
               // *Sending a '500 INTERNAL SERVER ERROR' response, as the cause of the error is unknown:
               res.status(500).end();
         });
   }



   /**
    * Removes an existing app
    *  Does require admin authentication
    */
   function remove(req, res, next){
      // *Getting the app name from the request url:
      const name = req.params.app;

      // *Getting the App model:
      const App = mongoose.model('App');

      // *Removing the app, given its name:
      App.remove({ name })
         .exec()
         .then(info => {
            // *Checking if the query has removed any document:
            if(info.result.n)
               // *If it has:
               // *Sending a '200 OK' response, as the app have been successfully removed:
               res.status(200).end();
            else
               // *If it hasn't:
               // *Sending a '404 NOT FOUND' response, as the given app does not exists:
               res.status(404).end();
         })
         .catch(err => {
            // *Sending a '500 INTERNAL SERVER ERROR' response, as the cause of the error is unknown:
            res.status(500).end();
         });
   }



   // *Returning the middlewares:
   return { add, remove };
};
