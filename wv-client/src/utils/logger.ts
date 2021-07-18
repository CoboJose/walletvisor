import dateUtil from 'utils/dates';

const info = (message: string): void => {
  const level = process.env.REACT_APP_LOGGER_LEVEL;
  if (level === 'info') {
    const template = `%cINFO%c %c${getCallerName()} ${dateUtil.getFullDate()}%c ${message}`;

    const levelCss = 'background-color: #50c758; color: black; border-radius:5px; font-size: 11px; padding: 2px; font-weight: bold;';
    const dataCss = 'color: green; font-style: italic';

    console.log(template, levelCss, null, dataCss, null);
  }
};

const warning = (message: string): void => {
  const level = process.env.REACT_APP_LOGGER_LEVEL;
  if (level === 'info' || level === 'warning') {
    const template = `%cWARNING%c %c${getCallerName()} ${dateUtil.getFullDate()}%c ${message}`;

    const levelCss = 'background-color: #d4f000; color: black; border-radius:5px; font-size: 11px; padding: 2px; font-weight: bold;';
    const dataCss = 'color: green; font-style: italic';

    console.log(template, levelCss, null, dataCss, null);
  }
};

const error = (message: string): void => {
  const level = process.env.REACT_APP_LOGGER_LEVEL;
  if (level === 'info' || level === 'warning' || level === 'error') {
    const template = `%cERROR%c %c${getCallerName()} ${dateUtil.getFullDate()}%c ${message}`;

    const levelCss = 'background-color: #d12828; color: black; border-radius:5px; font-size: 11px; padding: 2px; font-weight: bold;';
    const dataCss = 'color: green; font-style: italic';

    console.log(template, levelCss, null, dataCss, null);
  }
};

const rendering = (): void => {
  if (process.env.REACT_APP_LOGGER_RENDERING === 'true') {
    const template = `%cRENDERING%c %c${dateUtil.getTime()}%c ${getCallerName().toUpperCase()}`;

    const levelCss = 'background-color: #4287f5; color: black; border-radius:5px; font-size: 11px; padding: 2px; font-weight: bold;';
    const dataCss = 'color: green; font-style: italic';

    console.log(template, levelCss, null, dataCss, null);
  }
};

export default { info, warning, error, rendering };

const getCallerName = (): string => (new Error()).stack?.split('\n')[3].trim().split(' ')[1] ?? 'No caller';
