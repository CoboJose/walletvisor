const getFullDate = (): string => {
  const date = new Date();
  const day = addZero(date.getDate());
  const month = addZero(date.getMonth());
  const year = date.getFullYear();
  const hours = addZero(date.getHours());
  const minutes = addZero(date.getMinutes());
  const seconds = addZero(date.getSeconds());

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const getTime = (): string => {
  const date = new Date();
  const hours = addZero(date.getHours());
  const minutes = addZero(date.getMinutes());
  const seconds = addZero(date.getSeconds());
  const miliseconds = addZero(date.getMilliseconds());

  return `${hours}:${minutes}:${seconds}:${miliseconds}`;
};

const getCurrentStringDate = (): string => {
  return timestampToStringDate(new Date().getTime());
};

const timestampToStringDate = (timestamp: number): string => {
  return new Date(timestamp).toISOString().slice(0, 10);
};

const stringDatetoTimeStamp = (date: string): number => {
  return new Date(date).getTime();
};

/*
const stringDateFormatted = (date: string): string => {
  const dateArray = date.split('-');
  return dateArray.reverse().join('/');
};*/

//MATH
/*
const round = (number: number, decimals: number): number => {
  return Number(Math.round(number + 'e+' + decimals) + 'e-' + decimals);
}*/

export default { getFullDate, getTime, getCurrentStringDate, stringDatetoTimeStamp };

const addZero = (element: number): string => {
  let res = element.toString();

  if (element < 10) {
    res = '0' + res;
  }

  return res;
};
