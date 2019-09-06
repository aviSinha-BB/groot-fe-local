import { SET_PAGE1_DATA } from "../actions/page1Actions";

export default function setPage(state = {}, action) {
    switch (action.type) {
        case SET_PAGE1_DATA:
            return action.page;
        default:
            return state;
    }
}