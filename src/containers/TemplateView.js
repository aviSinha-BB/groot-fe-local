import React, { Component, Suspense } from 'react';
import Loader from '../components/Loading';
import { apitimeout } from '../components/api_timeout';
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
            clientHost: null
        }
    }

    componentWillMount() {

        var url = window.location.href;
        var url_get = url.split("tempview?")[1];
        var host = url.split('/content-svc')[0];
        this.setState({ clientHost: host });
        var url_tid = url_get.split("&")[1];
        var url_sid = url_get.split("&")[2];
        this.setState({ loading: true });

        if (url_tid) {
            var getSid = url_sid.split("=")[1];
            var getTid = url_tid.split("=")[1];
            apitimeout(pendingTimeout, fetch(this.state.clientHost + templateAPI + '/' + getTid + '/' + getSid, {
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
                    throw Error(res.statusText);
                }
            })
                .then(result => {
                    this.setState({ loading: false });
                    if (result.metaData) {
                        this.setState({ current_props: result.metaData.templateTag });
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
            this.setState({ loading: false, current_props: this.props.tempComponent });
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

export default TemplateView;