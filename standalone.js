#!/usr/bin/env node
'use strict';
/**
 * Standalone initialization script
 */

// *Requiring the service module:
const service = require('.');



// *When process is interrupted, finishing the program:
process.on('SIGINT', kill);

// *When the process doesn't have any other task left:
process.on('exit', code => {
   // *Logging it out:
   console.log('Vault finished');
});



// *Starting the service:
service.start()
   .then(info => {
      // *Logging the service information:
      console.log('Vault started @ ' + info.address.href);
   })
   .catch(err => {
      // *If some error happens:
      // *Logging the error:
      console.error(err);
      // *Finishing the service:
      kill();
   });



/**
 * Finishes all the services, and then kills the process
 */
function kill(){
   service.finish()
      // *Stopping the process:
      .then(() => process.exit(0))
      .catch(err => {
         // *If some error happens:
         // *Logging the error:
         console.error(err);
         // *Stopping the process:
         process.exit(1);
      });
}
