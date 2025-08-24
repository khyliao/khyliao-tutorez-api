const express = require("express");
const cors = require("cors");
const { CronJob } = require("cron");
const { getUsers, writeToPayments } = require("./firebase/index");
const { addRecordToLogs } = require("./logs/index");
const {
  saveTutorsInFile,
  getTutorsFromUsers,
  getTutorLoginsFromUsers,
} = require("./tutors/index");
const { getCurrentMonthAndYear } = require("./utils/date");
const { getCurrentPayment } = require("./firebase/index");
const { makeInvoice } = require("./payments/index");

const app = express();
const port = process.env.PORT || 3004;

app.use(cors());
const job = new CronJob(
  "0 * * * *",

  async () => {
    console.log("Running scheduled task ");

    try {
      const users = await getUsers();

      const tutorLogins = getTutorLoginsFromUsers(getTutorsFromUsers(users));
      await saveTutorsInFile(tutorLogins);

      const currentMonthAndYear = getCurrentMonthAndYear();

      const currentPayment = await getCurrentPayment(currentMonthAndYear);
      const invoice = makeInvoice(users, currentPayment, currentMonthAndYear);
      console.log(invoice);
      await writeToPayments(invoice);
    } catch (error) {
      console.error("Error in cronjob:", error);
    }
  },
  null,
  true,
  "Europe/Kyiv"
);

job.start();

app.get("/", async (req, res) => {
  res.send("Hello from Node.js backend!");
});

app.get("/logs", async (req, res) => {
  try {
    const record = req.query;
    await addRecordToLogs(record);
    res.status(200).send("Log saved");
  } catch (error) {
    console.error("Error in /logs:", error);
    if (!res.headersSent) {
      res.status(500).send("Failed to add log");
    }
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
