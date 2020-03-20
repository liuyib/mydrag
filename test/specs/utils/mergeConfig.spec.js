var expect = require('chai').expect;
var mergeConfig = require('../../../src/utils').mergeConfig;

describe('utils::mergeConfig', function() {
  it('should be immutable', function() {
    var a = { foo: 123 };
    var b = { bar: 222 };

    mergeConfig(a, b);

    expect(typeof a.bar).to.equal('undefined');
    expect(typeof b.foo).to.equal('undefined');
  });

  it('should merge properties', function() {
    var a = { foo: 111, bar: 222, baz: 333 };
    var b = { foo: 123, baz: 456 };
    var c = mergeConfig(a, b);

    expect(c).to.deep.equal({ foo: 123, bar: 222, baz: 456 });
  });
});
