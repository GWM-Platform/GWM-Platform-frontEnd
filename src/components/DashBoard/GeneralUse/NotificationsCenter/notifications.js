import moment from "moment";

const notifications = [
  {
    id: 1,
    eventType: "FIXED_DEPOSIT_TICKET_APPROVED",
    time: moment().subtract(1.7, "hour").format(),
    read: true,
  },
  {
    id: 2,
    eventType: "WITHDRAW_TICKET_LIQUIDATED",
    time: moment().subtract(27, "hour").format(),
    read: false,
  },
  {
    id: 3,
    eventType: "FUND_CREATED",
    detail: "Hay un nuevo fondo disponible en el que invertir",
    time: moment().subtract(0.1, "hour").format(),
    read: false,
    path: "/Dashboard/buy?fund=2",
  },
].sort((a, b) => (moment(a.time).isAfter(moment(b.time)) ? -1 : 0));

export default notifications;
