'use strict';

module.exports = function(Profile) {
  Profile.download = function(name, cb) {
    const https = require('https');
    https.get('https://www.pathofexile.com/character-window/get-characters?accountName=' + name, (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });
      resp.on('end', () => {
        console.log(JSON.parse(data));
        cb(null, data);
      });
    }).on('error', (err) => {
      console.log('error:' + err.message);
    });

  };
  Profile.remoteMethod('download', {
    accepts: {
      arg: 'name', type: 'string'
    },
    http: {
      path: '/download',
      verb: 'get'
    },
    returns: [
      {arg: 'body', type: 'file', root: true},
      {arg: 'Content-Type', type: 'string', http: { target: 'header'}}
    ],
  });

};
