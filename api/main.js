// *Requiring the needed modules:
const Configurator = require('w-srvr');
const db = require('./db/db.js');

// *Creating a new server configurator:
const server = new Configurator();

// *Setting the finish flag:
let finish_signaled = false;



// *When process is interrupted, finishing the program:
process.on('SIGINT', finish);

// *When the process doesn't have any other task left:
process.on('exit', code => {
   // *Logging it out:
   console.log('finished');
});



// *Starting the server:
start()
   .then(info => {
      console.log('Server started @ ' + info.address.href);
   })
   .catch(err => {
      console.error(err);
      finish();
   });



/**
 * Starts the server
 * @return Promise A promise that resolves into a { server, address } object, or rejects if something went wrong
 */
function start(){
   try{
      const router = require('./router/router.js');

      // *Starting the database:
      return db.start({
            host: process.env.DB_HOST || '127.0.0.1',
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            pass: process.env.DB_PASS,
            database: process.env.DB_SCHEMA,
            db_path: process.env.DB_PATH
         })
         // TODO setup the disk folders
         // *Setting up the routes:
         .then(mongoose => router(mongoose))
         // *Setting up the server:
         .then(routes => {
            // *Appending the server promise in the chain:
            return server

               // *Setting the server port:
               .port(process.env.PORT || 80)

               // *Configuring the API:
               .api

                  // *Defining routes for media resources:
                  // *TODO implement the Apps auth
                  .most('/api/v1/media/*',                     (req, res, next) => next())
                  .get('/api/v1/media/:app/images/:file',      routes.images.getFile)
                  .post('/api/v1/media/:app/images',           routes.images.saveFile).advanced.parseJSON({limit: '1mb'}).done()
                  .delete('/api/v1/media/:app/images/:file',   routes.images.removeFile)


                  // *Defining routes for remote service configuration:
                  .post('/api/v1/setup', routes.api.setup).advanced.parseJSON().done()


                  // *Defining routes for remote user management:
                  .post('/api/v1/apps',         routes.apps.addApp).advanced.parseJSON().done()
                  .delete('/api/v1/apps/:app',  routes.apps.removeApp)


                  // *Sending a '404 NOT FOUND' response, as none of the routes matched the request:
                  .most('/api/v1/*', (req, res, next) => res.status(404).end())

                  .done()

               // *Starting the server:
               .start()
         });
   } catch(err){
      // *Rejecting the promise if something went wrong:
      return Promise.reject(err);
   }
}



/**
 * Finishes all the services, and then ends the process
 */
function finish(){
   // *Checking if the finish signal has been set already, returning if it has:
   if(finish_signaled) return;

   // *Setting the finish signal:
   finish_signaled = true;

   // *Stopping the database:
   db.stop()
      // *Stopping the server:
      .then(() => server.stop())
      // *Stopping the process:
      .then(() => process.exit(0))
      .catch(err => {
         // *If something bad happens:
         // *Logging the error:
         console.error(err);
         // *Stopping the process:
         process.exit(1);
      });
}
