list = ['Bowerman', 'Swordsman', 'Magician', 'Daemon', 'Undead', 'Zombie']

class Character {
    health = 100
    level = 1
    constructor(name, type) {
        if (name.length < 2 || name.length > 10) {
            throw new Error('throw new Error(name)');
        }
        this.name = name; 
        this.type = type;
    }
    levelUp() {
        if (this.health == 0) {
            throw new Error("you can't level up the dead");
        }
        this.health = 100
        this.level = this.level += 1
        this.defence = this.defence + (this.defence/100*20)
        this.attack = this.attack + (this.attack/100*20)
    }
    damage(points) {
        this.health -= points * (1 - this.defence / 100)
    }
}

class Bowerman extends Character {
    type='Bowerman'
    attack = 25;
    defence = 25;
    constructor(name) {
        super(name)  
    }
}

class Swordsman extends Character {
    type='Swordsman'
    attack = 40;
    defence = 10;
    constructor(name, attack, defence) {
        super(name)
    }
}

class Magician extends Character {
    type='Magician'
    attack = 10;
    defence = 40;
    constructor(name, attack, defence) {
        super(name)
    }
}

class Daemon extends Character {
    type='Daemon'
    attack = 10;
    defence = 40;
    constructor(name, attack, defence) {
        super(name)
    }
}

class Undead extends Character {
    type='Undead'
    attack = 25;
    defence = 25;
    constructor(name, attack, defence) {
        super(name)
    }
}

class Zombie extends Character {
    type='Zombie'
    attack = 40;
    defence = 10;
    constructor(name, attack, defence) {
        super(name)
    }
}



bower = new Zombie('Stasyn')
console.log(bower)
bower.levelUp()
console.log(bower)
bower.damage(20)
console.log(bower)