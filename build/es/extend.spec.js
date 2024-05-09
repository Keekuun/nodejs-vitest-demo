"use strict";

// src/es/extend.ts
var Person = class {
  // public：公共成员，可以在类内部和外部访问
  age = 18;
  // protected：受保护成员，可以在类内部和子类中访问，但在外部不可访问。
  name;
  // private：私有成员，只能在类内部访问，子类和外部都无法访问。
  msg = "\u6211\u6765\u81EAPerson,\u662F\u79C1\u6709\u7684\uFF0C\u4E0D\u80FD\u88AB\u7EE7\u627F";
  constructor() {
    this.name = "person";
  }
  getName() {
    return this.name;
  }
  getMsg() {
    return this.msg;
  }
};
var Student = class extends Person {
  name;
  constructor() {
    super();
    this.name = "student";
  }
  getName() {
    return this.name;
  }
};
function Parent() {
  this.name = "parent";
  this.colors = ["red", "blue"];
}
function Child1() {
  this.name = "child";
}
Child1.prototype = new Parent();
Parent.prototype.getName = function() {
  return this.name;
};
function Child2() {
  Parent.call(this);
  this.name = "child2";
}
Child2.prototype = new Parent();
Child2.prototype.constructor = Child2;
var Parent2 = {
  name: "parent2",
  arr: [1, 2, 3],
  getName() {
    return this.name;
  }
};
var Child4 = Object.create(Parent2);
Child4.name = "child4";
Child4.getName();
function clone1(target) {
  const cloneTarget = Object.create(target);
  cloneTarget.say = function() {
    console.log("hello");
  };
  return cloneTarget;
}
var child5 = clone1(Parent2);
function clone2(parent, child) {
  child.prototype = Object.create(parent.prototype);
  child.prototype.constructor = child;
}
function Child6() {
  Parent.call(this);
  this.name = "child6";
}
clone2(Parent, Child6);

// src/es/extend.spec.ts
test("class extend", () => {
  const p = new Person();
  const s = new Student();
  console.log("s.getName()", s.getName());
  console.log("s.getMsg()", s.getMsg());
  expect(s instanceof Person).toBe(true);
});
