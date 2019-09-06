import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import pageLoader from "../redux/reducers/pageLoader";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  combineReducers({
    page_data: pageLoader
  }),
  {},
  composeEnhancers(applyMiddleware())
);
export { store };