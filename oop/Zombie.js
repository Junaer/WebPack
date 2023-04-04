Character = require('./Character')

class Zombie extends Character.Character {
    type='Zombie'
    attack = 40;
    defence = 10;
    constructor(name) {
        super(name)
    }
}

exports.Zombie = Zombie