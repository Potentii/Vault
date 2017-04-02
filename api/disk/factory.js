const Worker = require('./worker.js');



function generate(settings){
   const worker = new Worker(settings.content_dir);

   return worker.test()
      .then(() => worker);
}



module.exports = {
   generate
};
