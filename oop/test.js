Zombie = require('./Zombie')
Bowerman = require('./Bowerman')
Undead = require('./Undead')
Daemon = require('./Daemon')
Magician = require('./Magician')
Swordsman = require('./Swordsman')
const  {Character} = require('./Character.js')

const types = ['Bowerman', 'Swordsman', 'Magician', 'Daemon', 'Undead', 'Zombie']

describe('Character', () => {
  it('should create new character', () => {
    const character = new Character('Alex', 'Bowerman')
    expect(character.name).toEqual('Alex')
    expect(character.type).toEqual('Bowerman')
    expect(character.health).toEqual(100)
    expect(character.level).toEqual(1)
  })


  it('should throw error due to wrong name length', () => {
    expect(() => new Character('', 'Bowerman')).toThrow("throw new Error(name)")
    expect(() => new Character('A', 'Bowerman')).toThrow("throw new Error(name)")
    expect(() => new Character('AlexAlexAlex', 'Bowerman')).toThrow("throw new Error(name)")
  })


  it('should level up character', () => {
    const character = new Bowerman.Bowerman('Valeron')
    character.health = 0

    expect(() => character.levelUp()).toThrow("Error: you can't level up the dead")

    character.health = 50
    character.levelUp()

    expect(character.health).toEqual(100)
    expect(character.level).toEqual(2)
    expect(character.defence).toEqual(30)
    expect(character.attack).toEqual(30)
  })

  it('should reduce health points', () => {
    const character = new Zombie.Zombie('Alex')
    character.damage(20)
    expect(character.health).toEqual(82)
  })

  it('should reduce correct amount of health points considering defence', () => {
    const character = new Daemon.Daemon('Alex')
    character.defence = 50
    character.damage(20)
    expect(character.health).toEqual(90)
  })
})
