// Define SRAM memory addresses for the game

import _SpriteLocs from "../data/sprite_locs.json"

const SpriteLocs: { [key: symbol]: number[] } = _SpriteLocs

const tileToAddress = (tile: number) => {
  // Room data is first addresses and lines up with Tile IDs
  return [tile * 2, tile * 2 + 1]
}

export const SRAM_TO_SPRITE: { [key: string]: string } = {
  EPBoss: "Armos",
  DPBoss: "Lanmolas",
  ToHBoss: "Moldorm",
  CTBoss: "Agahnim",
  PoDBoss: "Helmasaur",
  SPBoss: "Arrghus",
  SWBoss: "Mothula",
  TTBoss: "Blind",
  IPBoss: "Kholdstare",
  MMBoss: "Vitreous",
  TRBoss: "Trinexx",
  GTBoss: "Agahnim",
  Bow: "Bow",
  Boomerang: "Blue Boomerang",
  Hookshot: "Hookshot",
  Mushroom: "Mushroom",
  FireRod: "Fire Rod",
  IceRod: "Ice Rod",
  Bombos: "Bombos",
  Ether: "Ether",
  Quake: "Quake",
  Lamp: "Lamp",
  Hammer: "Hammer",
  Shovel: "Ocarina",
  BugNet: "Bug Catching Net",
  Book: "Book of Mudora",
  Bottle: "Bottle",
  Somaria: "Cane of Somaria",
  Byrna: "Cane of Byrna",
  Cape: "Cape",
  Mirror: "Magic Mirror",
  Boots: "Pegasus Boots",
  Flippers: "Flippers",
  Pearl: "Moon Pearl",
  HCSKeys: "Small Key (Escape)",
  EPSKeys: "Small Key (Eastern Palace)",
  DPSKeys: "Small Key (Desert Palace)",
  ToHSKeys: "Small Key (Tower of Hera)",
  CTKeys: "Small Key (Agahnims Tower)",
  PoDSKeys: "Small Key (Palace of Darkness)",
  SPSKeys: "Small Key (Swamp Palace)",
  SWSKeys: "Small Key (Skull Woods)",
  TTSKeys: "Small Key (Thieves Town)",
  IPSKeys: "Small Key (Ice Palace)",
  MMSKeys: "Small Key (Misery Mire)",
  TRSKeys: "Small Key (Turtle Rock)",
  GTSKeys: "Small Key (Ganons Tower)",
  TriforcePiece: "Triforce Piece",
}

// Offsets from F5F000
export const NAME_TO_SRAM = {
  // Room C8
  EPBoss: tileToAddress(0xc8),
  DPBoss: tileToAddress(0x33),
  ToHBoss: tileToAddress(0x07),
  CTBoss: tileToAddress(0x1b),
  PoDBoss: tileToAddress(0x5a),
  SPBoss: tileToAddress(0x06),
  SWBoss: tileToAddress(0x29),
  TTBoss: tileToAddress(0xac),
  IPBoss: tileToAddress(0xde),
  MMBoss: tileToAddress(0x90),
  TRBoss: tileToAddress(0xa4),
  GTBoss: tileToAddress(0x20),
  // Equipment is 1 byte
  Bow: 0x340,
  Boomerang: 0x341,
  Hookshot: 0x342,
  Bombs: 0x343,
  Mushroom: 0x344,
  FireRod: 0x345,
  IceRod: 0x346,
  Bombos: 0x347,
  Ether: 0x348,
  Quake: 0x349,
  Lamp: 0x34a,
  Hammer: 0x34b,
  Shovel: 0x34c,
  BugNet: 0x34d,
  Book: 0x34e,
  Bottle: 0x34f,
  Somaria: 0x350,
  Byrna: 0x351,
  Cape: 0x352,
  Mirror: 0x353,
  Glove: 0x354,
  Boots: 0x355,
  Flippers: 0x356,
  Pearl: 0x357,
  Sword: 0x359,
  Shield: 0x35a,
  Armor: 0x35b,
  HCSKeys: 0x4e1,
  EPSKeys: 0x4e2,
  DPSKeys: 0x4e3,
  ToHSKeys: 0x4ea,
  CTSKeys: 0x4e4,
  PoDSKeys: 0x4e6,
  SPSKeys: 0x4e5,
  SWSKeys: 0x4e8,
  TTSKeys: 0x4eb,
  IPSKeys: 0x4e9,
  MMSKeys: 0x4e7,
  TRSKeys: 0x4ec,
  GTSKeys: 0x4ed,
  Compass: [0x364, 0x365],
  "Big Key": [0x366, 0x367],
  Map: [0x368, 0x369],
  TriforcePiece: 0x418,
  // TODO: Prizes, Updrades
}

