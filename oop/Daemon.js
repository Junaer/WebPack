Character = require('./Character')

class Daemon extends Character.Character {
    type='Daemon'
    attack = 10;
    defence = 40;
    constructor(name) {
        super(name)
    }
}

exports.Daemon = Daemon