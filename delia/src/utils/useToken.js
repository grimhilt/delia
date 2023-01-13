export const getToken = () => {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken;
};

export const setToken = (token) => {
    localStorage.setItem('token', JSON.stringify(token));
};

export const clearToken = () => {
  localStorage.removeItem('token');
};