#!/usr/bin/env node
'use strict';
/**
 * Standalone initialization application
 */

// *Requiring the service module:
const service = require('./api/main.js');



// *When process is interrupted, finishing the program:
process.on('SIGINT', service.finish);

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
      service.finish();
   });
