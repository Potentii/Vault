// *Getting the needed modules:
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const mime = require('mime');
const CodeError = require('../errors/code-error.js');

// *Defining the regexes:
const BASE64_MIME_REGEX = /^data:(.*?);/i;
const BASE64_CONTENT_REGEX = /^data:.*?;base64,(.*)$/i;
const SANITIZE_PATH_ITEM_REGEX = new RegExp('[' + JSON.stringify(path.sep) + ']', 'g');



/**
 * Removes all the path breaking characters from a given string
 * @param  {string} name The path item
 * @return {string}      The sanitized item
 */
function sanitizePathItem(name){
   return name.replace(SANITIZE_PATH_ITEM_REGEX, '');
}



/**
 * Represents a disk worker
 */
class Worker{

   /**
    * Builds a new worker for a given content directory
    * @param  {string} dir The base directory this worker will operate on
    */
   constructor(dir){
      // *Setting the directory:
      this._dir = dir;
   }



   /**
    * Generates the expected path for a resource
    * @param  {string} [app='']   The app name
    * @param  {string} [media=''] The media name (including its extension)
    * @return {string}            The resource path
    */
   buildPath(app = '', media = ''){
      // *Sanitizing the app name:
      app = sanitizePathItem(app);
      // *Sanitizing the media name, or erasing it if the app name wasn't set:
      media = app ? sanitizePathItem(media) : '';
      // *Returning the path:
      return path.join(this.dir, app, media);
   }



   /**
    * Retrieves the media's full absolute path on disk
    * @param  {string} app      The app name
    * @param  {string} media    The media name (including its extension)
    * @return {Promise<string>} Resolves into the media absolute path, or rejects on error
    */
   get(app, media){
      // *Returning the promise:
      return new Promise((resolve, reject) => {
         // *Building the file path:
         const file_path = this.buildPath(app, media);

         // *Throwing an error if the file does not exist:
         if(!fs.existsSync(file_path))
            throw new CodeError('File not found', 'ENOENT');

         // *Resolving with the file path otherwise:
         resolve(file_path);
      });
   }



   /**
    * Creates an app folder inside the content directory
    * @param  {string} app The app name
    * @return {Promise}    Resolves if the folder could be created, or rejects on error
    */
   createAppFolder(app){
      // *Returning the promise:
      return new Promise((resolve, reject) => {
         // *Creating the folder on disk:
         fs.mkdir(this.buildPath(app), err => {
            // *Checking if some error happened:
            if(err)
               // *If it has:
               // *Checking the error code:
               switch(err.code){
                  // *Resolving if the folder already exists:
                  case 'EEXIST': return resolve();
                  // *Rejecting on other error codes:
                  default: return reject(err);
               }

            // *Resolving the promise:
            resolve();
         });
      });
   }



   /**
    * Creates a new media file on disk
    * @param  {string} app      The app name
    * @param  {string} base64   A valid base64 encoded file string
    * @return {Promise<string>} Resolves into the generated file name, or rejects on error
    */
   save(app, base64){
      // *Returning the promise:
      return new Promise((resolve, reject) => {

         // *Throwing an error, if base64 isn't a string:
         if(typeof base64 !== 'string')
            throw new CodeError('\"base64\" must be a valid base64 encoded string', 'ETYPE');

         // *Extracting the mime type:
         const mime_type = BASE64_MIME_REGEX.exec(base64)[1];
         // *Getting the extension:
         const extension = mime.extension(mime_type);
         // *Extracting the media content:
         const content = BASE64_CONTENT_REGEX.exec(base64)[1];

         // *Throwing an error, if the base64 media could not be parsed:
         if(!mime_type || !extension || !content)
            throw new CodeError('\"base64\" must be a valid base64 encoded string', 'EPARSE');

         // *Creating the app folder:
         this.createAppFolder(app)
            .then(() => {
               // *Initializing the file name variables:
               let file_path = '';
               let name = '';
               // *Initializing the file name generation flags:
               let tries = 0;
               let name_available = false;

               do{
                  // *Generating the file name:
                  name = uuid.v4() + '.' + extension;
                  // *Building the file path:
                  file_path = this.buildPath(app, name);
                  // *Checking if the name is available:
                  name_available = !fs.existsSync(file_path);
                  // *Increasing the tries counter:
                  tries++;

                  // *Throwing an error, if it could not generate a unique name until the fourth try:
                  if(tries==4 && !name_available)
                     throw new CodeError('Couldn\'t generate an available file name', 'EUNAVAIL');

                  // *Running until the file name is available four times at max:
               } while(!name_available || tries<4);

               // *Creating the media file:
               fs.writeFile(file_path, content, 'base64', err => {
                  // *Rejecting if some error happened:
                  if(err) return reject(err);
                  // *Resolving with the generated file name:
                  resolve(name);
               });
            }, err => reject(err));
      })
   }



   /**
    * Removes a media file from disk
    * @param  {string} app   The app name
    * @param  {string} media The media file name (including its extension)
    * @return {Promise}      Resolves if it could remove, or rejects on error
    */
   remove(app, media){
      // *Returning the promise:
      return new Promise((resolve, reject) => {
         // *Building the file path:
         const file_path = this.buildPath(app, media);

         // *Checking if the file even exists:
         if(fs.existsSync(file_path)){
            // *If it does:
            // *Removing it:
            fs.unlink(file_path, err => {
               // *Rejecting if some error happened:
               if(err) return reject(err);
               // *Resolving otherwise:
               resolve();
            });
         } else{
            // *If it doesn't:
            // *Resolving it:
            resolve();
         }
      });
   }



   /**
    * Tests if this worker can operate on the content directory
    * @return {Promise} Resolves if it can, or rejects on error
    */
   test(){
      // *Returning the promise:
      return new Promise((resolve, reject) => {
         // *Checking the access level on the content directory:
         fs.access(this.dir, fs.constants.R_OK | fs.constants.W_OK, err => {
            // *Rejecting if some error happened:
            if(err) return reject(err);
            // *Resolving it if the access level has been satisfied:
            resolve();
         });
      });
   }



   /**
    * The normalized content directory set for this worker
    * @readonly
    * @type {string}
    */
   get dir(){
      return path.normalize(this._dir);
   }

}



// *Exporting the worker class:
module.exports = Worker;
