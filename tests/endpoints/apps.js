'use strict';

// *Requiring the test library:
const { expect } = require('chai');

// *Requiring the test utils:
const { req, resetAPI, setCredentials, credentialsHeaders } = require('../test-utils.js');

// *Defining the test credentials:
const test_credentials = {user: 'apps-test-user', pass: 'apps-test-pass'};
// *Defining the default test credentials header:
const credentials_header = credentialsHeaders(test_credentials.user, test_credentials.pass);



describe('Apps', function(){

   // *Cleaning the API before this tests suit starts:
   before('Resetting the API', function(){
      // *Setting a high timeout, since the cleaning process might take some time:
      this.timeout(3000);
      // *Issuing a request that will clear the API:
      return resetAPI();
   });


   // *Cleaning the API after this tests suit is done:
   after('Resetting the API', function(){
      // *Setting a high timeout, since the cleaning process might take some time:
      this.timeout(3000);
      // *Issuing a request that will clear the API:
      return resetAPI();
   });


   // *Setting the credentials for the tests, before this suit starts:
   before('Setting the test credentials', function(){
      // *Setting a high timeout, since the cleaning process might take some time:
      this.timeout(3000);
      // *Setting the credentials:
      return setCredentials(test_credentials.user, test_credentials.pass);
   });


   describe('Add', function(){

      it('400s if attemps to register an app without name', function(){
         // *Trying to register an app without name:
         return req('POST', 'http://localhost/api/v1/apps', undefined, credentials_header)
            // *Expecting that the server responds with an error:
            .then(res => expect(res.statusCode).to.equal(400));
      });


      it('400s if attemps to register an app with invalid name', function(){
         // *Defining the app name:
         const name = 'apps-aa/aa';

         // *Trying to register an app with an invalid name:
         return req('POST', 'http://localhost/api/v1/apps', { name }, credentials_header)
            // *Expecting that the server responds with an error:
            .then(res => expect(res.statusCode).to.equal(400));
      });


      it('201s if an valid app has been successfully registered', function(){
         // *Defining the app name:
         const name = 'apps-my-valid_app4name1';

         // *Trying to register an app with a valid name:
         return req('POST', 'http://localhost/api/v1/apps', { name }, credentials_header)
            // *Expecting that the app could be added:
            .then(res => expect(res.statusCode).to.equal(201));
      });


      it('409s if it attempts to register an app twice', function(){
         // *Defining the app name:
         const name = 'apps-repeated-app-name';

         // *Registering an app:
         return req('POST', 'http://localhost/api/v1/apps', { name }, credentials_header)
            // *Testing if the app could be added:
            .then(res => expect(res.statusCode).to.equal(201))
            // *Trying to register the same app name again:
            .then(() => req('POST', 'http://localhost/api/v1/apps', { name }, credentials_header))
            // *Expecting that the server responds with an error:
            .then(res => expect(res.statusCode).to.equal(409));
      });


      it('401s if attemps to register an app with invalid credentials', function(){
         // *Trying to register an app with invalid credentials:
         return req('POST', 'http://localhost/api/v1/apps')
            // *Expecting that the server responds with an error:
            .then(res => expect(res.statusCode).to.equal(401));
      });

   });


   describe('Remove', function(){

      it('404s if it attempts to remove an app that does not exist', function(){
         // *Defining the app name:
         const name = 'apps-app-name-that-does-not-exists-1';

         // *Trying to remove an app that does not exist:
         return req('DELETE', 'http://localhost/api/v1/apps/' + name, undefined, credentials_header)
            // *Expecting that the server responds with an error:
            .then(res => expect(res.statusCode).to.equal(404));
      });


      it('200s if an existing app has been successfully removed', function(){
         // *Defining the app name:
         const name = 'apps-delete-app-name-1';

         // *Registering an app:
         return req('POST', 'http://localhost/api/v1/apps', { name }, credentials_header)
            // *Testing if the app could be added:
            .then(res => expect(res.statusCode).to.equal(201))
            // *Trying to remove it:
            .then(() => req('DELETE', 'http://localhost/api/v1/apps/' + name, undefined, credentials_header))
            // *Testing if the app could be removed:
            .then(res => expect(res.statusCode).to.equal(200));
      });


      it('401s if attemps to remove an app with invalid credentials', function(){
         // *Defining the app name:
         const name = 'apps-delete-app-name-2';

         // *Registering an app:
         return req('POST', 'http://localhost/api/v1/apps', { name }, credentials_header)
            // *Testing if the app could be added:
            .then(res => expect(res.statusCode).to.equal(201))
            // *Trying to remove it with invalid credentials:
            .then(() => req('DELETE', 'http://localhost/api/v1/apps/' + name))
            // *Expecting that the server responds with an error:
            .then(res => expect(res.statusCode).to.equal(401));
      });

   });

});
