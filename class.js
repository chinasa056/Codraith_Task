class Person {
    constructor(name, age, gender) {
        this.name = name
        this.age = age
        this.gender = gender
    };

    format() {
        console.log(`${this.name} is ${this.age} years old and is a ${this.gender}`);
    }
    
};

const firstPerson =  new Person("Monday", 23, "Male")
console.log(firstPerson.age);
firstPerson.format()

