let faker = require('faker');

class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
        this.timerId = null;
        this.grow();
    }
    grow() {
         this.timerId = setInterval(() => {
            this.age++;
            if(this.age >= 40) clearInterval(this.timerId);
        }, 1000)
    }
}
let john = new Person('John', 25);
let anna = new Person('Anna', 36);
let jeff = new Person('Jeff', 18);
let mary = new Person('Mary', 12);

let arr = [];
arr.push(john, anna, jeff, mary);

function dieAfter40(arr) {
    return arr.filter((person)=>{
        return person.age < 40
    });
}
function randomAge() {
    return Math.floor(Math.random()* (51-1)) + 1;
}

// kill old persons every second
setInterval(() => {
    arr = dieAfter40(arr);
}, 1000);


//add new person every-2-seconds with random name and age
setInterval(() => {
    arr.push(new Person(faker.name.findName(), randomAge()));
}, 2000);


//show persons in console every second || name and age
setInterval(() => {
    console.log(arr.map(function(person) {
        return {name: person.name, age: person.age};
    }));
}, 1000);