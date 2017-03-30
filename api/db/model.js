// *Exporting this module as a function:
module.exports = mongoose => {
   // *Getting the Schema class:
   const Schema = mongoose.Schema;

   // *Defining the App schema:
   const Apps = new Schema({
      name: {
         type: String,
         required: true,
         unique: true,
         match: [/^[a-z0-9\_\-]+$/, 'Invalid app name']
      }
   });

   // *Defining the Access schema:
   const Accesses = new Schema({
      key: {
         type: String,
         required: true,
      },
      _app: {
         type: Schema.Types.ObjectId,
         ref: 'App',
         required: true
      }
   });



   // *Exporting the schemas:
   return { Apps, Accesses};
};
