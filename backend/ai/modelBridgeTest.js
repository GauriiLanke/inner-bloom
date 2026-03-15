const { predictPcosRisk } = require('./ai/modelBridge');

predictPcosRisk({}).then(console.log).catch(err => {
  console.error('TEST ERROR:', err);
});
