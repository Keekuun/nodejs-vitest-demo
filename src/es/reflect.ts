import "reflect-metadata"

class MyClass {
    @Reflect.metadata("private", true)
    private readonly myProperty: string
    constructor(myProperty: string) {
        this.myProperty = myProperty
    }

    @Reflect.metadata("customKey", 'customValue')
    myMethod() {
        console.log(this.myProperty)
    }
}

const myClass = new MyClass("Hello World")
myClass.myMethod()

console.log(Reflect.getMetadata("customKey", myClass, "myMethod"))
console.log(Reflect.getMetadata("private", myClass, "myProperty"))
console.log(Reflect.ownKeys(myClass))
console.log(Reflect.getMetadataKeys(myClass))
