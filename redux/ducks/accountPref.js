export const CHANGE_MODE = "change_mode";
export const DARK_MODE = "dark_mode";
export const UPLOAD_PIC = "upload_pic";
export const UPDATE_PIC = "update_pic";
export const DELETE_PIC = "delete_pic";

const initialState = {
    isDark: false,
    profilePicture: null,
    postPicture: null,
};

export function changeModeAction() {
    return { 
        type: CHANGE_MODE,
    };
}

export function uploadPicAction() {
    return{
        type: UPLOAD_PIC,
    };
}

export function updatePicAction() {
    return{
        type: UPDATE_PIC,
    };
}

export function deletePicAction() {
    return{
        type: DELETE_PIC,
    };
}

export default function accountPrefReducer(state = initialState, action) {
     switch (action.type) {
        case CHANGE_MODE:
            return { 
                ...state, isDark: !state.isDark 
            };
        case UPLOAD_PIC:
            return{
                ...state, profilePicture: action.payload,
            };
        case UPDATE_PIC:
            return{
                ...state, postPicture: action.payload,
            };
        case DELETE_PIC:
            return{
                ...state, profilePicture: null,
            };
        default:
            return state;
     }
}