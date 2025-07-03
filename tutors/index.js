const { writeFileSync } = require("fs");

const getTutorsFromUsers = (users) => {
  const tutors = Object.values(users).filter(({ role }) => role === "tutor");

  return tutors;
};

const getTutorLoginsFromUsers = (users) => {
  return users.map((user) => user.login);
};

const saveTutorsInFile = (tutors) => {
  writeFileSync(
    "./tutors/tutors.json",
    JSON.stringify(tutors, null, 2),
    "utf-8"
  );
};

module.exports = {
  saveTutorsInFile,
  getTutorsFromUsers,
  getTutorLoginsFromUsers,
};
