@classDecorator1
@classDecorator2
export class MyClass {
    private name: string;
    constructor(name: string) {
        this.name = name
    }

    @methodDecorator1
    @methodDecorator2
    method(@paramDecorator1 @paramDecorator2 param: string) {
        console.log('method', param);
    }

    @propertyDecorator1
    @propertyDecorator2
    property: string = 'property';

    @accessorDecorator1
    @accessorDecorator2
    get accessor() {
        return 'accessor';
    }
}

function classDecorator1(target: Function) {
    console.log('classDecorator1', target);
}

function classDecorator2(target: Function) {
    console.log('classDecorator2', target);
}

function methodDecorator1(target: Object, name: string, descriptor: PropertyDescriptor) {
    console.log('methodDecorator1', target, name, descriptor);
    return descriptor;
}

function methodDecorator2(target: Object, name: string, descriptor: PropertyDescriptor) {
    console.log('methodDecorator2', target, name, descriptor);
    return descriptor;
}

function paramDecorator1(target: Object, name: string, paramIndex: number) {
    console.log('paramDecorator1', target, name, paramIndex);
}

function paramDecorator2(target: Object, name: string, paramIndex: number) {
    console.log('paramDecorator2', target, name, paramIndex);
}

function propertyDecorator1(target: Object, name: string) {
    console.log('propertyDecorator1', target, name);
}

function propertyDecorator2(target: Object, name: string) {
    console.log('propertyDecorator2', target, name);
}

function accessorDecorator1(target: Object, name: string, descriptor: PropertyDescriptor) {
    console.log('accessorDecorator1', target, name, descriptor);
    return descriptor;
}

function accessorDecorator2(target: Object, name: string, descriptor: PropertyDescriptor) {
    console.log('accessorDecorator2', target, name, descriptor);
    return descriptor;
}


const myClass = new MyClass('myClass')
myClass.method('method params')