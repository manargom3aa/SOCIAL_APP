import CryptoJS from "crypto-js";

export const generateEncryption = (
  { plaintext = "", secretkey = process.env.ENCRYPTION_SECRET } = {}
): string => {
  if (!secretkey) throw new Error("Encryption secret key is not defined");
  return CryptoJS.AES.encrypt(plaintext, secretkey).toString();
};

export const decryptEncryption = (
  { cipherText = "", secretkey = process.env.ENCRYPTION_SECRET } = {}
): string => {
  if (!secretkey) throw new Error("Encryption secret key is not defined");
  return CryptoJS.AES.decrypt(cipherText, secretkey).toString(CryptoJS.enc.Utf8);
};
