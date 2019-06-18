import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import JssProvider from 'react-jss/lib/JssProvider';
import {
  MuiThemeProvider,
  createMuiTheme,
  createGenerateClassName,
} from '@material-ui/core/styles';
import { BrowserRouter } from 'react-router-dom';
import App from './containers/App';
import { Provider } from "react-redux";
import './assets/styles/style.css';
import { store } from "./containers/redux/store";

class Main extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );
  }
}

// Create a theme instance.
const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },

  palette: {
    primary: {
      light: "#757ce8",
      main: "#fff",
      dark: "#002884",
      contrastText: "#fff"
    },
    typography: {
      // Use the system font instead of the default Roboto font.
      fontFamily: ["ProximaNova-Regular"],
      type: "light"
    }
  }
});

// Create a new class name generator.
const generateClassName = createGenerateClassName();

ReactDOM.hydrate(
  <JssProvider generateClassName={generateClassName}>
    <MuiThemeProvider theme={theme}>
      <Main />
    </MuiThemeProvider>
  </JssProvider>,
  document.querySelector('#app-root'),
);
