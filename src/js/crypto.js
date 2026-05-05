export async function cryptoKeyToString(key, window) {
    // 1. Export the key to SPKI format (standard for public keys)
    const exported = await window.crypto.subtle.exportKey("spki", key);

    // 2. Convert ArrayBuffer to a binary string
    const exportedAsString = String.fromCharCode(...new Uint8Array(exported));

    // 3. Encode to Base64
    const exportedAsBase64 = window.btoa(exportedAsString);

    // 4. Wrap in PEM headers/footers
    return `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;
}

export function importCompressedPublicKey(compressedKeyU8Array, window) {
    // The 'raw' format is used for uncompressed (0x04 || X || Y)
    // or compressed (0x02/0x03 || X) formats in many implementations.
    // Note: Standard Web Crypto API 'raw' often expects uncompressed.
    // If this fails, you may need to decompress to uncompressed first
    // or use a WASM library like @noble/curves.
    //
    // import { p256 } from '@noble/curves/p256';
    // Convert Uint8Array directly
    // const publicKey = p256.ProjectivePoint.fromHex(compressedKeyU8Array);

    return window.crypto.subtle.importKey(
        "raw", // Format
        compressedKeyU8Array,
        {
            name: "ECDH", // Or "ECDSA"
            namedCurve: "P-256"
        },
        true, // extractable
        [] // key usages (empty for public key)
    );
}
