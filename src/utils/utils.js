const isTimeApproaching = (startDate) => {
  const currentDate = new Date();
  const startDateObj = new Date(startDate);
  const difference = startDateObj.getTime() - currentDate.getTime();
  const minutesDifference = Math.floor(difference / (1000 * 60));
  return minutesDifference <= 5 && minutesDifference >= 0;
};

export default isTimeApproaching;
