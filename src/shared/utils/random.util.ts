import crypto from 'crypto';

import { PRNG } from 'seedrandom';

export class RandomUtil {
  static getInt(min: number, max: number, rng?: PRNG): number {
    return Math.floor((rng ? rng() : Math.random()) * (max - min + 1)) + min;
  }

  static getCryptoInt(min: number, max: number): number {
    const range = max - min;
    const bits = Math.ceil(Math.log2(range));
    const bytes = Math.ceil(bits / 8);
    const mask = 2 ** bits - 1;

    let value;
    do {
      const randomBytes = crypto.randomBytes(bytes);
      // eslint-disable-next-line no-bitwise
      value = randomBytes.readUIntBE(0, bytes) & mask;
    } while (value >= range);

    return min + value;
  }
}
