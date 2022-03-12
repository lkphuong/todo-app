export function replaceBearer(authorization: string) {
  return authorization.replace('Bearer ', '');
}
