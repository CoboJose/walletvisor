const timestampToStringDate = (timestamp: number): string => {
  return stringDateFormatted(new Date(timestamp).toISOString().slice(0, 10));
};

const getTimestampWithoutTime = (date: Date): number => {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).getTime();
};

const getCurrentDateTimeString = (): string => {
  const date = new Date();
  const day = addZero(date.getDate());
  const month = addZero(date.getMonth());
  const year = date.getFullYear();
  const hours = addZero(date.getHours());
  const minutes = addZero(date.getMinutes());
  const seconds = addZero(date.getSeconds());

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const getCurrentTime = (): string => {
  const date = new Date();
  const hours = addZero(date.getHours());
  const minutes = addZero(date.getMinutes());
  const seconds = addZero(date.getSeconds());
  const miliseconds = addZero(date.getMilliseconds());

  return `${hours}:${minutes}:${seconds}:${miliseconds}`;
};

const getFirstDayOfCurrentMonth = (): Date => {
  const date = new Date();
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
};

const getLastDayOfCurrentMonth = (): Date => {
  const date = new Date();
  return new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 0));
};

export default { timestampToStringDate, getTimestampWithoutDate: getTimestampWithoutTime, getCurrentDateTimeString, getCurrentTime, getFirstDayTimestampOfCurrentMonth: getFirstDayOfCurrentMonth, getLastDayTimestampOfCurrentMonth: getLastDayOfCurrentMonth };

const addZero = (element: number): string => {
  let res = element.toString();

  if (element < 10) {
    res = '0' + res;
  }

  return res;
};

const stringDateFormatted = (date: string): string => {
  const dateArray = date.split('-');
  return dateArray.reverse().join('/');
};
