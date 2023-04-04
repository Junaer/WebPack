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

exports.Character = Character