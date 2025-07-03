const { DateTime } = require("luxon");

const getKyivTime = () => {
  return DateTime.now().setZone("Europe/Kyiv").toFormat("HH:mm dd.MM.yyyy");
};

const getCurrentDateParts = () => {
  const date = new Date();

  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return { year, month, day, hours, minutes, seconds };
};

const getCurrentDateWithHours = () => {
  const { year, month, day, hours, minutes } = getCurrentDateParts();
  return `${hours}:${minutes} ${day}.${month}.${year}`;
};

const getCurrentMonthAndYear = () => {
  const { year, month } = getCurrentDateParts();

  return `${month}-${year}`;
};

module.exports = {
  getCurrentDateParts,
  getCurrentDateWithHours,
  getCurrentMonthAndYear,
  getKyivTime,
};
