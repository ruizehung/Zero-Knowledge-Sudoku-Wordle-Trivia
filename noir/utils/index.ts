/**
 * Converts a number to a 32 byte hex string so structure mirrors Noir's for accurate hashing
 * 
 * @param {number} num - number to be hexlified
 * @returns 32 bytes hex string
 */
export const numToHex = (num: number) => {
    const hex = (num).toString(16);
    // Add missing padding based of hex number length
    return `${'0'.repeat(64 - hex.length)}${hex}`;
}