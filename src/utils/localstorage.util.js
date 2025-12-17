import Cookies from "js-cookie";

export const getTokenLocal = () => {
  return Cookies.get("urban_auth_token")??null;
};
export const setTokenLocal = (token) => {
  Cookies.set("urban_auth_token", token, { expires: 10 });
};