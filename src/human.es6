export class human {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    say(str) {
        return `I\'m ${this.name}:) ${str}`;
    }
}