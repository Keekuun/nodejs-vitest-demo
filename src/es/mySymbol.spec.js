"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mySymbol_1 = require("@/es/mySymbol");
test('run TesNewFunc', () => {
    console.log('================test Symbol ==========');
    const a1 = Symbol('a');
    const a2 = Symbol('a');
    const a3 = Symbol.for('a');
    const a4 = Symbol.for('a');
    const k1 = Symbol.keyFor(a1);
    const k2 = Symbol.keyFor(a4);
    // @ts-ignore
    console.log('a1 === a2', a1 === a2); // false
    // @ts-ignore
    console.log('a1 === a3', a1 === a3); // false
    // @ts-ignore
    console.log('a3 === a4', a3 === a4); // true
    console.log('a1', a1);
    console.log('a1 k1', k1);
    console.log('a4 k1', k2);
    console.log('typeof a2', typeof a2);
    // error: Symbol is not a constructor
    // const b = new Symbol('b')
    console.log('================test MySymbol ==========');
    (0, mySymbol_1.MySymbol)();
});
// https://vitest.dev/api/expect.html#tohavereturned
test('MySymbol() returned a value', () => {
    const _MySymbol = vi.fn(mySymbol_1.MySymbol);
    _MySymbol();
    expect(_MySymbol).toHaveReturned();
});
// https://vitest.dev/api/expect.html#tothrowerror
test('MySymbol cannot be instantiated', () => {
    expect(() => new mySymbol_1.MySymbol()).toThrowError(new Error('MySymbol is not a constructor'));
});
test(`MySymbol('a') === MySymbol('a')`, () => {
    let a1 = (0, mySymbol_1.MySymbol)('a');
    let a2 = (0, mySymbol_1.MySymbol)('a');
    expect(a1 === a2).toBe(false);
});
test(`MySymbol('a').toString()`, () => {
    expect((0, mySymbol_1.MySymbol)('a').toString()).toBe('MySymbol(a)');
});
test(`MySymbol('a').valueOf()`, () => {
    expect((0, mySymbol_1.MySymbol)('a').valueOf()).toBe('MySymbol(a)');
});
test(`MySymbol.for('a')`, () => {
    expect(mySymbol_1.MySymbol.for('a') === (0, mySymbol_1.MySymbol)('a')).toBe(false);
    expect(mySymbol_1.MySymbol.for('a') === mySymbol_1.MySymbol.for('a')).toBe(true);
});
test(`MySymbol.keyFor(symbol) param`, () => {
    expect(mySymbol_1.MySymbol.keyFor()).toThrowError(new Error('undefined is not a MySymbol'));
});
test(`MySymbol.keyFor(symbol)`, () => {
    let a1 = (0, mySymbol_1.MySymbol)('a1');
    let b1 = mySymbol_1.MySymbol.keyFor(a1);
    expect(b1 === 'a1').toBe(false);
    let a2 = mySymbol_1.MySymbol.for('a2');
    let b2 = mySymbol_1.MySymbol.keyFor(a2);
    expect(b2 === 'a2').toBe(true);
});
