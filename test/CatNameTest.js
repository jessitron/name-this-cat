let assert = require("assert");
let CatName = require("../CatName");

describe('CatName', function () {
  it('requires at least one letter', () => {
    assert.throws(() => {
      new CatName("123");
    });
  });

  it('does not accept very long strings', () => {
    assert.throws(() => {
      new CatName("a234567890123456789012345678");
    });
  });

  it('keeps the cat name', () => {
    const pixie = new CatName("Pixie");
    assert.equal(pixie.text, "Pixie");
  })
});