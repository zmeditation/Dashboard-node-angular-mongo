const reportDates = (startDate, endDate) => {
  const noData = 'no date';
  let sDate = isValidDateParam(startDate) ? new Date(startDate) : noData;
  let eDate = isValidDateParam(endDate) ? new Date(endDate) : noData;

  sDate = sDate instanceof Date ? sDate.toISOString().split('T')[0] : sDate;
  eDate = eDate instanceof Date ? eDate.toISOString().split('T')[0] : eDate;

  return { textDate: `(${sDate} -- ${eDate})` };
};

const isValidDateParam = (dateParam) => {
  var invalidDate = 'invalid date';
  var date = dateParam ? new Date(dateParam).toString() : invalidDate;

  return !date.toLowerCase().includes('invalid');
};

const getYesterdayDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  const stringDateYesterday = date.toISOString().split('T')[0];

  return { stringDateYesterday };
};

const getPastDate = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
};

module.exports = {
  reportDates,
  isValidDateParam,
  getYesterdayDate,
  getPastDate
};
