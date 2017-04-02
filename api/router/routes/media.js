module.exports = (mongoose, worker) => {


   function get(req, res, next){
      const app = req.params.app;
      const media = req.params.media;

      worker.get(app, media)
         .then(file_path => {
            res.status(200).sendFile(file_path);
         })
         .catch(err => {
            res.status(500).end();
         });
   }


   function save(req, res, next){
      const app = req.params.app;
      const base64 = req.body.media;

      worker.save(app, base64)
         .then(name => {
            res.status(201).json({ name }).end();
         })
         .catch(err => {
            res.status(500).end();
         });
   }


   function remove(req, res, next){
      const app = req.params.app;
      const media = req.params.media;

      worker.remove(app, media)
         .then(() => {
            res.status(200).end();
         })
         .catch(err => {
            res.status(500).end();
         });
   }



   // *Returning the middlewares:
   return { get, save, remove };
};
