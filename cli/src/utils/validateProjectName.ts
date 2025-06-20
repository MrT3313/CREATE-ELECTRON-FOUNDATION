export const validateProjectName = (name: string) => {
  const validationRegExp =
    /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/
  const keywords = ['null', 'undefined', 'false', 'true']
  if (keywords.includes(name) || /^[0-9]/.test(name)) {
    return `"${name}" is not a valid project name. Please use a valid npm package name.`
  }

  if (validationRegExp.test(name)) {
    return
  } else {
    return `"${name}" is not a valid project name. Please use a valid npm package name.`
  }
}
