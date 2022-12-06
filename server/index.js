const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

/*
Private Key:  3d515ea85c272076808a745118d8d11dd584ae126591077a0ed842388da7637d
Public Key:  04c28d289ed64392b3c5b2110cf55b5e7217246c9c25685b39c9c4325c5a4244ebaf89ca843c23284587d1888ebe91b92b31db9073d7c0e4a86607560a09727d56
Address:  29313724b37a3de299bf5af5766fc3f6a0b4a9b5

Private Key:  6e88c53e6d3c067d3baa22e60e135a9b29586aada98618f5d62911f49b67126b
Public Key:  0447cc332761b1d509a45f6f40d926719a7073d2fd6db043e9af6aa5ff9b41e7ef1b4e2eb98a9cf90e60fd5550b9080a6bf539e5fde23bc1b00972f4215ec4bad9
Address:  ea3857e41bd419ffdcd0b12148f0852dd50a1958

Private Key:  65a24905cc573647f50575e724d36d92a98afe2aa81bafc28fb2a4ceca7a068d
Public Key:  04f9a92d35ff193245b2f7108ce63527a2010b0c0da83664aa66a5499905f1453da2f4a67db7b28a2f28b5a8d8f638d69d61ec2f8254f0032071d7434d1587c935
Address:  2705c8fb258e36f141450c471068f27087f7c3af
*/
const balances = {
  "29313724b37a3de299bf5af5766fc3f6a0b4a9b5": 100,
  "ea3857e41bd419ffdcd0b12148f0852dd50a1958": 50,
  "2705c8fb258e36f141450c471068f27087f7c3af": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
