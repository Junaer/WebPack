Character = require('./Character')

class Bowerman extends Character.Character {
    type='Bowerman'
    attack = 25;
    defence = 25;
    constructor(name) {
        super(name)  
    }
}

exports.Bowerman = Bowerman