/**
 * Represents a error with a custom code
 */
class CodeError extends Error{

   /**
    * Builds a new CodeError
    * @param {string} message The human-readable error message
    * @param {*} code         The error code
    */
   constructor(message, code){
      super(message);
      this._code = code;
   }



   /**
    * The error code
    * @readonly
    * @type {*}
    */
   get code(){
      return this._code;
   }

}



// *Exporting the error definition:
module.exports = CodeError;
