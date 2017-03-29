'use strict';

// *Requiring the test library:
const { expect } = require('chai');

// *Requiring the test utils:
const { req, resetAPI, setCredentials, credentialsHeaders } = require('../test-utils.js');

// *Defining the test credentials:
const test_credentials = {user: 'accesses-test-user', pass: 'accesses-test-pass'};
// *Defining the default test credentials header:
const credentials_header = credentialsHeaders(test_credentials.user, test_credentials.pass);



describe('Accesses', function(){

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

      it('404s if it attempts to create an access for an app that doesn\'t exist', function(){
         // *Defining the app name:
         const name = 'access-app-name-that-does-not-exists';

         // *Trying to create an access for an app that doesn't exist:
         return req('POST', 'http://localhost/api/v1/apps/' + name + '/accesses', undefined, credentials_header)
            // *Expecting that the server responds with an error:
            .then(res => expect(res.statusCode).to.equal(404));
      });


      it('201s if an access has been successfully created for an existing app', function(){
         // *Defining the app name:
         const name = 'access-app-name-1';

         // *Registering an app:
         return req('POST', 'http://localhost/api/v1/apps', { name }, credentials_header)
            // *Testing if the app could be added:
            .then(res => expect(res.statusCode).to.equal(201))
            // *Trying to create a new access for it:
            .then(() => req('POST', 'http://localhost/api/v1/apps/' + name + '/accesses', undefined, credentials_header))
            // *Testing if the access could be created:
            .then(res => {
               // *Expecting that the access could be created successfully:
               expect(res.statusCode).to.equal(201);
               // *Getting the body object:
               const body = res.body ? JSON.parse(res.body.toString()) : {};
               // *Expecting the body to have the 'key' property:
               expect(body).to.have.ownProperty('key');
               // *Expecting that the generated key is an UUID string:
               expect(body.key).to.match(/^[\w\d]{8}\-[\w\d]{4}\-[\w\d]{4}\-[\w\d]{4}\-[\w\d]{12}$/i);
            });
      });


      it('401s if it attempts to create an access for an app with invalid credentials', function(){
         // *Defining the app name:
         const name = 'access-app-name-2';

         // *Registering an app:
         return req('POST', 'http://localhost/api/v1/apps', { name }, credentials_header)
            // *Testing if the app could be added:
            .then(res => expect(res.statusCode).to.equal(201))
            // *Trying to create a new access for it with invalid credentials:
            .then(() => req('POST', 'http://localhost/api/v1/apps/' + name + '/accesses'))
            // *Expecting that the server responds with an error:
            .then(res => expect(res.statusCode).to.equal(401));
      });

   });


   describe('Retrieve', function(){

      it('404s if it attempts to retrieve accesses of an app that doesn\'t exist', function(){
         // *Defining the app name:
         const name = 'access-app-name-that-does-not-exists';

         // *Trying to retrieve the accesses of an app that doesn't exist:
         return req('GET', 'http://localhost/api/v1/apps/' + name + '/accesses', undefined, credentials_header)
            // *Expecting that the server responds with an error:
            .then(res => expect(res.statusCode).to.equal(404));
      });


      it('200s if the accesses of an existing app have been successfully retrieved', function(){
         // *Defining the app name:
         const name = 'access-app-name-3';

         // *Registering an app:
         return req('POST', 'http://localhost/api/v1/apps', { name }, credentials_header)
            // *Testing if the app could be added:
            .then(res => expect(res.statusCode).to.equal(201))

            // *Trying to create a new access for it:
            .then(() => req('POST', 'http://localhost/api/v1/apps/' + name + '/accesses', undefined, credentials_header))
            // *Expecting that the access could be created successfully:
            .then(res => expect(res.statusCode).to.equal(201))

            // *Trying to create a new access for it:
            .then(() => req('POST', 'http://localhost/api/v1/apps/' + name + '/accesses', undefined, credentials_header))
            // *Expecting that the access could be created successfully:
            .then(res => expect(res.statusCode).to.equal(201))

            // *Trying to retrieve the app's accesses:
            .then(() => req('GET', 'http://localhost/api/v1/apps/' + name + '/accesses', undefined, credentials_header))
            // *Testing if the accesses could be retrieved:
            .then(res => {
               // *Expecting that the accesses could be retrieved successfully:
               expect(res.statusCode).to.equal(200);
               // *Getting the body object:
               const body = res.body ? JSON.parse(res.body.toString()) : {};
               // *Expecting the body to be an array:
               expect(body).to.be.instanceOf(Array);
               // *Expecting that the array have all the added accesses:
               expect(body.length).to.equal(2);
            });
      });


      it('401s if it attempts to retrieve accesses of an app with invalid credentials', function(){
         // *Defining the app name:
         const name = 'access-app-name-4';

         // *Registering an app:
         return req('POST', 'http://localhost/api/v1/apps', { name }, credentials_header)
            // *Testing if the app could be added:
            .then(res => expect(res.statusCode).to.equal(201))

            // *Trying to create a new access for it:
            .then(() => req('POST', 'http://localhost/api/v1/apps/' + name + '/accesses', undefined, credentials_header))
            // *Expecting that the access could be created successfully:
            .then(res => expect(res.statusCode).to.equal(201))

            // *Trying to retrieve the app's accesses with invalid credentials:
            .then(() => req('GET', 'http://localhost/api/v1/apps/' + name + '/accesses'))
            // *Expecting that the server responds with an error:
            .then(res => expect(res.statusCode).to.equal(401));
      });

   });


   describe('Remove', function(){

      it('200s if the accesses of an app have been successfully removed', function(){
         // *Defining the app name:
         const name = 'access-remove-app-name-1';

         // *Registering an app:
         return req('POST', 'http://localhost/api/v1/apps', { name }, credentials_header)
            // *Testing if the app could be added:
            .then(res => expect(res.statusCode).to.equal(201))

            // *Trying to create a new access for it:
            .then(() => req('POST', 'http://localhost/api/v1/apps/' + name + '/accesses', undefined, credentials_header))
            // *Expecting that the access could be created successfully:
            .then(res => expect(res.statusCode).to.equal(201))

            // *Trying to create a new access for it:
            .then(() => req('POST', 'http://localhost/api/v1/apps/' + name + '/accesses', undefined, credentials_header))
            // *Expecting that the access could be created successfully:
            .then(res => expect(res.statusCode).to.equal(201))

            // *Trying to remove all the accesses of this app:
            .then(() => req('DELETE', 'http://localhost/api/v1/apps/' + name + '/accesses', undefined, credentials_header))
            // *Expecting that the accesses could be removed successfully:
            .then(res => expect(res.statusCode).to.equal(200));
      });


      it('401s if it attempts to remove an app\'s accesses with invalid credentials', function(){
         // *Defining the app name:
         const name = 'access-remove-app-name-2';

         // *Registering an app:
         return req('POST', 'http://localhost/api/v1/apps', { name }, credentials_header)
            // *Testing if the app could be added:
            .then(res => expect(res.statusCode).to.equal(201))

            // *Trying to create a new access for it:
            .then(() => req('POST', 'http://localhost/api/v1/apps/' + name + '/accesses', undefined, credentials_header))
            // *Expecting that the access could be created successfully:
            .then(res => expect(res.statusCode).to.equal(201))

            // *Trying to remove all the accesses of this app with invalid credentials:
            .then(() => req('DELETE', 'http://localhost/api/v1/apps/' + name + '/accesses'))
            // *Expecting that the server responds with an error:
            .then(res => expect(res.statusCode).to.equal(401));
      });

   });

});
