import gradient from "gradient-string";

import { TITLE_TEXT } from "../consts.js";

const theme = {
  fuchsia: "#FF1493",
  chartreuse: "#7FFF00",
  aqua: "#00FFFF",
  tangerine: "#FF8C00",
  electricIndigo: "#6F00FF",
  laserRed: "#FF002A"
};

export const renderTitle = () => {
  const myGradient = gradient(Object.values(theme));

  // resolves weird behavior where the ascii is offset
  console.log(myGradient.multiline(TITLE_TEXT));
};