// Store SRAM addresses by name, keep groupings together
export const SRAM_TO_NAME = Object.entries(NAME_TO_SRAM).reduce(
  (acc, [name, addr]) => {
    if (Array.isArray(addr)) {
      addr.forEach((a) => {
        acc[a] = { name: name, addresses: addr }
      })
    } else {
      acc[addr] = { name: name, addresses: addr }
    }
    return acc
  },
  {} as { [key: string]: { [key: string]: any } },
)

const dungeonItemMap: { [key: number]: { [key: number]: string } } = {
  0: {
    0x01: "Unused",
    0x02: "Unused",
    0x04: "Ganons Tower",
    0x08: "Turtle Rock",
    0x10: "Thieves Town",
    0x20: "Tower of Hera",
    0x40: "Ice Palace",
    0x80: "Skull Woods",
  },
  1: {
    0x01: "Misery Mire",
    0x02: "Palace of Darkness",
    0x04: "Swamp Palace",
    0x08: "Agahnims Tower",
    0x10: "Desert Palace",
    0x20: "Eastern Palace",
    0xc0: "Escape",
    0x80: "Escape",
  },
}

const progressiveMap: { [key: string]: { [key: number]: string } } = {
  Bow: {
    0x01: "Bow",
    0x02: "Progressive Bow",
    0x03: "Progressive Bow",
    0x04: "Progressive Bow",
  },
  Boomerang: {
    0x01: "Blue Boomerang",
    0x02: "Red Boomerang",
  },
  Sword: {
    0x01: "Fighter Sword",
    0x02: "Master Sword",
    0x03: "Tempered Sword",
    0x04: "Golden Sword",
  },
  Shield: {
    0x01: "Blue Shield",
    0x02: "Red Shield",
    0x03: "Mirror Shield",
  },
  Armor: {
    0x01: "Blue Mail",
    0x02: "Red Mail",
  },
  Glove: {
    0x01: "Power Glove",
    0x02: "Titans Mitts",
  },
}

const parseDungeonItem = (
  addr: string,
  item: string,
  oldVal: number,
  newVal: number,
) => {
  const dungeonSet = dungeonItemMap[parseInt(addr, 16) % 2]
  const diff = newVal ^ oldVal
  const dungeon = dungeonSet[diff]
  return `${item} (${dungeon})`
}

const parseProgressiveItem = (item: string, newVal: number) => {
  const progressive = progressiveMap[item][newVal]
  return `${progressive}`
}

const checkBossFlag = (addr: string, oldVal: number, newVal: number) => {
  if (parseInt(addr, 16) % 2 === 0) {
    return false
  }
  const diff = newVal ^ oldVal
  if (diff == 0x8) {
    return true
  }
}

export const getEvents = (sramDiff: { [key: string]: number[] }) => {
  const events: string[] = []
  Object.keys(sramDiff).forEach((key: string) => {
    if (SRAM_TO_NAME[key]) {
      let ename
      const item = SRAM_TO_NAME[key].name as string
      if (["Compass", "Big Key", "Map"].includes(item)) {
        ename = parseDungeonItem(key, item, sramDiff[key][0], sramDiff[key][1])
        console.log(`Dungeon Item: ${ename}`)
      } else if (
        ["Bow", "Boomerang", "Sword", "Shield", "Armor", "Glove"].includes(item)
      ) {
        ename = parseProgressiveItem(item, sramDiff[key][1])
        console.log(`Progressive Item: ${ename}`)
      } else if (item.includes("Boss")) {
        ename = checkBossFlag(key, sramDiff[key][0], sramDiff[key][1])
          ? SRAM_TO_SPRITE[item]
          : undefined
        console.log(`Boss Defeated: ${ename}`)
      } else {
        ename = SRAM_TO_SPRITE[SRAM_TO_NAME[key].name as string]
        console.log(`Sprite: ${ename}`)
      }
      if (!ename || !Object.keys(SpriteLocs).includes(ename)) {
        return
      }
      events.push(ename)
    }
  })
  return events
}
