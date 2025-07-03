const fs = require("fs");
// {id: logId, action: "actionDescription", "author": "userLogin", date: "hh:mm:ss dd-mm-yyyy""}
// 2025-04-19T16:39:50.349Z
const addRecordToLogs = (record) => {
  const year = record.fs.writeFileSync(
    `./logs/logs/${year}/${month}/${day}/.json`,
    JSON.stringify(tutors, null, 2),
    "utf-8"
  );
};
