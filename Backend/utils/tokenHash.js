const crypto = require("node:crypto");
const ResetToken = require("../models/tokenModel");
 // should be "function"

async function createResetToken(userId) {
  console.log("Crypto test:", typeof crypto.createHash);
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  const token = await ResetToken.create({
    userId : userId,
    tokenHash: tokenHash,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });
  await token.save();
  return rawToken;
}

module.exports = {createResetToken};