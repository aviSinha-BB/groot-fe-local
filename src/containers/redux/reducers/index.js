import { combineReducers } from "redux";
import pageLoader from "./pageLoader";

export default combineReducers({
    page_data: pageLoader
});