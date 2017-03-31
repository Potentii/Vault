'use strict';

// *Requiring the test library:
const { expect } = require('chai');

// *Requiring the test utils:
const { req, resetAPI, credentialsHeaders } = require('../test-utils.js');


describe('Credentials', function(){

   // *Cleaning the API before each test starts:
   beforeEach('Resetting the API', function(){
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


   describe('Update', function(){

      it('401s if it attempts to update the credentials before they get set', function(){
         // *Trying to update the credentials before setting them:
         return req('PUT', process.env.TEST_HOST + 'api/v1/credentials')
            // *Expecting that the server responds with an error:
            .then(res => expect(res.statusCode).to.equal(401));
      });


      it('401s if it attempts to update the credentials with invalid auth headers', function(){
         // *Defining the test credentials:
         const user = 'aaa';
         const pass = 'bbb';

         // *Trying to set the credentials:
         return req('POST', process.env.TEST_HOST + 'api/v1/credentials', { user, pass })
            // *Expecting that the credentials could be set:
            .then(res => expect(res.statusCode).to.equal(200))
            // *Trying to update the credentials:
            .then(() => req('PUT', process.env.TEST_HOST + 'api/v1/credentials'))
            // *Expecting that the server responds with an error:
            .then(res => expect(res.statusCode).to.equal(401));
      });


      it('200s if the credentials have been successfully updated', function(){
         // *Defining the test credentials:
         const user = 'aaa';
         const pass = 'bbb';

         // *Defining the new test credentials:
         const new_user = 'ccc';
         const new_pass = 'ddd';

         // *Trying to set the credentials:
         return req('POST', process.env.TEST_HOST + 'api/v1/credentials', { user, pass })
            // *Expecting that the credentials could be set:
            .then(res => expect(res.statusCode).to.equal(200))
            // *Trying to update the credentials:
            .then(() => req('PUT', process.env.TEST_HOST + 'api/v1/credentials', { user: new_user, pass: new_pass }, credentialsHeaders(user, pass)))
            // *Expecting that the credentials could be updated:
            .then(res => expect(res.statusCode).to.equal(200))
      });

   });


   describe('Erase', function(){

      it('401s if it attempts to erase the credentials before they get set', function(){
         // *Trying to erase the credentials before setting them:
         return req('DELETE', process.env.TEST_HOST + 'api/v1/credentials')
            // *Expecting that the server responds with an error:
            .then(res => expect(res.statusCode).to.equal(401));
      });


      it('401s if it attempts to erase the credentials with invalid auth headers', function(){
         // *Defining the test credentials:
         const user = 'aaa';
         const pass = 'bbb';

         // *Trying to set the credentials:
         return req('POST', process.env.TEST_HOST + 'api/v1/credentials', { user, pass })
            // *Expecting that the credentials could be set:
            .then(res => expect(res.statusCode).to.equal(200))
            // *Trying to erase the credentials:
            .then(() => req('DELETE', process.env.TEST_HOST + 'api/v1/credentials'))
            // *Expecting that the server responds with an error:
            .then(res => expect(res.statusCode).to.equal(401));
      });


      it('200s if the credentials have been successfully erased', function(){
         // *Defining the test credentials:
         const user = 'aaa';
         const pass = 'bbb';

         // *Trying to set the credentials:
         return req('POST', process.env.TEST_HOST + 'api/v1/credentials', { user, pass })
            // *Expecting that the credentials could be set:
            .then(res => expect(res.statusCode).to.equal(200))
            // *Trying to erase the credentials:
            .then(() => req('DELETE', process.env.TEST_HOST + 'api/v1/credentials', undefined, credentialsHeaders(user, pass)))
            // *Expecting that the credentials could be erased:
            .then(res => expect(res.statusCode).to.equal(200));
      });

   });


   describe('Set', function(){

      it('400s if it attempts to set the credentials without user or pass', function(){
         // *Trying to set the credentials without the user/pass:
         return req('POST', process.env.TEST_HOST + 'api/v1/credentials', {user: null, pass: null})
            // *Expecting that the server responds with an error:
            .then(res => expect(res.statusCode).to.equal(400));
      });


      it('200s if the credentials have been successfully set', function(){
         // *Defining the test credentials:
         const user = 'aaa';
         const pass = 'bbb';

         // *Trying to set the credentials:
         return req('POST', process.env.TEST_HOST + 'api/v1/credentials', { user, pass })
            // *Expecting that the credentials could be set:
            .then(res => expect(res.statusCode).to.equal(200));
      });


      it('405s if it attempts to set the credentials twice', function(){
         // *Defining the test credentials:
         const user = 'aaa';
         const pass = 'bbb';

         // *Trying to set the credentials:
         return req('POST', process.env.TEST_HOST + 'api/v1/credentials', { user, pass })
            // *Expecting that the credentials could be set:
            .then(res => expect(res.statusCode).to.equal(200))
            // *Trying to set the credentials again:
            .then(() => req('POST', process.env.TEST_HOST + 'api/v1/credentials', { user, pass }))
            // *Expecting that the server responds with an error:
            .then(res => expect(res.statusCode).to.equal(405));
      });

   });

});
