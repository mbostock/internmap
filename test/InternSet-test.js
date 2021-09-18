import assert from "assert";
import {InternSet} from "../src/index.js";

class Value {
  constructor(value) {
    this._value = value;
  }
  valueOf() {
    return this._value;
  }
}

it("InternSet is an instanceof Set", () => {
  assert(new InternSet() instanceof Set);
});

it("InternSet(null) returns an empty set", () => {
  assert.strictEqual(new InternSet(null).size, 0);
});

basicTest("strings", "a", "b", "c");
basicTest("numbers", 1, 2, 3);
basicTest("dates", new Date(Date.UTC(2001, 0, 1)), new Date(Date.UTC(2002, 0, 1)), new Date(Date.UTC(2003, 0, 1)));
basicTest("custom", new Value(1), new Value(2), new Value(3));

function basicTest(name, a, b, c) {
  it(`InternSet(${name})`, () => {
    const values = [a, b];
    const set = new InternSet([a, b, b]);
    assert.deepStrictEqual([...set], values);
    assert.deepStrictEqual([...set.values()], values);
    assert.deepStrictEqual([...set.entries()], values.map(value => [value, value]));
    assert.strictEqual(set.has(a), true);
    assert.strictEqual(set.has(b), true);
    assert.strictEqual(set.has(c), false);
    assert.strictEqual(set.delete(b), true);
    assert.strictEqual(set.has(b), false);
  });
}

it(`InternSet(values) returns the first of heterogeneous types`, () => {
  const x = Date.UTC(2001, 0, 1);
  const d = new Date(x);
  const set1 = new InternSet([x, d]);
  assert.strictEqual(set1.has(x), true);
  assert.strictEqual(set1.has(d), true);
  assert.deepStrictEqual([...set1.values()], [x]);
  assert.strictEqual(set1.delete(x), true);
  assert.strictEqual(set1.has(x), false);
  assert.strictEqual(set1.has(d), false);
  const set2 = new InternSet([d, x]);
  assert.strictEqual(set2.has(x), true);
  assert.strictEqual(set2.has(d), true);
  assert.deepStrictEqual([...set2.values()], [d]);
  assert.strictEqual(set2.delete(d), true);
  assert.strictEqual(set2.has(x), false);
  assert.strictEqual(set2.has(d), false);
});
