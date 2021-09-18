import {InternMap} from "../src/index.js";
import assert from "assert";

class Value {
  constructor(value) {
    this._value = value;
  }
  valueOf() {
    return this._value;
  }
}

it("InternMap is an instanceof Map", () => {
  assert(new InternMap() instanceof Map);
});

it("InternMap(null) returns an empty set", () => {
  assert.strictEqual(new InternMap(null).size, 0);
});

basicTest("strings", "a", "b", "c");
basicTest("numbers", 1, 2, 3);
basicTest("dates", new Date(Date.UTC(2001, 0, 1)), new Date(Date.UTC(2002, 0, 1)), new Date(Date.UTC(2003, 0, 1)));
basicTest("custom", new Value(1), new Value(2), new Value(3));

function basicTest(name, a, b, c) {
  it(`InternMap(${name})`, () => {
    const entries = [[a, 1], [b, 2]];
    const map = new InternMap([[a, 1], [b, 1], [b, 2]]);
    assert.deepStrictEqual([...map], entries);
    assert.deepStrictEqual([...map.keys()], entries.map(([key]) => key));
    assert.deepStrictEqual([...map.values()], entries.map(([, value]) => value));
    assert.deepStrictEqual([...map.entries()], entries);
    assert.strictEqual(map.has(a), true);
    assert.strictEqual(map.has(b), true);
    assert.strictEqual(map.has(c), false);
    assert.strictEqual(map.get(a), 1);
    assert.strictEqual(map.get(b), 2);
    assert.strictEqual(map.get(c), undefined);
    assert.strictEqual(map.delete(b), true);
    assert.strictEqual(map.has(b), false);
    assert.strictEqual(map.get(b), undefined);
  });
}

it(`InternMap(entries) returns the first of heterogeneous types`, () => {
  const x = Date.UTC(2001, 0, 1);
  const d = new Date(x);
  const map1 = new InternMap([[x, "number"], [d, "date"]]);
  assert.strictEqual(map1.get(x), "date");
  assert.strictEqual(map1.get(d), "date");
  assert.deepStrictEqual([...map1.entries()], [[x, "date"]]);
  assert.strictEqual(map1.delete(x), true);
  assert.strictEqual(map1.has(x), false);
  assert.strictEqual(map1.has(d), false);
  const map2 = new InternMap([[d, "date"], [x, "number"]]);
  assert.strictEqual(map2.get(x), "number");
  assert.strictEqual(map2.get(d), "number");
  assert.deepStrictEqual([...map2.entries()], [[d, "number"]]);
  assert.strictEqual(map2.delete(x), true);
  assert.strictEqual(map2.has(x), false);
  assert.strictEqual(map2.has(d), false);
});
