const MAX_PHONE_WIDTH = 600;

const isPhone = (): boolean => {
  return window.screen.width < MAX_PHONE_WIDTH;
};

export default { isPhone };
