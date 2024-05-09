"use strict";

// src/es/mySymbol.ts
var forMap = {};
function MySymbol(description = "") {
  if (new.target) {
    throw new Error("MySymbol is not a constructor");
  }
  const _description = description === void 0 ? "" : String(description);
  return /* @__PURE__ */ Object.create({
    toString() {
      return `MySymbol(${_description})`;
    },
    valueOf() {
      return `MySymbol(${_description})`;
    }
  });
}
MySymbol.for = function(description) {
  const _description = String(description);
  return forMap[_description] ? forMap[_description] : forMap[_description] = MySymbol(_description);
};
MySymbol.keyFor = function(symbol) {
  if (!symbol || typeof symbol !== "object" || !symbol?.toString().startsWith("MySymbol(")) {
    throw new Error(`${symbol} is not a MySymbol`);
  }
  for (let key in forMap) {
    if (forMap[key] === symbol)
      return key;
  }
};

// src/es/mySymbol.spec.ts
test("run TesNewFunc", () => {
  console.log("================test Symbol ==========");
  const a1 = Symbol("a");
  const a2 = Symbol("a");
  const a3 = Symbol.for("a");
  const a4 = Symbol.for("a");
  const k1 = Symbol.keyFor(a1);
  const k2 = Symbol.keyFor(a4);
  console.log("a1 === a2", a1 === a2);
  console.log("a1 === a3", a1 === a3);
  console.log("a3 === a4", a3 === a4);
  console.log("a1", a1);
  console.log("a1 k1", k1);
  console.log("a4 k1", k2);
  console.log("typeof a2", typeof a2);
  console.log("================test MySymbol ==========");
  MySymbol();
});
test("MySymbol() returned a value", () => {
  const _MySymbol = vi.fn(MySymbol);
  _MySymbol();
  expect(_MySymbol).toHaveReturned();
});
test("MySymbol cannot be instantiated", () => {
  expect(() => new MySymbol()).toThrowError(new Error("MySymbol is not a constructor"));
});
test(`MySymbol('a') === MySymbol('a')`, () => {
  let a1 = MySymbol("a");
  let a2 = MySymbol("a");
  expect(a1 === a2).toBe(false);
});
test(`MySymbol('a').toString()`, () => {
  expect(MySymbol("a").toString()).toBe("MySymbol(a)");
});
test(`MySymbol('a').valueOf()`, () => {
  expect(MySymbol("a").valueOf()).toBe("MySymbol(a)");
});
test(`MySymbol.for('a')`, () => {
  expect(MySymbol.for("a") === MySymbol("a")).toBe(false);
  expect(MySymbol.for("a") === MySymbol.for("a")).toBe(true);
  expect(MySymbol.for("b") === MySymbol.for("b")).toBe(true);
  expect(MySymbol.for("a") === MySymbol.for("b")).toBe(false);
});
test(`MySymbol.keyFor(symbol) param`, () => {
  expect(MySymbol.keyFor()).toThrowError(new Error("undefined is not a MySymbol"));
});
test(`MySymbol.keyFor(symbol)`, () => {
  let a1 = MySymbol("a1");
  let b1 = MySymbol.keyFor(a1);
  expect(b1 === "a1").toBe(false);
  let a2 = MySymbol.for("a2");
  let b2 = MySymbol.keyFor(a2);
  expect(b2 === "a2").toBe(true);
});
