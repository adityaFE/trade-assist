
// Avatar generation options
export const AVATAR_STYLES = [
  'adventurer',
  'adventurer-neutral',
  'avataaars',
  'big-ears',
  'big-ears-neutral',
  'big-smile',
  'bottts',
  'croodles',
  'croodles-neutral',
  'identicon',
  'initials',
  'micah',
  'miniavs',
  'open-peeps',
  'personas',
  'pixel-art',
  'pixel-art-neutral',
];

/**
 * Generate a random avatar URL using DiceBear API
 * @param seed The seed to use for generating the avatar (usually the username)
 * @returns A URL for a randomly styled avatar
 */
export const getRandomAvatar = (seed: string = ''): string => {
  // Use a random style from the available options
  const style = AVATAR_STYLES[Math.floor(Math.random() * AVATAR_STYLES.length)];
  
  // Clean the seed - replace spaces with dashes and ensure it's URL-safe
  const cleanSeed = encodeURIComponent(seed.replace(/\s+/g, '-').toLowerCase());
  
  // Use DiceBear API to generate the avatar
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${cleanSeed || Math.random().toString(36).substring(2, 10)}`;
};

/**
 * Generate a specific styled avatar URL using DiceBear API
 * @param style The style to use from AVATAR_STYLES
 * @param seed The seed to use for generating the avatar
 * @returns A URL for the avatar with the specified style
 */
export const getAvatarWithStyle = (style: string, seed: string = ''): string => {
  if (!AVATAR_STYLES.includes(style)) {
    style = 'initials'; // Default to initials if invalid style provided
  }
  
  const cleanSeed = encodeURIComponent(seed.replace(/\s+/g, '-').toLowerCase());
  
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${cleanSeed || Math.random().toString(36).substring(2, 10)}`;
};
