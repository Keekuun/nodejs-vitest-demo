"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/es/mySymbol.ts
var mySymbol_exports = {};
__export(mySymbol_exports, {
  MySymbol: () => MySymbol
});
module.exports = __toCommonJS(mySymbol_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MySymbol
});
