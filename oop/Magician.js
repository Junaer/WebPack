Character = require('./Character')

class Magician extends Character.Character {
    type='Magician'
    attack = 10;
    defence = 40;
    constructor(name, attack, defence) {
        super(name)
    }
}

exports.Magician = Magician