export class Person {
  // public：公共成员，可以在类内部和外部访问
  public age: number = 18;
  // protected：受保护成员，可以在类内部和子类中访问，但在外部不可访问。
  protected name: string;
  // private：私有成员，只能在类内部访问，子类和外部都无法访问。
  private readonly msg: string = '我来自Person,是私有的，不能被继承';

  constructor() {
    this.name = 'person';
  }

  getName() {
    return this.name;
  }

  getMsg() {
    return this.msg;
  }
}

export class Student extends Person {
  protected name: string;

  constructor() {
    super();
    this.name = 'student';

    // 构造函数一旦返回了新的对象，就可能不是 Student 的实例了
    // return Object.create({
    //   getName() {
    //     return 'Object.create student';
    //   },
    //   getMsg() {
    //     return '我来自 Object.create';
    //   }
    // });
  }

  getName() {
    return this.name;
  }
}


// 1。原型链继承

function Parent() {
  this.name = 'parent';
  // 缺点： 多个实例共享此处地址，会造成混乱
  this.colors = ['red', 'blue'];
}

function Child1() {
  this.name = 'child';
}

// 关键代码
// @ts-ignore
Child1.prototype = new Parent();

// 2. 构造函数继承

// 缺点：子类无法继承父类原型对象上的方法
Parent.prototype.getName = function () {
  return this.name;
}

function Child2() {
  // 关键代码
  Parent.call(this);
  this.name = 'child2';
}

// 3.组合继承

// 缺点：父类构造函数被调用两次
function Child3() {
  // 关键代码
  Parent.call(this); // 调用父类的构造函数 1
  this.name = 'child3';
}

// 关键代码
// @ts-ignore
Child2.prototype = new Parent(); // 调用父类的构造函数 2
Child2.prototype.constructor = Child2;

// 4. 原型式继承
// 缺点：共享父对象同一个内存，存在篡改
// @ts-ignore
const Parent2 = {
  name: 'parent2',
  arr: [1, 2, 3],
  getName() {
    return this.name
  }
}

// 关键代码
const Child4 = Object.create(Parent2);
Child4.name = 'child4';
Child4.getName()

// 5. 寄生式继承
function clone1(target: Record<string, any>) {
  const cloneTarget = Object.create(target);
  cloneTarget.say = function () {
    console.log('hello');
  }
  return cloneTarget;
}

const child5 = clone1(Parent2);

// 6. 寄生组合式继承
function clone2(parent: Function, child: Function) {
  // 关键代码 1
  child.prototype = Object.create(parent.prototype);
  // 关键代码 2
  child.prototype.constructor = child
}

function Child6() {
  // 关键代码 3
  Parent.call(this);
  this.name = 'child6';
}

clone2(Parent, Child6)
