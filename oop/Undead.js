Character = require('./Character')

class Undead extends Character.Character {
    type='Undead'
    attack = 25;
    defence = 25;
    constructor(name, attack, defence) {
        super(name)
    }
}

exports.Undead = Undead