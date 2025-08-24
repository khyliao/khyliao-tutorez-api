const admin = require("firebase-admin");
const serviceAccount = require("../config/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://tutorez-com-ua-default-rtdb.europe-west1.firebasedatabase.app",
});

const db = admin.database();

async function getUsers() {
  const ref = db.ref("users");
  const snapshot = await ref.once("value");
  return snapshot.val();
}

async function getCurrentPayment(monthAndYear) {
  const ref = db.ref(`payments/${monthAndYear}`);
  const snapshot = await ref.once("value");
  return snapshot.val();
}

async function writeToPayments(invoice) {
  const ref = db.ref(`payments/${invoice.id}`);

  await ref.update(invoice);
}

module.exports = { db, getUsers, writeToPayments, getCurrentPayment };
