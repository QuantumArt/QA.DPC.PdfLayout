const Service = require('node-windows').Service;
const path = require('path');
require('dotenv').config();


const svc = new Service({
  name: process.env.SVC_NAME,
  description: process.env.SVC_DESCRIPTION,
  script: path.resolve('server.js'),
  env: [{
    name: 'NODE_ENV',
    value: 'production',
  },
  {
    name: 'PORT',
    value: process.env.PORT,
  },
  {
    name: 'WORKDIR_PATH',
    value: process.env.WORKDIR_PATH,
  },
  {
    name: 'OUTPUT_PATH',
    value: process.env.OUTPUT_PATH,
  },
  {
    name: 'LOGS_PATH',
    value: process.env.LOGS_PATH,
  }
],
});

if (process.env.SVC_LOGIN && process.env.SVC_PASSWORD) {
    svc.logOnAs.account = process.env.SVC_LOGIN;
    svc.logOnAs.password = process.env.SVC_PASSWORD;
}

svc.install();
