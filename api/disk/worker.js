const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const mime = require('mime');


const BASE64_MIME_REGEX = /^data:(.*?);/i;
const BASE64_CONTENT_REGEX = /^data:.*?;base64,(.*)$/i;

function sanitizeURLName(name){
   return name.replace(/[\/\\]/g, '');
}


class Worker{
   constructor(dir){
      this._dir = dir;
   }

   buildPath(app, media){
      app = sanitizeURLName(app);
      media = sanitizeURLName(media);
      return path.join(this.dir, app, media);
   }

   parsePath(file_path){
      // TODO
      return {
         app: '',
         media: ''
      };
   }

   get(app, media){
      return new Promise((resolve, reject) => {
         const file_path = this.buildPath(app, media);
         if(!fs.existsSync(file_path)) return reject(new Error('File not found'));

         resolve(file_path);
      });
   }

   save(app, base64){
      // *Returning the promise:
      return new Promise((resolve, reject) => {

         if(!base64) return reject(new Error());

         // *Getting the mime type:
         const mime_type = BASE64_MIME_REGEX.exec(base64)[1];
         // *Getting the extension:
         const extension = mime.extension(mime_type);
         // *Getting the media content:
         const content = BASE64_CONTENT_REGEX.exec(base64)[1];


         // *Checking if the file data could be set:
         if(!mime_type || !extension || !content) return reject(new Error('Invalid encoded url'));


         // *Initializing the file name variables:
         let file_path = '';
         let name = '';
         // *Initializing the file name creation flags:
         let tries = 0;
         let name_available = false;

         do{
            // *Generating the file name:
            name = uuid.v4() + '.' + file_extension;
            // *Building the file path:
            file_path = this.buildPath(app, name);
            // *Checking if the name is available:
            name_available = !fs.existsSync(file_path);
            // *Increasing the tries counter:
            tries++;

            // *Checking if it's in the fouth try, and the name wasn't available:
            if(tries==4 && !name_available) return reject(new Error('Unavailable file name'));

            // *Running until the file name is available four times at max:
         } while(!name_available || tries<4);


         // *Writing the file:
         fs.writeFile(file_path, content, 'base64', err => {
            // *Checking if there is some error:
            if(err) return reject(err);

            resolve(name);
         });
      });
   }

   remove(app, media){
      // *Returning the promise:
      return new Promise((resolve, reject) => {
         // *Setting the file path:
         let file_path = this.buildPath(app, media);

         // *Checking if the file exists
         if(fs.existsSync(file_path)){
            // *If it exists:
            // *Removing it from media folder:
            fs.unlink(file_path, err => {
               // *Checking if there is some error:
               if(err) return reject(err);

               resolve();
            });
         } else{
            // *If it doesn't exists:
            // *Resolving it:
            resolve();
         }
      });
   }

   test(){
      return new Promise((resolve, reject) => {
         fs.access(this.dir, fs.constants.R_OK | fs.constants.W_OK, err => {
            if(err) return reject(err);
            resolve();
         });
      });
   }

   get dir(){
      return path.normalize(this._dir);
   }
}



module.exports = Worker;
