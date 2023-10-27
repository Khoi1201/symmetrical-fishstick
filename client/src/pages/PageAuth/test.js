const {
  scrypt,
  randomFill,
  createCipheriv,
  scryptSync,
  createDecipheriv,
} = require("node:crypto");

const algorithm = "aes-192-cbc";
const password = "Password used to generate key";

const generateEncryptedData = (data) => {
  return new Promise((resolve, reject) => {
    // Generate the key
    scrypt(password, "salt", 24, (err, key) => {
      if (err) {
        reject(err);
        return;
      }

      // Generate the initialization vector
      randomFill(new Uint8Array(16), (err, iv) => {
        if (err) {
          reject(err);
          return;
        }

        // Create the cipher
        const cipher = createCipheriv(algorithm, key, iv);

        let encrypted = cipher.update(data, "utf8", "hex");
        encrypted += cipher.final("hex");

        resolve([encrypted, iv]);
      });
    });
  });
};

const generateDecryptedData = ([encryptedData, ivData]) => {
  const key = scryptSync(password, "salt", 24);

  // The IV is usually passed along with the ciphertext.
  const iv = Buffer.from(ivData); // Initialization vector.
  const decipher = createDecipheriv(algorithm, key, iv);

  // Encrypted using same algorithm, key and iv.
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  console.log(decrypted);
};

generateEncryptedData("kkk 123")
  .then((data) => generateDecryptedData(data))
  .catch((err) => console.log(err));
