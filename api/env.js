// *Getting the dependencies:
const fs = require('fs');
const dotenv = require('dotenv');



/**
 * Prepares the environment
 * @return {Promise} A promise that resolves if everything went fine, or rejects if some error happens
 */
function load(){
   // *Returning the load promise chain:
   return new Promise((resolve, reject) => {
      // *Setting the default environment as 'production':
      process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'production';

      // *Checking if the configs variable is set:
      if(process.env.CONFIGS){
         // *If it is:
         // *Getting more info about the configs value:
         fs.stat(process.env.CONFIGS, (err, stats) => {
            // *Rejecting if some error has happened:
            if(err) return reject(err);

            // *Rejecting if the configs is not pointing to a file:
            if(!stats.isFile()) return reject(new Error('CONFIGS must point to a file, but instead got \"' + process.env.CONFIGS + '\"'));

            // *Reading the file:
            fs.readFile(process.env.CONFIGS, (err, buff) => {
               // *Rejecting if some error has happened:
               if(err) return reject(err);

               // *Parsing the file content:
               const env = dotenv.parse(buff.toString());

               // *Loading the variables into the environment:
               for(let variable in env){
                  if(env.hasOwnProperty(variable)){
                     process.env[variable] = env[variable];
                  }
               }

               // *Resolving the promise:
               resolve();
            });
         });

      } else{
         // *If it isn't:
         // *Resolving the promise:
         resolve();
      }
   });
}



// *Exporting this module:
module.exports = { load };
