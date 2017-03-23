
module.exports = mongoose => {
   // *Getting the dependencies:
   const credentials = require('../../configs/credentials.js');

   function setup(req, res, next){

      if(credentials.isSet()){
         const user = req.headers['Auth-User'];
         const pass = req.headers['Auth-Pass'];

         if(credentials.match(user, pass)){
            const new_user = req.body.user;
            const new_pass = req.body.pass;
         } else{

         }

      } else{
         const user = req.body.user;
         const pass = req.body.pass;

         credentials.set(user, pass);
      }

   }

   return { setup };
};
