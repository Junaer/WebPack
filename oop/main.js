Zombie = require('./Zombie')
Bowerman = require('./Bowerman')
Undead = require('./Undead')
Daemon = require('./Daemon')
Magician = require('./Magician')
Swordsman = require('./Swordsman')

zombie = new Zombie.Zombie('Stasyn')
console.log(zombie)
zombie.levelUp()
console.log(zombie)
zombie.damage(20)
console.log(zombie)

swordsman = new Swordsman.Swordsman('Stasyn')

bowerman = new Bowerman.Bowerman('Olegan')


console.log(bowerman)