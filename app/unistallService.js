const Service = require('node-windows').Service;
const path = require('path');

const svc = new Service({
  name: 'QA.DPC.Node.PdfGenerator',
  script: path.resolve('server.js'),
});

svc.on('uninstall', () => {
  console.log('Uninstall complete.');
  console.log('The service exists: ', svc.exists);
});

// Uninstall the service.
svc.uninstall();
