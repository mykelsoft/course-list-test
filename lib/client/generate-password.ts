const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()-_=+[]{};:,.?';

const DEFAULT_LENGTH = 16;

function getRandomIndex(max: number) {
  const crypto = globalThis.crypto;
  if (crypto) {
    const values = new Uint32Array(1);
    crypto.getRandomValues(values);
    return values[0] % max;
  }

  return Math.floor(Math.random() * max);
}

function pickCharacter(characters: string) {
  return characters[getRandomIndex(characters.length)];
}

export default function generatePassword(length = DEFAULT_LENGTH) {
  const safeLength = Math.max(length, 4);
  const characterGroups = [LOWERCASE, UPPERCASE, NUMBERS, SYMBOLS];
  const allCharacters = characterGroups.join('');

  const requiredCharacters = characterGroups.map(pickCharacter);
  const remainingCharacters = Array.from(
    { length: safeLength - requiredCharacters.length },
    () => pickCharacter(allCharacters)
  );

  return [...requiredCharacters, ...remainingCharacters]
    .sort(() => getRandomIndex(3) - 1)
    .join('');
}
