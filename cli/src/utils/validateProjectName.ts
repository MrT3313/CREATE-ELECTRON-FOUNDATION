export const validateProjectName = (name: string) => {
  const validationRegExp =
    /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/
  if (validationRegExp.test(name)) {
    return
  } else {
    return `"${name}" is not a valid project name. Please use a valid npm package name.`
  }
}