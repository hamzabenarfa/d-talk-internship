const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            localStorage.setItem('user', JSON.stringify(action.payload));
            return {
                ...state,
                user: action.payload,
            };
        case 'UPDATE_USER_PROFILE':
            const updatedUser = {
                ...state.user,
                user: {
                    ...state.user.user,
                    ...action.payload
                }
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return {
                ...state,
                user: updatedUser,
            };
        case 'LOGOUT':
            localStorage.removeItem('user');
            return {
                ...state,
                user: null,
            };
        default:
            return state;
    }
};

export default authReducer;
