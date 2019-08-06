import React, { Component, Suspense } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './ComponentStyle/ToolsPanelStyle';
import Loader from './Loading';
const SaveTempName = React.lazy(() => import(/* webpackChunkName: "SaveTempName" */"./SaveTempName"));
const SaveTempNameTwo = React.lazy(() => import(/* webpackChunkName: "SaveTempNameTwo" */"./SaveTempNameTwo"));
const Header = React.lazy(() => import(/* webpackChunkName: "Header" */"./Header"));
const Banner = React.lazy(() => import(/* webpackChunkName: "Banner" */"./Banner"));
const SubHeader = React.lazy(() => import(/* webpackChunkName: "SubHeader" */"./SubHeader"));
const Paragraph = React.lazy(() => import(/* webpackChunkName: "Paragraph" */"./Paragraph"));
const VideoUpload = React.lazy(() => import(/* webpackChunkName: "VideoUpload" */"./VideoUpload"));

class ToolsPanel extends Component {
    constructor(props) {
        super(props);
    }

    getBlockComponent = (block) => {
        switch (block) {
            case "Temp 1":
                return (<SaveTempName
                    aplusname={this.props.aplusname}
                    headingvalue={this.props.headingvalue}
                    headingTwovalue={this.props.headingTwovalue}
                    headingThreevalue={this.props.headingThreevalue}
                    anotherHeadingvalue={this.props.anotherHeadingvalue}
                    anotherHeadingTwovalue={this.props.anotherHeadingTwovalue}
                    subheadingvalue={this.props.subheadingvalue}
                    subheadingTwovalue={this.props.subheadingTwovalue}
                    subheadingThreevalue={this.props.subheadingThreevalue}
                    subheadingFourvalue={this.props.subheadingFourvalue}
                    subheadingFivevalue={this.props.subheadingFivevalue}
                    subheadingSixvalue={this.props.subheadingSixvalue}
                    subheadingSevenvalue={this.props.subheadingSevenvalue}
                    subheadingEightvalue={this.props.subheadingEightvalue}
                    paravalue={this.props.paravalue}
                    paraTwovalue={this.props.paraTwovalue}
                    paraThreevalue={this.props.paraThreevalue}
                    paraFourvalue={this.props.paraFourvalue}
                    paraFivevalue={this.props.paraFivevalue}
                    paraSixvalue={this.props.paraSixvalue}
                    paraSevenvalue={this.props.paraSevenvalue}
                    paraEightvalue={this.props.paraEightvalue}
                    imgsrcvalue={this.props.imgsrcvalue}
                    imgsrcTwovalue={this.props.imgsrcTwovalue}
                    imgsrcThreevalue={this.props.imgsrcThreevalue}
                    imgsrcFourvalue={this.props.imgsrcFourvalue}
                    imgsrcFivevalue={this.props.imgsrcFivevalue}
                    imgsrcSixvalue={this.props.imgsrcSixvalue}
                    imgsrcSevenvalue={this.props.imgsrcSevenvalue}
                    imgsrcEightvalue={this.props.imgsrcEightvalue}
                    imgsrcNinevalue={this.props.imgsrcNinevalue}
                    tempComponent={this.props.tempComponent}
                    taskId={this.props.taskId}
                    toggleSectionOne={this.props.toggleSectionOne}
                    toggleSectionTwo={this.props.toggleSectionTwo}
                    toggleSectionThree={this.props.toggleSectionThree}
                    toggleSectionFour={this.props.toggleSectionFour}
                    toggleSectionFive={this.props.toggleSectionFive}
                    toggleSectionSix={this.props.toggleSectionSix}
                    toggleSectionSeven={this.props.toggleSectionSeven}
                    toggleSectionEight={this.props.toggleSectionEight}
                />)

            case "Temp 2":
                return (<SaveTempNameTwo
                    aplusname={this.props.aplusname}
                    headingvalue={this.props.headingvalue}
                    headingTwovalue={this.props.headingTwovalue}
                    headingThreevalue={this.props.headingThreevalue}
                    anotherHeadingvalue={this.props.anotherHeadingvalue}
                    anotherHeadingTwovalue={this.props.anotherHeadingTwovalue}
                    subheadingvalue={this.props.subheadingvalue}
                    subheadingTwovalue={this.props.subheadingTwovalue}
                    subheadingThreevalue={this.props.subheadingThreevalue}
                    subheadingFourvalue={this.props.subheadingFourvalue}
                    subheadingFivevalue={this.props.subheadingFivevalue}
                    subheadingSixvalue={this.props.subheadingSixvalue}
                    subheadingSevenvalue={this.props.subheadingSevenvalue}
                    subheadingEightvalue={this.props.subheadingEightvalue}
                    paravalue={this.props.paravalue}
                    paraTwovalue={this.props.paraTwovalue}
                    paraThreevalue={this.props.paraThreevalue}
                    paraFourvalue={this.props.paraFourvalue}
                    paraFivevalue={this.props.paraFivevalue}
                    paraSixvalue={this.props.paraSixvalue}
                    paraSevenvalue={this.props.paraSevenvalue}
                    paraEightvalue={this.props.paraEightvalue}
                    imgsrcvalue={this.props.imgsrcvalue}
                    imgsrcTwovalue={this.props.imgsrcTwovalue}
                    imgsrcThreevalue={this.props.imgsrcThreevalue}
                    imgsrcFourvalue={this.props.imgsrcFourvalue}
                    imgsrcFivevalue={this.props.imgsrcFivevalue}
                    imgsrcSixvalue={this.props.imgsrcSixvalue}
                    imgsrcSevenvalue={this.props.imgsrcSevenvalue}
                    imgsrcEightvalue={this.props.imgsrcEightvalue}
                    imgsrcNinevalue={this.props.imgsrcNinevalue}
                    videoStr={this.props.videoStr}
                    tempComponent={this.props.tempComponent}
                    taskId={this.props.taskId}
                    toggleSectionOne={this.props.toggleSectionOne}
                    toggleSectionTwo={this.props.toggleSectionTwo}
                    toggleSectionThree={this.props.toggleSectionThree}
                    toggleSectionFour={this.props.toggleSectionFour}
                    toggleSectionFive={this.props.toggleSectionFive}
                    toggleSectionSix={this.props.toggleSectionSix}
                    toggleSectionSeven={this.props.toggleSectionSeven}
                    toggleSectionEight={this.props.toggleSectionEight}
                />)

            default:
                break;
        }
    }

