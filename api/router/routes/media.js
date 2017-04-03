module.exports = (mongoose, worker) => {



   /**
    * Downloads the given media
    *  Does require access check
    */
   function download(req, res, next){
      // *Getting the app name and the media name from the request url:
      const app = req.params.app;
      const media = req.params.media;

      // *Checking if all the needed inputs are set:
      if(!app || !media)
         // *If they aren't:
         // *Sending a '400 BAD REQUEST' response, as the required inputs aren't set:
         res.status(400).end();
      else
         // *If they're:
         // *Getting the media path on disk:
         worker.get(app, media)
            .then(file_path => {
               // *Sending a '200 OK' response, with the file:
               res.status(200).sendFile(file_path);
            })
            .catch(err => {
               // *If some error happened:
               // *Checking the error code:
               switch(err.code){
                  case 'ENOENT':
                     // *Sending a '404 NOT FOUND' response, as the given media does not exists:
                     res.status(404).end();
                     break;
                  default:
                     // *Sending a '500 INTERNAL SERVER ERROR' response, as the cause of the error is unknown:
                     res.status(500).end();
               }
            });
   }



   /**
    * Retrieves all the media names of the given app
    *  Does require access check
    */
   function getAllFromApp(req, res, next){
      // *Sending a '501 NOT IMPLEMENTED' response, as this feature has not been implemented yet:
      res.status(501).end();
   }



   /**
    * Uploads a media for a given app
    *  Does require access check
    */
   function upload(req, res, next){
      // *Getting the app name from the request url:
      const app = req.params.app;
      // *Getting the base64 encoded file from the request body:
      const base64 = req.body.media;

      // *Checking if all the needed inputs are set:
      if(!app || !base64)
         // *If they aren't:
         // *Sending a '400 BAD REQUEST' response, as the required inputs aren't set:
         res.status(400).end();
      else
         // *If they're:
         // *Saving the file on disk:
         worker.save(app, base64)
            .then(name => {
               // *Sending a '201 CREATED' response, with the generated file name, as it has been successfully created on disk:
               res.status(201).json({ name }).end();
            })
            .catch(err => {
               // *If some error happened:
               // *Checking the error code:
               switch(err.code){
                  case 'ETYPE':
                  case 'EPARSE':
                     // *Sending a '400 BAD REQUEST' response, as the base64 string could not be parsed:
                     res.status(400).end();
                     break;
                  case 'EUNAVAIL':
                     // *Sending a '500 INTERNAL SERVER ERROR' response, as the worker could not generate a unique file name:
                     res.status(500).end();
                     break;
                  default:
                     // *Sending a '500 INTERNAL SERVER ERROR' response, as the cause of the error is unknown:
                     res.status(500).end();
               }
            });
   }



   /**
    * Removes a media file
    *  Does require access check
    */
   function removeFromApp(req, res, next){
      // *Getting the app and media names from the request url:
      const app = req.params.app;
      const media = req.params.media;

      // *Checking if all the needed inputs are set:
      if(!app || !base64)
         // *If they aren't:
         // *Sending a '400 BAD REQUEST' response, as the required inputs aren't set:
         res.status(400).end();
      else
         // *If they're:
         // *Removing the file from the disk:
         worker.remove(app, media)
            .then(() => {
               // *Sending a '200 OK' response, as the file has been successfully removed from disk:
               res.status(200).end();
            })
            .catch(err => {
               // *If some error happened:
               // *Sending a '500 INTERNAL SERVER ERROR' response, as the cause of the error is unknown:
               res.status(500).end();
            });
   }



   /**
    * Removes all media of the given app
    *  Does require access check
    */
   function removeAllFromApp(req, res, next){
      // *Sending a '501 NOT IMPLEMENTED' response, as this feature has not been implemented yet:
      res.status(501).end();
   }



   // *Returning the middlewares:
   return { download, getAllFromApp, upload, removeFromApp, removeAllFromApp };
};
