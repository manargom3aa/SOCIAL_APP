import bcrypt from "bcrypt";

export const generateHash = async ({ plaintext }: { plaintext: string }) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(plaintext, salt);
};

export const compareHash = async ({ plaintext, hashValue }: { plaintext: string; hashValue: string }) => {
  if (!plaintext || !hashValue) throw new Error("data and hash arguments required");
  return await bcrypt.compare(plaintext, hashValue);
};
