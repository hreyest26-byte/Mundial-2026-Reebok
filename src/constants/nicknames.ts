// 20 modelos icónicos de zapatillas Reebok — los usuarios eligen su apodo
export const NICKNAMES = [
  "Classic Leather",
  "Freestyle Hi",
  "Club C 85",
  "Instapump Fury",
  "Answer IV",
  "Shaq Attaq",
  "Kamikaze II",
  "Question Mid",
  "Alien Stomper",
  "Ventilator",
  "BB 4600",
  "DMX Run 10",
  "Furylite",
  "Pump Omni Zone",
  "Blacktop Battleground",
  "Rugged Walker",
  "Ex-O-Fit",
  "NPC II",
  "Nano X",
  "Legacy 83",
] as const;

export type Nickname = (typeof NICKNAMES)[number];
