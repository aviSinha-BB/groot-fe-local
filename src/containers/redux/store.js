import { createStore, combineReducers } from "redux";
import appVal from "./reducers/appVal";

const store = createStore(combineReducers({temp_data:appVal}),  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export { store };
