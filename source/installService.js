const Service = require('node-windows').Service;
const path = require('path');

const svc = new Service({
  name: 'QA.DPC.Node.PdfGenerator',
  description: 'Generates html for DPC products',
  script: path.resolve('server.js'),
  env: {
    name: 'NODE_ENV',
    value: 'production',
  },
});

svc.on('install', () => {
  svc.start();
});

svc.install();
