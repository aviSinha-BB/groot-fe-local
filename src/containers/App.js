import React, { Component, Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { store } from "./redux/store";
import { SET_TEMP_COMPONENT } from "./redux/actions/tempAction";
import ErrorToast from '../components/ErrorToast';
const ChooseTemplate = React.lazy(() => import(/* webpackChunkName: "ChooseTemplate" */"../components/ChooseTemplate"));
const ManageAplusTemplate = React.lazy(() => import(/* webpackChunkName: "ManageAplusTemplate" */"../components/ManageAplusTemplate"));
const TemplateView = React.lazy(() => import(/* webpackChunkName: "TemplateView" */"./TemplateView"));
import Navbar from "../components/Navbar";
import Loader from '../components/Loading';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tempComponent: 'tc',
            errorSnack: false,
            errorSnackTwo: false
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        var url = window.location.href;
        var authToken = url.split("?sessionId=")[1];
        localStorage.setItem('token', 'abc');

        if (typeof authToken !== "undefined") {
            store.dispatch({
                type: SET_TEMP_COMPONENT,
                val: this.state.tempComponent
            });
            localStorage.setItem('token', authToken);
        }

        if (localStorage.getItem('token') === null) {
            window.location.replace(catalogHost);
        }

        if (localStorage.getItem('userPermission') === null && localStorage.getItem('token')) {
            App.timeoutfetch(pendingTimeout, fetch(templateAPI + '/permissions', {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    "X-Requested-With": "XMLHttpRequest",
                    [AuthKey]: localStorage.getItem('token')
                }
            })).then(response => {
                if (response.status == 200) {
                    return response.json();
                }
                else {
                    throw Error(response.statusText);
                }
            })
                .then(result => {
                    if(result) {
                        localStorage.setItem('userPermission', result);
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
                    this.setState({ errorSnack: true });
                    setTimeout(() => {
                        this.setState({
                            errorSnack: false
                        })
                    }, timeout);
                    console.log('Looks like there was a problem in fetching permissions \n', error);
                });
        }

        if (nextProps.temp_data !== prevState.temp_data) {
            return {
                tempComponent: nextProps.temp_data
            };
        }
        else {
            return null
        }
    }

    static timeoutfetch(ms, promise) {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                reject(new Error("promise timeout"))
            }, ms);
            promise.then(
                (res) => {
                    clearTimeout(timeoutId);
                    resolve(res);
                },
                (err) => {
                    clearTimeout(timeoutId);
                    reject(err);
                }
            );
        })
    }

    render() {
        return (
            <div>
                <Navbar />
                <Suspense fallback={Loader}>
                    <Switch>
                        <Route exact path={preUrl+"/apluscontent/"} render={() => <ManageAplusTemplate />} />

                        <Route exact path={preUrl+"/apluscontent/all"} render={() => <ManageAplusTemplate />} />

                        <Route exact path={preUrl+"/apluscontent/choosetemp"} render={(props) => <ChooseTemplate {...props} />} />

                        <Route exact path={preUrl+"/apluscontent/tempview"} render={() => <TemplateView tempComponent={this.state.tempComponent} />} />
                    </Switch>
                </Suspense>
                {this.state.errorSnack && <ErrorToast message="Error in Processing" />}
                {this.state.errorSnackTwo && <ErrorToast message="Error in Processing" />}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        temp_data: state.temp_data
    };
}

export default connect(mapStateToProps)(App);