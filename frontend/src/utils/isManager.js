/**
 * @returns { boolean } - whether the current user is a manager
 */
export default function isManager() {
  const cookiesString = document.cookie;
  const cookies = cookiesString.split(';').map((cookieString) => cookieString.trim().split('='));
  const isManagerCookie = cookies.find((cookie) => cookie[0] === 'isManager')?.at(1);
  return isManagerCookie === 'true';
}
