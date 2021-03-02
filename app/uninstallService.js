const Service = require('node-windows').Service;
const path = require('path');
require('dotenv').config();

const svc = new Service({
  name: process.env.SVC_NAME,
  script: path.resolve('server.js'),
});

svc.on('uninstall', () => {
  console.log('Uninstall complete.');
  console.log('The service exists: ', svc.exists);
});

// Uninstall the service.
svc.uninstall();
