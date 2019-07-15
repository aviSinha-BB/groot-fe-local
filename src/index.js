import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import JssProvider from 'react-jss/lib/JssProvider';
import {
  MuiThemeProvider,
  createMuiTheme,
  createGenerateClassName,
} from '@material-ui/core/styles';
import { BrowserRouter } from 'react-router-dom';
import { apitimeout } from './components/api_timeout';
import ErrorToast from './components/ErrorToast';
import Loader from './components/Loading';
import App from './containers/App';
import './assets/styles/style.css';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      permissionSnack: false,
      errorSnack: false,
      togglePerm: '',
      errorSnackTwo: false,
      toggleApp: '',
      loading: false
    }
  }

  componentDidMount() {
    var url = window.location.href;
    var authToken = url.split("?sessionId=")[1];

    if (typeof authToken !== "undefined") {
      localStorage.setItem('token', authToken);
    }

    if (localStorage.getItem('token') === null) {
      window.location.replace(catalogHost);
    }

    if (localStorage.getItem('userPermission') === null && localStorage.getItem('token')) {
      this.setState({ loading: true });
      apitimeout(pendingTimeout, fetch(templateAPI + '/permissions', {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          "X-Requested-With": "XMLHttpRequest",
          [AuthKey]: localStorage.getItem('token')
        }
      })).then(response => {
        if (response.status == 200) {
          this.setState({ toggleApp: true, loading: false });
          return response.json();
        }
        else if (response.status == 401) {
          this.setState({ permissionSnack: true, toggleApp: false, loading: false });
          setTimeout(() => {
            this.setState({
              permissionSnack: false
            });
            window.location.replace(catalogHost);
          }, timeout);
        }
        else {
          this.setState({ toggleApp: false });
          throw Error(response.statusText);
        }
      })
        .then(result => {
          if (result) {
            localStorage.setItem('userPermission', result);
            if (localStorage.getItem('userPermission').includes(creatorPermission)) {
              this.setState({ togglePerm: true });
            }
            else {
              this.setState({ togglePerm: false });
            }
          }
          else {
            this.setState({ errorSnackTwo: true });
            setTimeout(() => {
              this.setState({
                errorSnackTwo: false
              })
            }, timeout);
          }
        })
        .catch((error) => {
          this.setState({ errorSnack: true, loading: false });
          setTimeout(() => {
            this.setState({
              errorSnack: false
            })
          }, timeout);
          console.log('Looks like there was a problem in fetching permissions \n', error);
        });
    }

    if (localStorage.getItem('userPermission') && localStorage.getItem('token'))
      this.setState({ toggleApp: true });
  }
  render() {
    return (
      <div>
        {this.state.loading && <Loader />}
        {this.state.toggleApp && <BrowserRouter>
          <App togglePerm={this.state.togglePerm} />
        </BrowserRouter>}
        {this.state.errorSnack && <ErrorToast message="Error in Processing" />}
        {this.state.errorSnackTwo && <ErrorToast message="Error in Processing" />}
        {this.state.permissionSnack && <ErrorToast message="User is not Authorized!" />}
      </div>
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
