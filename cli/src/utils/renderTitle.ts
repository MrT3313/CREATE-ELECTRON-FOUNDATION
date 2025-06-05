import gradient from 'gradient-string'

import { TITLE_TEXT } from '../consts.js'

const theme = {
  hotPink: '#FF0080',
  electricBlue: '#0066FF',
  neonPurple: '#8000FF',
  cyan: '#00CCFF',
  magenta: '#CC00FF',
  violet: '#6600CC',
}

export const renderTitle = () => {
  const myGradient = gradient(Object.values(theme))

  // resolves weird behavior where the ascii is offset
  console.log(myGradient.multiline(TITLE_TEXT))
}
