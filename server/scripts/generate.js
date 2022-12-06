const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");


function getPrivateKey() {
    const privateKey = secp.utils.randomPrivateKey();
    return privateKey;
}

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

const privateKey = getPrivateKey();
const hexprivateKey = toHex(privateKey);

const publicKey = getPublicKey(privateKey);
const hexpublicKey = toHex(publicKey);

const address = getAddress(publicKey);

console.log("Private Key: ", hexprivateKey);
console.log("Public Key: ", hexpublicKey);
console.log("Address: ", address);
