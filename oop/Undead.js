Character = require('./Character')

class Undead extends Character.Character {
    type='Undead'
    attack = 25;
    defence = 25;
    constructor(name) {
        super(name)
    }
}

exports.Undead = Undead