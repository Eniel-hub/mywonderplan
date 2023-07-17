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

function getDay(date) {
  let day = Date(date).substring(0, 3);
  if (day.toLowerCase == "sun") return "sunday";
  if (day.toLowerCase == "mon") return "monday";
  if (day.toLowerCase == "tue") return "tuesday";
  if (day.toLowerCase == "wed") return "wednesday";
  if (day.toLowerCase == "thu") return "thursday";
  if (day.toLowerCase == "fri") return "friday";
  if (day.toLowerCase == "sat") return "saturday";
  return false;
}

module.exports = {
  EmptyOrRows,
  swap,
  toHash,
  GenPassword,
  getDay,
};
