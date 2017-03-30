'use strict';

// *Getting the main module:
const service = require('..');



describe('Endpoints', function(){

   // *Starting the services before the endpoints test starts:
   before('Starting services', function(){
      // *Setting a high timeout, since the starting process might take some time:
      this.timeout(10000);

      // *Setting the test environment file:
      process.env.CONFIGS = process.env.CONFIGS ? process.env.CONFIGS : './tests/.env.test';

      // *Starting the services:
      return service.start()
         .catch(err => {
            // *If something went wrong:
            // *Finishing the services:
            return service.finish()
               .then(() => Promise.reject(err));
         });
   });


   // *Stopping the services after the endpoints test finishes:
   after('Stopping services', function(){
      // *Setting a high timeout, since the stopping process might take some time:
      this.timeout(10000);
      // *Finishing the services:
      return service.finish();
   });


   // *Running all the endpoints test suits:
   require('./endpoints/credentials.js');
   require('./endpoints/apps.js');
   require('./endpoints/accesses.js');

});
