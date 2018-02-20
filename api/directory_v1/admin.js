'use strict';
var express = require('express');
var bodyParser = require('body-parser');
const {
  google
} = require('googleapis');
const path = require('path');
const nconf = require('nconf');

var q = require('q');

var apiRouters = express();
apiRouters.use(bodyParser.urlencoded({
  extended: false
}));
apiRouters.use(bodyParser.json());


function getJWTProperties() {
  nconf.argv().env().file(path.join(__dirname, '../jwt.keys.json'));

  // Create JWT auth object
  const jwt = new google.auth.JWT(
    nconf.get('client_email'),
    null,
    nconf.get('private_key'), [
      // 'https://www.googleapis.com/auth/admin.directory.user.readonly',
      // 'https://www.googleapis.com/auth/admin.directory.user',
      'https://www.googleapis.com/auth/admin.reports.usage.readonly'
    ],
    nconf.get('user_id')
  );
  return jwt;
}

function allUsersDriveUsage(jwt){
  var defer = q.defer();
  const admin = google.admin('reports_v1');

  // List Users
  admin.userUsageReport.get({
    userKey: 'all',
    date: '2018-02-17',
    auth: jwt,
    parameters: 'accounts:drive_used_quota_in_mb,accounts:gmail_used_quota_in_mb,accounts:first_name,accounts:last_name'
  }, (err, data) => {
    if (err) {
      console.log(err);      
      defer.reject(err);
    } else {
      // console.log(data);      
      defer.resolve(data);
    }

  });
  return defer.promise;
}

// allUsersDriveUsage
apiRouters.get('/allUsersDriveUsage', function (req, res) {

  const jwt = getJWTProperties();

  // Authorize
  jwt.authorize((err, data) => {
    if (err) {
      throw err;
    }
    // console.log('You have been successfully authenticated: ', data);
    allUsersDriveUsage(jwt).then(function (data) {
      console.log(data.data)
      console.log('allUsersDriveUsage successful')
      return res.json({
        success: true,
        value: data.data
      })
    }, function (err) {
      console.log('allUsersDriveUsage failed')
      return res.json({
        success: false,
        err: err
      })
    });

  });

});

// getCustomerUsageReports

function getCustomerUsageReports(jwt){
  var defer = q.defer();
  const admin = google.admin('reports_v1');

  // List Users
  admin.customerUsageReports.get({
    date: '2018-02-17',
    auth: jwt,
    parameters: 'accounts:num_suspended_users,accounts:num_users'
  }, (err, data) => {
    if (err) {
      console.log(err);      
      defer.reject(err);
    } else {
      // console.log(data);      
      defer.resolve(data);
    }

  });
  return defer.promise;
}

// allUsersDriveUsage
apiRouters.get('/getCustomerUsageReports', function (req, res) {

  const jwt = getJWTProperties();

  // Authorize
  jwt.authorize((err, data) => {
    if (err) {
      throw err;
    }
    // console.log('You have been successfully authenticated: ', data);
    getCustomerUsageReports(jwt).then(function (data) {
      console.log(data.data)
      console.log('getCustomerUsageReports successful')
      return res.json({
        success: true,
        value: data.data
      })
    }, function (err) {
      console.log('getCustomerUsageReports failed')
      return res.json({
        success: false,
        err: err
      })
    });

  });

});


module.exports = apiRouters;


// function listUsers(jwt) {
//   var defer = q.defer();
//   const admin = google.admin('directory_v1');

//   // List Users
//   admin.users.list({
//     customer: nconf.get('customer_id'),
//     auth: jwt
//   }, (err, data) => {
//     if (err) {
//       defer.reject(err);
//     } else {
//       defer.resolve(data);
//       // console.log(data.data.users);
//     }

//   });
//   return defer.promise;
// }

// function getActiveUsers(userList) {
//   return userList.filter(user => user.suspended !== true);
// }

// function getSuspendedUsers(userList) {
//   return userList.filter(user => user.suspended === true);
// }

// // All User List
// apiRouters.get('/userList', function (req, res) {

//   const jwt = getJWTProperties();

//   // Authorize
//   jwt.authorize((err, data) => {
//     if (err) {
//       throw err;
//     }
//     // console.log('You have been successfully authenticated: ', data);
//     listUsers(jwt).then(function (data) {
//       console.log('list users successful')
//       return res.json({
//         success: true,
//         value: data.data.users
//       })
//     }, function (err) {
//       console.log('list users failed')
//       return res.json({
//         success: false,
//         err: err
//       })
//     });

//   });

// });


// // getActiveUsers
// apiRouters.get('/getActiveUsers', function (req, res) {

//   const jwt = getJWTProperties();

//   // Authorize
//   jwt.authorize((err, data) => {
//     if (err) {
//       throw err;
//     }
//     // console.log('You have been successfully authenticated: ', data);
//     listUsers(jwt).then(function (data) {
//       console.log('get Active users successful')
//       return res.json({
//         success: true,
//         value: getActiveUsers(data.data.users)
//       })
//     }, function (err) {
//       console.log('get Active users failed')
//       return res.json({
//         success: false,
//         err: err
//       })
//     });

//   });

// });


// // getSuspendedUsers
// apiRouters.get('/getSuspendedUsers', function (req, res) {

//   const jwt = getJWTProperties();

//   // Authorize
//   jwt.authorize((err, data) => {
//     if (err) {
//       throw err;
//     }
//     // console.log('You have been successfully authenticated: ', data);
//     listUsers(jwt).then(function (data) {
//       console.log('getSuspendedUsers successful')
//       return res.json({
//         success: true,
//         value: getSuspendedUsers(data.data.users)
//       })
//     }, function (err) {
//       console.log('getSuspendedUsers failed')
//       return res.json({
//         success: false,
//         err: err
//       })
//     });

//   });

// });

// // getNumOfUsers
// apiRouters.get('/getNumOfUsers', function (req, res) {

//   const jwt = getJWTProperties();

//   // Authorize
//   jwt.authorize((err, data) => {
//     if (err) {
//       throw err;
//     }
//     // console.log('You have been successfully authenticated: ', data);
//     listUsers(jwt).then(function (data) {
//       console.log('getNumOfUsers successful')
//       return res.json({
//         success: true,
//         value: data.data.users.length
//       })
//     }, function (err) {
//       console.log('getNumOfUsers failed')
//       return res.json({
//         success: false,
//         err: err
//       })
//     });

//   });

// });