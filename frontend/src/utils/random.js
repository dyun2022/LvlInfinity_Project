/**
 * Random Number Generation Utilities
 * 
 * Provides seeded pseudo-random number generation for deterministic
 * procedural content (buildings, terrain, etc.). Using XORShift algorithm.
 */

/**
 * Create a seeded random number generator
 * @param {number} seed - Seed value
 * @returns {function} Random number generator (returns 0-1)
 * 
 * Usage:
 *   const rand = mkRand(42);
 *   const value = rand(); // deterministic, same seed = same sequence
 */
export function mkRand(seed) {
  let s = (seed | 0) + 1;
  return () => {
    s ^= s << 13;
    s ^= s >> 17;
    s ^= s << 5;
    return (s >>> 0) / 0xFFFFFFFF;
  };
}

/**
 * Get random value in range [min, max)
 * @param {function} randFn - Random generator from mkRand()
 * @param {number} min - Minimum (inclusive)
 * @param {number} max - Maximum (exclusive)
 * @returns {number}
 */
export function randomRange(randFn, min, max) {
  return min + randFn() * (max - min);
}

/**
 * Get random integer in range [min, max)
 * @param {function} randFn - Random generator from mkRand()
 * @param {number} min - Minimum (inclusive)
 * @param {number} max - Maximum (exclusive)
 * @returns {number}
 */
export function randomInt(randFn, min, max) {
  return Math.floor(randomRange(randFn, min, max));
}

/**
 * Get random choice from array
 * @param {function} randFn - Random generator from mkRand()
 * @param {array} arr - Array to choose from
 * @returns {*}
 */
export function randomChoice(randFn, arr) {
  return arr[randomInt(randFn, 0, arr.length)];
}
