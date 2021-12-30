const { decryptJsonWalletSync } = require("@ethersproject/json-wallets");
const { assert } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");

describe("Game5", function () {
  it("should be a winner", async function () {
    const Game = await ethers.getContractFactory("Game5");
    const game = await Game.deploy();
    await game.deployed();

    const threshold = BigNumber.from(
      "0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf"
    );

    // MINING FOR SOME ACCOUNTS
    let nonce = 1;
    while (true) {
      const pkey = new ethers.utils.SigningKey(nonce).publicKey;
      const address = ethers.utils.computeAddress(pkey);
      const number = BigNumber.from(address);
      if (number.lt(threshold)) {
        break;
      }
      nonce++;
    }
    const wallet = new ethers.Wallet(nonce, ethers.provider);

    // good luck
    const tx = await ethers.provider.getSigner(0).sendTransaction({
      value: ethers.utils.parseEther("1"),
      to: wallet.address,
    });
    await tx.wait();

    await game.connect(wallet).win();

    // leave this assertion as-is
    assert(await game.isWon(), "You did not win the game");
  });
});
