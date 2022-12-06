const secp = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

function getPublicKey(privateKey) {
    const publicKey = secp.getPublicKey(privateKey);
    return publicKey;
}

function getAddress(publicKey) {
    const key = publicKey.slice(1); // Remove the key format (compressed format or not)
    const hash = keccak256(key);
    const n = hash.length;
    const address = hash.slice(n-20);

    return toHex(address).toLowerCase();
}

function hashMessage(message) {
    const bytes = utf8ToBytes(message);
    const hash = keccak256(bytes); 
    return hash;
}



const privateKey = "3d515ea85c272076808a745118d8d11dd584ae126591077a0ed842388da7637d";

const publicKey = getPublicKey(privateKey);
const hexpublicKey = toHex(publicKey);

const address = getAddress(publicKey);

console.log("Private Key: ", privateKey);
console.log("Public Key: ", hexpublicKey);
console.log("Address: ", address);
console.log("\n");

const message = "5";
const messageHash = hashMessage(message);

(async () => {
    const signatureE = await secp.sign(messageHash, privateKey, { recovered: true });
    const [signature, recoveryBit] = signatureE;

    const recoveredPublicKey = secp.recoverPublicKey(messageHash, signature, recoveryBit);

    console.log("bit: ", recoveryBit);
    console.log("The Signature: ", toHex(signature));
    console.log("Recovered Public Key: ", toHex(recoveredPublicKey) == hexpublicKey);
})();