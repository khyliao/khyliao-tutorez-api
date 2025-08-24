const {
  getCurrentDateWithHours,
  getCurrentDateParts,
  getCurrentMonthAndYear,
} = require("../utils/date.js");
const { IGNORED_USERS } = require("../constants/ignoredUsers.js");

const makeInvoice = (users, currentPayment, currentMonthAndYear) => {
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
          console.log(user.tutor);
          userInvoice.info[user.tutor] = {
            amount: 0,
            totalPaidAmount:
              currentPayment.info[user.tutor]?.totalPaidAmount || 0,
            totalHours: 0,
          };
        }

        const tutorOfThisStudent = usersList.find(
          ({ login }) => user.tutor === login
        );

        if (!tutorOfThisStudent) return userInvoice;

        const tutorPrice = tutorOfThisStudent.tutorPriceByDefault || 0;

        const totalLessonsPaymentAmount =
          user.lessons?.reduce((total, lesson) => {
            if (lesson.date.split(".")[1] === getCurrentDateParts().month) {
              userInvoice.info[user.tutor].totalHours += lesson.duration;
              return total + user.price * lesson.duration;
            }
            return total;
          }, 0) || 0;

        // console.log(totalLessonsPaymentAmount);

        // userInvoice.info[user.tutor].averageLessonCost =
        //   +(
        //     userInvoice.info[user.tutor].amount /
        //     userInvoice.info[user.tutor].totalHours
        //   ).toFixed(2) || 0;

        userInvoice.info[user.tutor].amount += totalLessonsPaymentAmount;
        if (user.tutor !== "khilyao") {
          userInvoice.income += totalLessonsPaymentAmount;
        }

        return userInvoice;
      },
      {
        date: currentDate,
        info: {},
        income: 0,
        commision: 0,
        id: currentMonthAndYear,
      }
    );

  usersList
    .filter(({ role }) => role === "tutor")
    .map(({ login, tutorPriceByDefault }) => {
      const commision = invoice.info[login].totalHours * tutorPriceByDefault;
      invoice.info[login].commision = Math.round(commision);

      invoice.commision += commision;
    });

  return invoice;
};

module.exports = { makeInvoice };
