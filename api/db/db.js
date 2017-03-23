const mongoose = require('mongoose');

mongoose.Promise = Promise;


function connectAndSync(settings){
   // *Returning the connection and model sync promise chain:
   return connect(settings).then(() => sync());
}



function connect({ host, database, port, user, pass }){
   // *Connecting and returning the promise chain:
   return mongoose.connect(host, database, port, {
         user,
         pass,
         server: {poolSize: 4}
      })

      // *Appending the mongoose in the chain:
      .then(() => mongoose);
}



function sync(){
   // *Returning the promise chain:
   return new Promise((resolve, reject) => {
      // *Trying to sync the schema definitions:
      try{
         const Schema = mongoose.Schema;


         // Resolving the promise with mongoose:
         resolve(mongoose);
      } catch(err){
         // *Rejecting the promise if something went wrong:
         reject(err);
      }
   });
}



function disconnect(){
   return mongoose.disconnect();
}



module.exports = {
   connectAndSync,
   connect,
   sync,
   disconnect
};
