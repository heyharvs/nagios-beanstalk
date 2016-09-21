'use strict';

var AWS = require('aws-sdk');

// pull from commandline
var accessKeyId = process.argv[2];
var secretAccessKey = process.argv[3];
var region = process.argv[4];
var environment = process.argv[5];

// validate that we have credentials
if (!accessKeyId || !secretAccessKey || !region || !environment) {
  console.log(`Usage: nagios-beanstalk <accessKeyId> <secretAccessKey> <region> <environment>`);
  process.exit(1);
}

// configure instance
AWS.config.update({
  'accessKeyId': accessKeyId,
  'secretAccessKey': secretAccessKey,
  'region': region,
});

// ensure proper version
AWS.config.apiVersion = {
  elasticbeanstalk: '2010-12-01'
}

// use bluebird for all promises
AWS.config.setPromisesDependency(require('bluebird'));

// get instance
var elasticbeanstalk = new AWS.ElasticBeanstalk();
elasticbeanstalk.describeEnvironmentHealth({
  AttributeNames: ["All"],
  EnvironmentName: environment
}).promise()
.then(response => {
  switch (response.Color) {
    case "Green":
      console.log(`OK - ${environment} in ${region} ${response.Causes.join(" | ")}`);
      process.exit(0);
      break;
    case "Yellow":
      console.log(`WARNING - ${environment} in ${region} ${response.Causes.join(" | ")}`);
      process.exit(1);
      break;
    case "Red":
      console.log(`ERROR - ${environment} in ${region} ${response.Causes.join(" | ")}`);
      process.exit(2);
      break;
  }
})
.catch(err => {
  console.log(`ERROR ${err}`);
  process.exit(3);
});
