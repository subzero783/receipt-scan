import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';

// Ensure the key exists and is exactly 32 bytes (64 hex characters)
const getSecretKey = () => {
    const key = process.env.RECEIPT_ENCRYPTION_KEY;
    if (!key) throw new Error('RECEIPT_ENCRYPTION_KEY is missing from environment variables.');
    return Buffer.from(key, 'hex');
};

export const encryptBuffer = (buffer) => {
    // 1. Generate a random 16-byte Initialization Vector (IV)
    const iv = crypto.randomBytes(16);

    // 2. Create the cipher
    const cipher = crypto.createCipheriv(ALGORITHM, getSecretKey(), iv);

    // 3. Encrypt the data
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);

    // 4. Get the auth tag (ensures the data hasn't been tampered with)
    const authTag = cipher.getAuthTag();

    // 5. Combine everything into one buffer to upload: IV (16 bytes) + AuthTag (16 bytes) + Encrypted Data
    return Buffer.concat([iv, authTag, encrypted]);
};

export const decryptBuffer = (buffer) => {
    // 1. Extract the pieces based on their known lengths
    const iv = buffer.subarray(0, 16);
    const authTag = buffer.subarray(16, 32);
    const encrypted = buffer.subarray(32);

    // 2. Create decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, getSecretKey(), iv);
    decipher.setAuthTag(authTag);

    // 3. Decrypt
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted;
};