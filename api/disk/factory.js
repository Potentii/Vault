// *Getting the dependencies:
const Worker = require('./worker.js');



/**
 * Generates and tests a new disk worker
 * @param  {object} settings             The options to build the worker
 * @param  {string} settings.content_dir The directory that the worker will operate on
 * @return {Promise<Worker>}             Resolves into the generated Worker, or rejects if the test fails
 */
function generate(settings){
   // *Generating the worker for the given directory:
   const worker = new Worker(settings.content_dir);

   // *Testing the worker and appending it on the promise chain:
   return worker.test()
      .then(() => worker);
}



// *Exporting this module:
module.exports = { generate };
