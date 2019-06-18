import React, { Component, Suspense } from 'react';
import { connect } from "react-redux";
import { store } from "./redux/store";
import Loader from '../components/Loading';
import { SET_TEMP_COMPONENT } from "./redux/actions/tempAction";
import ErrorToast from '../components/ErrorToast';
const TemplateOne = React.lazy(() => import(/* webpackChunkName: "TemplateOne" */"../components/TemplateOne"));
const TemplateTwo = React.lazy(() => import(/* webpackChunkName: "TemplateTwo" */"../components/TemplateTwo"));

class TemplateView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current_props: "",
            loading: false,
            errorSnack: false,
            errorSnackTwo: false,
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.temp_data !== prevState.temp_data) {
            return {
                current_props: nextProps.temp_data
            };
        }
        else {
            return null
        }
    }

    timeout = (ms, promise) => {
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

    componentDidMount() {

        var url = window.location.href;
        var url_get = url.split("tempview?")[1];
        var url_tid = url_get.split("&")[1];
        var url_sid = url_get.split("&")[2];
        this.setState({ loading: true });

        if (url_tid) {
            var getSid = url_sid.split("=")[1];
            var getTid = url_tid.split("=")[1];

            this.timeout(pendingTimeout, fetch(templateAPI + '/' + getTid + '/' + getSid, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    [AuthKey]: localStorage.getItem('token')
                }
            })).then(res => {
                if (res.status == 200)
                    return res.json();
                else {
                    this.setState({ loading: false });
                    throw Error(response.statusText);
                }
            })
                .then(result => {
                    this.setState({ loading: false });
                    if (result.metaData) {
                        store.dispatch({
                            type: SET_TEMP_COMPONENT,
                            val: result.metaData.templateTag
                        });
                    }
                    else {
                        this.setState({ errorSnack: true });
                        setTimeout(() => {
                            this.setState({
                                errorSnack: false
                            });
                        }, timeout);
                    }
                })
                .catch((error) => {
                    this.setState({ errorSnackTwo: true, loading: false });
                    setTimeout(() => {
                        this.setState({
                            errorSnackTwo: false
                        })
                    }, timeout);
                    console.log('Problem in fetching template data in TemplateView \n', error);
                });

        }
        else {
            this.setState({ loading: false });
            store.dispatch({
                type: SET_TEMP_COMPONENT,
                val: this.props.tempComponent
            });
        }
    }

    getBlockComponent = (block) => {
        switch (block) {
            case "Temp 1":
                return (<TemplateOne tempComponent={block} />)

            case "Temp 2":
                return (<TemplateTwo tempComponent={block} />)

            default:
                break;
        }
    }

    render() {

        return (
            <div>
                {this.state.loading && <Loader />}
                <Suspense fallback={Loader}>
                    {this.getBlockComponent(this.state.current_props)}
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

export default connect(mapStateToProps)(TemplateView);