export const loginSuccess = (user) => ({
    type: 'LOGIN_SUCCESS',
    payload: user,
});

export const updateUserProfile = (userData) => ({
    type: 'UPDATE_USER_PROFILE',
    payload: userData,
});

export const logout = () => ({
    type: 'LOGOUT',
});
