class Gladiator {
    constructor(name,health,power,speed) {
        this.name = name;
        this.health = health;
        this.speed = speed;
        this.power = power;
        this.initialSpeed = speed;
        this.initialHealth = health;
        this.timerId = null;
        this.hitOpponent = this.hitOpponent.bind(this);
    }
    hitOpponent() {
        let opponentGladiators = gladiators.filter((gladiator) => {
            return gladiator !== this;
        });
        let randomOpponent = opponentGladiators[Math.floor(Math.random() * opponentGladiators.length)];
        randomOpponent.health = parseFloat( (randomOpponent.health - this.power).toFixed(1) );
        if(randomOpponent.health < 0) { randomOpponent.health = 0; }
        randomOpponent.speed = parseFloat((randomOpponent.initialSpeed * (randomOpponent.health / randomOpponent.initialHealth)).toFixed(3) );
        if(randomOpponent.health <= 30 && randomOpponent.health >= 15) {
            randomOpponent.speed = parseFloat((randomOpponent.speed * 3).toFixed(3));
        }
        print(`[${this.name} x ${this.health}] hits [${randomOpponent.name} x ${randomOpponent.health}] with power ${this.power}`);
        this.timerId = setTimeout(this.hitOpponent, 6000 - this.speed * 1000);
        checkHealth(randomOpponent);
    }
    fight(gladiators) {
        this.timerId = setTimeout(this.hitOpponent, 6000 - this.speed * 1000);
    }
    stopFighting() {
        clearTimeout(this.timerId);
    }
}

let app = document.getElementById('app');
let scrollHeight = Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
);
function print(txt) {
    let elem = document.createElement('div');
    elem.textContent = txt;
    app.appendChild(elem);
    window.scrollTo(0, scrollHeight);
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
        // Object.defineProperty(glad, "timerId", {
        //     enumerable: false,
        //     writable: true
        // });
        gladiators.push(glad)
    }
    return gladiators
}

let gladiators = makeGladiators(3);

//when somebody is dying
function somebodyDying(gladiator) {
    print(`[${gladiator.name}] dying`);
    stopBattle(gladiators);
    makeDecision(gladiator, gladiators);
}

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
        somebodyDying(gladiator)
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
function makeDecision(gladiator, gladiators) {
    let a = confirm('Finish him??');

    if(a) {
        removeGladiator(gladiators, gladiator);
        print(`Caesar showed :-1: to [${gladiator.name}]`);
    } else {
        reviveGladiator(gladiator);
        print(`Caesar showed :+1: to [${gladiator.name}]`);
    }

    if(gladiators.length === 1) {
        print(`[${gladiators[0].name}] won the battle with health x${gladiators[0].health}`);
    } else {
        startBattle(gladiators);
    }
}

function start() {
    startBattle(gladiators);
}