import Cookies from 'js-cookie';

const TokenKey = "";

export const getToken = () => {
    return Cookies.get(TokenKey);
}

export const setToken = (token: string, rememeberMe: boolean) => {
    if (rememeberMe) {
        return Cookies.set(TokenKey, token, {expires: 100})
    } else {
        return Cookies.set(TokenKey, token);
    }
}

export const removeToken = () => {
    return Cookies.remove(TokenKey);
}