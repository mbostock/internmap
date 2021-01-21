const {InternMap} = require("../");
const tape = require("tape-await");

class Value {
  constructor(value) {
    this._value = value;
  }
  valueOf() {
    return this._value;
  }
}

tape("InternMap is an instanceof Map", test => {
  test.ok(new InternMap() instanceof Map);
});

basicTest("strings", "a", "b", "c");
basicTest("numbers", 1, 2, 3);
basicTest("dates", new Date(Date.UTC(2001, 0, 1)), new Date(Date.UTC(2002, 0, 1)), new Date(Date.UTC(2003, 0, 1)));
basicTest("custom", new Value(1), new Value(2), new Value(3));

function basicTest(name, a, b, c) {
  tape(`InternMap(${name})`, test => {
    const entries = [[a, 1], [b, 2]];
    const map = new InternMap([[a, 1], [b, 1], [b, 2]]);
    test.deepEquals([...map], entries);
    test.deepEquals([...map.keys()], entries.map(([key]) => key));
    test.deepEquals([...map.values()], entries.map(([, value]) => value));
    test.deepEquals([...map.entries()], entries);
    test.equals(map.has(a), true);
    test.equals(map.has(b), true);
    test.equals(map.has(c), false);
    test.equals(map.get(a), 1);
    test.equals(map.get(b), 2);
    test.equals(map.get(c), undefined);
  });
}

tape(`InternMap(entries) returns the first of heterogeneous types`, test => {
  const x = Date.UTC(2001, 0, 1);
  const d = new Date(x);
  const map1 = new InternMap([[x, "number"], [d, "date"]]);
  test.equals(map1.get(x), "date");
  test.equals(map1.get(d), "date");
  test.deepEquals([...map1.entries()], [[x, "date"]]);
  const map2 = new InternMap([[d, "date"], [x, "number"]]);
  test.equals(map2.get(x), "number");
  test.equals(map2.get(d), "number");
  test.deepEquals([...map2.entries()], [[d, "number"]]);
});
