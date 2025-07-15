const {
  getCurrentDateWithHours,
  getCurrentDateParts,
  getCurrentMonthAndYear,
} = require("../utils/date.js");
const { IGNORED_USERS } = require("../constants/ignoredUsers.js");

const makeInvoice = (users, currentMonth = getCurrentDateParts().month) => {
  const currentDate = getCurrentDateWithHours();

  const usersList = Object.values(users);
  const invoice = usersList
    .filter(({ role }) => role === "student")
    .reduce(
      (userInvoice, user) => {
        // if (IGNORED_USERS.includes(user.tutor)) {
        //   return userInvoice;
        // }
        if (!userInvoice.info[user.tutor]) {
          userInvoice.info[user.tutor] = {
            amount: 0,
            paid: false,
            totalHours: 0,
            averageLessonCost: 0,
          };
        }
        const totalLessonsPaymentAmount =
          user.lessons?.reduce((total, lesson) => {
            if (lesson.date.split(".")[1] === currentMonth) {
              userInvoice.info[user.tutor].totalHours += 1;
              return total + lesson.price * lesson.duration;
            }
            return total;
          }, 0) || 0;

        userInvoice.info[user.tutor].averageLessonCost =
          +(
            userInvoice.info[user.tutor].amount /
            userInvoice.info[user.tutor].totalHours
          ).toFixed(2) || 0;

        userInvoice.info[user.tutor].amount += totalLessonsPaymentAmount;
        userInvoice.income += totalLessonsPaymentAmount;

        return userInvoice;
      },
      {
        date: currentDate,
        info: {},
        income: 0,
        commision: 0,
        id: getCurrentMonthAndYear(),
      }
    );

  usersList
    .filter(({ role }) => role === "tutor")
    .map(({ login, percentage }) => {
      invoice.info[login].percentage = percentage;

      const commision = percentage * invoice.info[login].amount;
      invoice.info[login].commision = Math.round(commision);

      invoice.commision += commision;
    });

  invoice.averagePercentage = +(
    (invoice.commision * 100) /
    invoice.income
  ).toFixed(2);

  return invoice;
};

module.exports = { makeInvoice };
