const crypto = require("crypto");

function EmptyOrRows(rows) {
  if (!rows) {
    return [];
  }
  return rows;
}

function swap([first, second]) {
  let temp = first;
  first = second;
  second = temp;
  return [first, second];
}

function toHash(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 10000, 60, "sha512").toString("hex");
}

function GenPassword(password) {
  const salt = crypto.randomBytes(32).toString("hex");
  const hash = toHash(password, salt);
  return { salt, hash };
}

module.exports = {
  EmptyOrRows,
  swap,
  toHash,
  GenPassword,
};
