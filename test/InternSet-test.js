const {InternSet} = require("../");
const tape = require("tape-await");

class Value {
  constructor(value) {
    this._value = value;
  }
  valueOf() {
    return this._value;
  }
}

tape("InternSet is an instanceof Set", test => {
  test.ok(new InternSet() instanceof Set);
});

basicTest("strings", "a", "b", "c");
basicTest("numbers", 1, 2, 3);
basicTest("dates", new Date(Date.UTC(2001, 0, 1)), new Date(Date.UTC(2002, 0, 1)), new Date(Date.UTC(2003, 0, 1)));
basicTest("custom", new Value(1), new Value(2), new Value(3));

function basicTest(name, a, b, c) {
  tape(`InternSet(${name})`, test => {
    const values = [a, b];
    const set = new InternSet([a, b, b]);
    test.deepEquals([...set], values);
    test.deepEquals([...set.values()], values);
    test.deepEquals([...set.entries()], values.map(value => [value, value]));
    test.equals(set.has(a), true);
    test.equals(set.has(b), true);
    test.equals(set.has(c), false);
  });
}

tape(`InternSet(values) returns the first of heterogeneous types`, test => {
  const x = Date.UTC(2001, 0, 1);
  const d = new Date(x);
  const set1 = new InternSet([x, d]);
  test.equals(set1.has(x), true);
  test.equals(set1.has(d), true);
  test.deepEquals([...set1.values()], [x]);
  const set2 = new InternSet([d, x]);
  test.equals(set2.has(x), true);
  test.equals(set2.has(d), true);
  test.deepEquals([...set2.values()], [d]);
});
