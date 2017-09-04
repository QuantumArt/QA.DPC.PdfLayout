const expect = require('chai').expect;
const render = require('../../model');

describe('Model', () => {
  it('exports a function', () => {
    expect(render).to.be.a('function');
  });
});
