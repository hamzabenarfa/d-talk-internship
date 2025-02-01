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
