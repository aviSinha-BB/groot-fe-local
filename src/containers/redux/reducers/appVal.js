import { SET_TEMP_COMPONENT } from "../actions/tempAction";

export default function setTemp(state = {}, action) {
    switch (action.type) {
        case SET_TEMP_COMPONENT:
            return action.val;
        default:
            return state;
    }
};