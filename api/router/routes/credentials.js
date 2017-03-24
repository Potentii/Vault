
module.exports = mongoose => {
   // *Getting the dependencies:
   const credentials = require('../../configs/credentials.js');



   /**
    * Checks if the credentials headers are valid
    */
   function check(req, res, next){
      // *Checking if the credentials have been set already:
      if(credentials.isSet()){
         // *If they have been:
         // *Getting the credentials from headers:
         const user = req.headers['Auth-User'];
         const pass = req.headers['Auth-Pass'];

         // *Checking if the given credentials matches:
         if(credentials.match(user, pass)){
            // *If they do:
            // *Sending a '200 OK' response, as the given credentials matches:
            res.status(200);

            // *Sending to the next handler:
            next();
         } else{
            // *If they don't:
            // *Sending a '401 UNAUTHORIZED' response, as the given credentials are not valid:
            res.status(401).end();
         }

      } else{
         // *If they haven't been:
         // *Sending a '401 UNAUTHORIZED' response, as the credentials are not even set yet:
         res.status(401).end();
      }
   }



   /**
    * Sets the credentials for the first time
    *  Does not require admin authentication
    */
   function set(req, res, next){
      // *Checking if the credentials have been set already:
      if(credentials.isSet()){
         // *If they have been:
         // *Sending a '405 METHOD NOT ALLOWED' response, as the credentials have been set already:
         res.status(405).end();
      } else{
         // *If they haven't been:
         // *Trying to set the credentials:
         try{
            // *Getting the credentials on the request body:
            const user = req.body.user;
            const pass = req.body.pass;

            // *Setting the new credentials:
            credentials.set(user, pass);

            // *Sending a '201 CREATED' response, as the credentials have been successfully set:
            res.status(201).end();
         } catch(err){
            // *If some error happens:
            // *Resetting the credentials:
            credentials.reset();

            // *Checking if the error is a TypeError:
            if(err instanceof TypeError)
               // *If it is:
               // *Sending a '400 BAD REQUEST' response, as the new credentials are not valid:
               res.status(400).end();
            else
               // *If it's not:
               // *Sending a '500 INTERNAL SERVER ERROR' response, as the cause of the error is unknown:
               res.status(500).end();
         }
      }
   }



   /**
    * Updates the credentials
    *  Does require admin authentication
    */
   function update(req, res, next){
      // *Checking if the credentials have been set already:
      if(credentials.isSet()){
         // *If they have been:
         // *Trying to update the credentials:
         try{
            // *Getting the credentials on the request body:
            const user = req.body.user;
            const pass = req.body.pass;

            // *Setting the new credentials:
            credentials.set(user, pass);

            // *Sending a '200 OK' response, as the credentials have been successfully updated:
            res.status(200).end();
         } catch(err){
            // *If some error happens:
            // *Restoring the last value:
            credentials.restore();

            // *Checking if the error is a TypeError:
            if(err instanceof TypeError)
               // *If it is:
               // *Sending a '400 BAD REQUEST' response, as the new credentials are not valid:
               res.status(400).end();
            else
               // *If it's not:
               // *Sending a '500 INTERNAL SERVER ERROR' response, as the cause of the error is unknown:
               res.status(500).end();
         }

      } else{
         // *If they haven't been:
         // *Sending a '405 METHOD NOT ALLOWED' response, as the credentials have not been set yet:
         res.status(405).end();
      }
   }



   /**
    * Removes the credentials
    *  Does require admin authentication
    */
   function erase(req, res, next){
      // *Checking if the credentials have been set already:
      if(credentials.isSet()){
         // *If they have been:
         // *Trying to erase the credentials:
         try{
            // *Erasing the credentials:
            credentials.reset();

            // *Sending a '200 OK' response, as the credentials have been successfully erased:
            res.status(200).end();
         } catch(err){
            // *If some error happens:
            // *Restoring the last value:
            credentials.restore();
            // *Sending a '500 INTERNAL SERVER ERROR' response, as the cause of the error is unknown:
            res.status(500).end();
         }

      } else{
         // *If they haven't been:
         // *Sending a '405 METHOD NOT ALLOWED' response, as the credentials have not been set yet:
         res.status(405).end();
      }
   }



   // *Returning the middlewares:
   return { check, set, update, erase };
};