    render() {
        const { classes } = this.props;
        let formComponent = null; //variable to take in form component based on conditions

        //cases to render form component based on its value
        switch (this.props.toggleComponent) {
            case "header":
                formComponent = <Header headingvalue={this.props.headingvalue}
                    updateHead={this.props.updateHead}
                />;
                break;
            case "headerTwo":
                formComponent = <Header headingvalue={this.props.headingTwovalue}
                    updateHead={this.props.updateHeadTwo}
                />;
                break;
            case "headerThree":
                formComponent = <Header headingvalue={this.props.headingThreevalue}
                    updateHead={this.props.updateHeadThree}
                />;
                break;
            case "anotherHead":
                formComponent = <Header headingvalue={this.props.anotherHeadingvalue}
                    updateHead={this.props.updateAnotherHead}
                />;
                break;
            case "anotherHeadTwo":
                formComponent = <Header headingvalue={this.props.anotherHeadingTwovalue}
                    updateHead={this.props.updateAnotherHeadTwo}
                />;
                break;
            case "banner":
                formComponent = <Banner aplusname={this.props.aplusname}
                    tempComponent={this.props.tempComponent}
                    imgsrcvalue={this.props.imgsrcvalue}
                    updateBanner={this.props.updateBanner}
                    bannerType="bannerLg"
                />;
                break;
            case "bannerTwo":
                formComponent = <Banner aplusname={this.props.aplusname}
                    tempComponent={this.props.tempComponent}
                    imgsrcvalue={this.props.imgsrcTwovalue}
                    updateBanner={this.props.updateBannerTwo}
                    bannerType="bannerMd"
                />;
                break;
            case "bannerThree":
                formComponent = <Banner aplusname={this.props.aplusname}
                    tempComponent={this.props.tempComponent}
                    imgsrcvalue={this.props.imgsrcThreevalue}
                    updateBanner={this.props.updateBannerThree}
                    bannerType="bannerMd"
                />;
                break;
            case "bannerFour":
                formComponent = <Banner aplusname={this.props.aplusname}
                    tempComponent={this.props.tempComponent}
                    imgsrcvalue={this.props.imgsrcFourvalue}
                    updateBanner={this.props.updateBannerFour}
                    bannerType="bannerSm"
                />;
                break;
            case "bannerFive":
                formComponent = <Banner aplusname={this.props.aplusname}
                    tempComponent={this.props.tempComponent}
                    imgsrcvalue={this.props.imgsrcFivevalue}
                    updateBanner={this.props.updateBannerFive}
                    bannerType="bannerSm"
                />;
                break;
            case "bannerSix":
                formComponent = <Banner aplusname={this.props.aplusname}
                    tempComponent={this.props.tempComponent}
                    imgsrcvalue={this.props.imgsrcSixvalue}
                    updateBanner={this.props.updateBannerSix}
                    bannerType="bannerSm"
                />;
                break;
            case "bannerSeven":
                formComponent = <Banner aplusname={this.props.aplusname}
                    tempComponent={this.props.tempComponent}
                    imgsrcvalue={this.props.imgsrcSevenvalue}
                    updateBanner={this.props.updateBannerSeven}
                    bannerType="bannerSm"
                />;
                break;
            case "bannerEight":
                formComponent = <Banner aplusname={this.props.aplusname}
                    tempComponent={this.props.tempComponent}
                    imgsrcvalue={this.props.imgsrcEightvalue}
                    updateBanner={this.props.updateBannerEight}
                    bannerType="bannerSm"
                />;
                break;
            case "bannerNine":
                formComponent = <Banner aplusname={this.props.aplusname}
                    tempComponent={this.props.tempComponent}
                    imgsrcvalue={this.props.imgsrcNinevalue}
                    updateBanner={this.props.updateBannerNine}
                    bannerType="bannerSm"
                />;
                break;
            case "subheader":
                formComponent = <SubHeader subheadingvalue={this.props.subheadingvalue}
                    updateSubHead={this.props.updateSubHead}
                />;
                break;
            case "subheaderTwo":
                formComponent = <SubHeader subheadingvalue={this.props.subheadingTwovalue}
                    updateSubHead={this.props.updateSubHeadTwo}
                />;
                break;
            case "subheaderThree":
                formComponent = <SubHeader subheadingvalue={this.props.subheadingThreevalue}
                    updateSubHead={this.props.updateSubHeadThree}
                />;
                break;
            case "subheaderFour":
                formComponent = <SubHeader subheadingvalue={this.props.subheadingFourvalue}
                    updateSubHead={this.props.updateSubHeadFour}
                />;
                break;
            case "subheaderFive":
                formComponent = <SubHeader subheadingvalue={this.props.subheadingFivevalue}
                    updateSubHead={this.props.updateSubHeadFive}
                />;
                break;
            case "subheaderSix":
                formComponent = <SubHeader subheadingvalue={this.props.subheadingSixvalue}
                    updateSubHead={this.props.updateSubHeadSix}
                />;
                break;
            case "subheaderSeven":
                formComponent = <SubHeader subheadingvalue={this.props.subheadingSevenvalue}
                    updateSubHead={this.props.updateSubHeadSeven}
                />;
                break;
            case "subheaderEight":
                formComponent = <SubHeader subheadingvalue={this.props.subheadingEightvalue}
                    updateSubHead={this.props.updateSubHeadEight}
                />;
                break;
            case "para":
                formComponent = <Paragraph paravalue={this.props.paravalue}
                    updatePara={this.props.updatePara}
                />;
                break;
            case "paraTwo":
                formComponent = <Paragraph paravalue={this.props.paraTwovalue}
                    updatePara={this.props.updateParaTwo}
                />;
                break;
            case "paraThree":
                formComponent = <Paragraph paravalue={this.props.paraThreevalue}
                    updatePara={this.props.updateParaThree}
                />;
                break;
            case "paraFour":
                formComponent = <Paragraph paravalue={this.props.paraFourvalue}
                    updatePara={this.props.updateParaFour}
                />;
                break;
            case "paraFive":
                formComponent = <Paragraph paravalue={this.props.paraFivevalue}
                    updatePara={this.props.updateParaFive}
                />;
                break;
            case "paraSix":
                formComponent = <Paragraph paravalue={this.props.paraSixvalue}
                    updatePara={this.props.updateParaSix}
                />;
                break;
            case "paraSeven":
                formComponent = <Paragraph paravalue={this.props.paraSevenvalue}
                    updatePara={this.props.updateParaSeven}
                />;
                break;
            case "paraEight":
                formComponent = <Paragraph paravalue={this.props.paraEightvalue}
                    updatePara={this.props.updateParaEight} />;
                break;
            case "video":
                formComponent = <VideoUpload videoStr={this.props.videoStr}
                    updateVideo={this.props.updateVideo}
                />;
                break;
            default:
                break;
        }

        return (
            <div className={classes.root} >
                <div className={classes.empty}></div>
                <span className={classes.labelStyle}>{this.props.aplusname}</span>
                <Suspense fallback={Loader}>
                    {formComponent}
                </Suspense>
                <div>
                    <Suspense fallback={Loader}>
                        {this.getBlockComponent(this.props.tempComponent)}
                    </Suspense>
                </div>
            </div>
        );
    }
}

ToolsPanel.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ToolsPanel);