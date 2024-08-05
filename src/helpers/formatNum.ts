export const zeroPad = (numberInput: number | string) => {
  if (typeof numberInput === "number") {
    return numberInput.toString().padStart(2, "0");
  }
  return numberInput.padStart(2, "0");
};

export const getCountDownNumberArray = (numberInput: number) => {
  let arr = [];
  if (numberInput < 10) {
    arr[0] = 0;
    arr[1] = numberInput;
  } else {
    arr[0] = parseInt(numberInput.toString()[0]);
    arr[1] = parseInt(numberInput.toString()[1]);
  }
  return arr;
};
