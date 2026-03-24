/**
 * Avatar Customization Options
 * 
 * These are the lookup tables for avatar creation:
 * - bases: Character archetypes (Human, Android, Cybernetic)
 * - skins: Skin tone colors
 * - hairs: Hair style representations
 * - outfits: Clothing/gear styles
 * 
 * NOTE: Currently using emoji representations. This is a prototype pattern.
 * For production, replace emoji with proper 3D model references or asset IDs.
 */

export const AVATAR_OPTIONS = {
  bases: [
    { id: 1, name: "Human", emoji: "👤" },
    { id: 2, name: "Android", emoji: "🤖" },
    { id: 3, name: "Cybernetic", emoji: "🔮" },
  ],
  skins: [
    { id: 1, name: "Fair", color: "#fdbcb4" },
    { id: 2, name: "Medium", color: "#d4a574" },
    { id: 3, name: "Deep", color: "#8b6f47" },
    { id: 4, name: "Neon", color: "#00f0ff" },
  ],
  hairs: [
    { id: 1, name: "Short", emoji: "✂️" },
    { id: 2, name: "Long", emoji: "💇" },
    { id: 3, name: "Wavy", emoji: "〜" },
    { id: 4, name: "Cybernetic", emoji: "⚡" },
  ],
  outfits: [
    { id: 1, name: "Casual", emoji: "👕" },
    { id: 2, name: "Corporate", emoji: "🧥" },
    { id: 3, name: "Tactical", emoji: "👖" },
    { id: 4, name: "Neon", emoji: "✨" },
  ],
};

/**
 * Get an option by type and ID
 * @param {string} type - 'base' | 'skin' | 'hair' | 'outfit'
 * @param {number} id - Option ID
 * @returns {object|null} Option object or null if not found
 */
export const getAvatarOption = (type, id) => {
  const typeMap = {
    base: "bases",
    skin: "skins",
    hair: "hairs",
    outfit: "outfits",
  };
  
  const key = typeMap[type];
  return AVATAR_OPTIONS[key]?.find(item => item.id === id) || null;
};
