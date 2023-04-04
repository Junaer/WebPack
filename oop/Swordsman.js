Character = require('./Character')

class Swordsman extends Character.Character {
    type='Swordsman'
    attack = 40;
    defence = 10;
    constructor(name) {
        super(name)
    }
}

exports.Swordsman = Swordsman