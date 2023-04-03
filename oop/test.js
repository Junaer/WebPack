const { Character, Bowerman, Swordsman, Magician, Daemon, Undead, Zombie } = require('main.js')

const types = ['Bowerman', 'Swordsman', 'Magician', 'Daemon', 'Undead', 'Zombie']

describe('Character', () => {
  it('should create new character', () => {
    const character = new Character('Alex', 'Warrior')
    expect(character.name).toEqual('Alex')
    expect(character.type).toEqual('Warrior')
    expect(character.health).toEqual(100)
    expect(character.level).toEqual(1)
  })

  it('should throw error due to wrong name length', () => {
    expect(() => new Character('', 'Warrior')).toThrow('Error: name')
    expect(() => new Character('A', 'Warrior')).toThrow('Error: name')
    expect(() => new Character('AlexAlexAlex', 'Warrior')).toThrow('Error: name')
  })

  it('should level up character', () => {
    const character = new Character('Alex', 'Warrior')
    character.health = 0

    expect(() => character.levelUp()).toThrow("Error: you can't level up the dead")

    character.health = 50
    character.levelUp()

    expect(character.health).toEqual(100)
    expect(character.level).toEqual(2)
    expect(character.defence).toEqual(25)
    expect(character.attack).toEqual(25)
  })

  it('should reduce health points', () => {
    const character = new Character('Alex', 'Warrior')
    character.damage(20)
    expect(character.health).toEqual(80)
  })

  it('should reduce correct amount of health points considering defence', () => {
    const character = new Character('Alex', 'Warrior')
    character.defence = 50
    character.damage(20)
    expect(character.health).toEqual(90)
  })
})

describe('Child characters', () => {
  // Here we test only child properties and methods
  // because their constructors are inherited from Character
  types.forEach(type => {
    describe(type, () => {
      const character = new eval(type)("Alex")
      
      it('constructor should set type and name', () => {
        expect(character.type).toEqual(type)
      })
      
      it('should properly level up', () => {
        character.levelUp()
        expect(character.level).toEqual(2)
        expect(character.defence).toEqual(Math.round(character.defence * 1.2))
        expect(character.attack).toEqual(Math.round(character.attack * 1.2))
      })
      
      it('should properly receive damage', () => {
        character.health = 100
        character.damage(20)
        expect(character.health).toEqual(80)
      })
    })
  })
})