import React, { Component, Suspense } from 'react';
import Loader from '../components/Loading';
import { apitimeout } from '../components/api_timeout';
import ErrorToast from '../components/ErrorToast';
import { connect } from "react-redux";
import { store } from "./redux/store";
import { SET_PAGE1_DATA } from "./redux/actions/page1Actions";
const TemplateOne = React.lazy(() => import(/* webpackChunkName: "TemplateOne" */"../components/TemplateOne"));
const TemplateTwo = React.lazy(() => import(/* webpackChunkName: "TemplateTwo" */"../components/TemplateTwo"));

class TemplateView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current_props: "",
            loading: false,
            errorSnack: false,
            errorSnackTwo: false
        }
    }

    componentWillMount() {

        var url = window.location.href;
        var url_get = url.split("tempview?")[1];
        var host = url.split('/content-svc')[0];
        var url_tid = url_get.split("&")[1];
        var url_sid = url_get.split("&")[2];
        this.setState({ loading: true });

        if (url_tid) {
            var getSid = url_sid.split("=")[1];
            var getTid = url_tid.split("=")[1];
            apitimeout(pendingTimeout, fetch(host + templateAPI + '/' + getTid + '/' + getSid, {
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
                        let hT = {};
                        if(result.metaData.templateTag === "Temp 1") {
                            hT = {
                                heading: result.data.hiT.heading,
                                imageSrc: result.data.hiT.imageSrc,
                                visible: result.data.hiT.visible
                            };
                        }
                        else {
                            hT = {
                                heading: result.data.hvT.heading,
                                videoStr: result.data.hvT.videoSrc,
                                visible: result.data.hvT.visible
                            }
                        }
                        store.dispatch({
                            type: SET_PAGE1_DATA,
                            page: {
                                hiT: hT,
                                hihspM: {
                                    heading: result.data.hihspM.heading,
                                    imageSrc: result.data.hihspM.imageSrc,
                                    anotherHeading: result.data.hihspM.anotherHeading,
                                    subHeading: result.data.hihspM.subHeading,
                                    paragraph: result.data.hihspM.paragraph,
                                    visible: result.data.hihspM.visible
                                },
                                hspihB: {
                                    anotherHeading: result.data.hspihB.anotherHeading,
                                    subHeading: result.data.hspihB.subHeading,
                                    paragraph: result.data.hspihB.paragraph,
                                    imageSrc: result.data.hspihB.imageSrc,
                                    visible: result.data.hspihB.visible
                                },
                                ispLT: {
                                    heading: result.data.ispLT.heading,
                                    imageSrc: result.data.ispLT.imageSrc,
                                    subHeading: result.data.ispLT.subHeading,
                                    paragraph: result.data.ispLT.paragraph,
                                    visible: result.data.ispLT.visible
                                },
                                ispMT: {
                                    imageSrc: result.data.ispMT.imageSrc,
                                    subHeading: result.data.ispMT.subHeading,
                                    paragraph: result.data.ispMT.paragraph,
                                    visible: result.data.ispMT.visible
                                },
                                ispRT: {
                                    imageSrc: result.data.ispRT.imageSrc,
                                    subHeading: result.data.ispRT.subHeading,
                                    paragraph: result.data.ispRT.paragraph,
                                    visible: result.data.ispRT.visible
                                },
                                ispLB: {
                                    imageSrc: result.data.ispLB.imageSrc,
                                    subHeading: result.data.ispLB.subHeading,
                                    paragraph: result.data.ispLB.paragraph,
                                    visible: result.data.ispLB.visible
                                },
                                ispMB: {
                                    imageSrc: result.data.ispMB.imageSrc,
                                    subHeading: result.data.ispMB.subHeading,
                                    paragraph: result.data.ispMB.paragraph,
                                    visible: result.data.ispMB.visible
                                },
                                ispRB: {
                                    imageSrc: result.data.ispRB.imageSrc,
                                    subHeading: result.data.ispRB.subHeading,
                                    paragraph: result.data.ispRB.paragraph,
                                    visible: result.data.ispRB.visible
                                },
                                metaData: {
                                    taskId: result.metaData.taskId,
                                    manufacturer: result.metaData.manufacturer
                                },
                                association: {
                                    products: result.association.products,
                                    action: result.association.action
                                },
                                comment: result.comment
                            }

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

function mapStateToProps(state) {
    return {
        page_data: state.page_data
    };
}

export default connect(mapStateToProps)(TemplateView);