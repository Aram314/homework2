let faker = require('faker');
const EventEmitter = require('events');
const readline = require('readline');
const http = require('http');
const eventEmitter = new EventEmitter();


class Gladiator {
    constructor(name,health,power,speed) {
        this.initialSpeed = speed;
        this.initialHealth = health;
        this.name = name;
        this.health = health;
        this.power = power;
        this.speed = speed;
        this.timerId = null;
    }
    fight(gladiators) {
        let opponentGladiators = gladiators.filter((gladiator)=>{
            return gladiator !== this;
        });
        this.timerId = setInterval(() => {
            let randomOpponent = opponentGladiators[Math.floor(Math.random() * opponentGladiators.length)];
            randomOpponent.health = parseFloat( (randomOpponent.health - this.power).toFixed(1) );
            randomOpponent.speed = parseFloat((randomOpponent.initialSpeed * (randomOpponent.health / randomOpponent.initialHealth)).toFixed(3) );
            if(randomOpponent.health <= 30 && randomOpponent.health >= 15) {
                randomOpponent.speed = parseFloat((randomOpponent.speed * 3).toFixed(3));
            }
            console.log(`[${this.name} x ${this.health}] hits [${randomOpponent.name} x ${randomOpponent.health}] with power ${this.power}`);
            checkHealth(randomOpponent);
        }, 6000 - this.speed * 1000)
    }
    stopFighting() {
        clearInterval(this.timerId);
    }
}

let countDecimals = function(value) {
    if (Math.floor(value) !== value)
        return value.toString().split(".")[1].length || 0;
    return 0;
};

//randomValueGenerator -- rvg
function rvg(min, max, step) {
    let number = Math.floor((Math.random() * ((max + step) - min)) * (1/step) ) / (1/step) + min;
    return (parseFloat( number.toFixed(countDecimals(step)) ))
}

function makeGladiators(quantity) {
    let gladiators = [];
    for (let i = 0; i < quantity; i++) {
        let glad = new Gladiator(faker.name.findName(), rvg(80, 100, 1), rvg(2, 5, 0.1),rvg(1, 5, 0.001));
        Object.defineProperty(glad, "timerId", {
            enumerable: false,
            writable: true
        });
        gladiators.push(glad)
    }
    return gladiators
}

let gladiators = makeGladiators(3);

eventEmitter.on('somebodyHasDied', (gladiator) => {
    console.log(`[${gladiator.name}] dying`);
    stopBattle(gladiators);
    makeDecision(gladiator, gladiators);
});


//start battle
function startBattle(gladiators) {
    for(let i = 0; i < gladiators.length; i++) {
        gladiators[i].fight(gladiators)
    }
}

//stop battle
function stopBattle(gladiators) {
    for(let i = 0; i < gladiators.length; i++) {
        gladiators[i].stopFighting();
    }
}

//check health of gladiators, if health <= 0 do staff...
function checkHealth(gladiator) {
    if(gladiator.health <= 0) {
        eventEmitter.emit('somebodyHasDied', gladiator);
    }
}
//remove gladiator when caesar say 'finish him'
function removeGladiator(gladiators, gladiator){
    for(let i = 0; i < gladiators.length; i++) {
        if(gladiators[i] === gladiator) {
            gladiators.splice(i, 1);
        }
    }
}

//revive gladiator when caesar say 'live'
function reviveGladiator(gladiator) {
    gladiator.health = 50;
}

//caesar make decision
function makeDecision(gladiator, gladiators){
    const rl = readline.createInterface({input:process.stdin, output:process.stdout});
    rl.question(`${gladiator.name} has died, what to do?\n`, (caesarInput) => {
        if(caesarInput.trim().toLowerCase() === 'finish him') {
            removeGladiator(gladiators, gladiator);
            console.log(`Caesar showed :-1: to [${gladiator.name}]`);
            rl.close();
        } else if (caesarInput.trim().toLowerCase() === 'live') {
            reviveGladiator(gladiator);
            console.log(`Caesar showed :+1: to [${gladiator.name}]`);
            rl.close();
        } else {
            rl.setPrompt('Caesar, make a normal decision!\n');
            rl.prompt();
            rl.on('line', (caesarInput) => {
                if(caesarInput.trim().toLowerCase() === 'finish him') {
                    removeGladiator(gladiators, gladiator);
                    console.log(`Caesar showed :-1: to [${gladiator.name}]`);
                    rl.close();
                } else if (caesarInput.trim().toLowerCase() === 'live') {
                    reviveGladiator(gladiator);
                    console.log(`Caesar showed :+1: to [${gladiator.name}]`);
                    rl.close();
                } else {
                    rl.setPrompt('Caesar?!?!?!\n');
                    rl.prompt();
                }
            })
        }
    });
    rl.on('close', () => {
        if(gladiators.length === 1) {
            console.log(`[${gladiators[0].name}] won the battle with health x${gladiators[0].health}`);
        } else {
            startBattle(gladiators);
        }
    })
}

startBattle(gladiators);