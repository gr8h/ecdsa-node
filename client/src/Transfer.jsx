import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

function getAddress(publicKey) {
  const key = publicKey.slice(1); // Remove the key format (compressed format or not)
  const hash = keccak256(key);
  const n = hash.length;
  const address = hash.slice(n-20);

  return toHex(address).toLowerCase();
}

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [signature, setSignature] = useState("");
  const [recipient, setRecipient] = useState("");
  const [recoveryBit, setRecoveryBit] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      
      const msgbytes = utf8ToBytes(sendAmount);
      const messageHash = keccak256(msgbytes);

      const recoveredPublicKey = secp.recoverPublicKey(messageHash, signature, parseInt(recoveryBit));
      const recoveredAddress = getAddress(recoveredPublicKey);

      if (recoveredAddress.toString() !== address.toString()) {
        throw "Invalid Address";
      }

      const isValidSignature = secp.verify(signature, messageHash, recoveredPublicKey);
      if (!isValidSignature) {
        throw "Invalid Signature";
      }

      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: recoveredAddress,
        amount: parseInt(sendAmount),
        recipient,
      });
      setBalance(balance);
    } catch (ex) {
      if (ex && ex.response) {
        alert(ex.response.data.message);
      } else {
        alert(ex);
      }
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Signature
        <input
          placeholder="Type an address, for example: 0x2"
          value={signature}
          onChange={setValue(setSignature)}
        ></input>
      </label>

      <label>
        RecoveryBit
        <input
          value={recoveryBit}
          onChange={setValue(setRecoveryBit)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
