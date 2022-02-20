import React, { Component } from 'react';
import UnitList from './UnitList';
import TitleBar from './TitleBar';
import Sumerian from './Sumerian';
import Whiteboard from './Whiteboard';
import Navigator from './Navigator';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

class VRClassroom extends Component {
    constructor(props) {
        super(props);
        const current = decodeURI(window.location.href);
        const search = current.split("?")[1];
        const params = new URLSearchParams(search);
        this.params = new URLSearchParams(search);
        this.language = params.get('language');
        this.state = {
            courseId: null,
            course: null,
            lectureId: null,
            lectureTitle: "",
            units: null,
            currentUnitIndex: null,
            currentUnitTitle: null,
            content: null,
            steps: null,
            currentStep: null,
            sumerianIsReady: false,
            loading: false
        }
    }

    componentDidMount() {
        const courseId = this.params.get('courseId');
        const lectureId = this.params.get('lectureId');
        const language = this.params.get('language');
        this.getCourseInfo(courseId);
        this.getLectureInfo(courseId, lectureId);
        this.setState({ language: language });
        this.setState({ courseId: courseId });
        this.setState({ lectureId: lectureId }, () => {

            this.getLectureUnits(courseId, lectureId);
            if (this.state.currentUnitIndex == null) {
                window.addEventListener('message', this.handleChildMessage);
            }
        });
    }

    componentWillUnmount() {
        // Make sure to remove the DOM listener when the component is unmounted.
        window.removeEventListener("message", this.handleChildMessage);
    }

    handleChildMessage = (event) => {
        toast.info(event.data);
        if (event.data === "SUMERIAN_LOAD_COMPLETED") {
            // TODO: Disable auto-start feature for testing
            //this.setState({ sumerianIsReady: true}, () => {
            //    this.startLearning();
            //})
            this.setState({ sumerianIsReady: true});
        }
    }

    async startLearning() {

        if (this.state.sumerianIsReady === false) {
            console.log("sumerian is not ready yet.");
            return;
        }

        const sleep = (milliseconds) => {
            return new Promise(resolve => setTimeout(resolve, milliseconds))
        }

        // stop previous speaking 
        this.muteTeacher();
        this.muteGuest();

        await sleep(1000);

        const step = this.state.steps[this.state.currentStep];

        // TODO: need to find a way to stop speaking when the user moves to other contents
        this.setState({ content: step.content });
        for (var i in step.dialogs) {
            const dialog = step.dialogs[i].dialog;
            if (step.dialogs[i].host == "1") {
                console.log("speak Teacher" + dialog);
                this.speakTeacher(dialog);
            } else if (step.dialogs[i].host == "2") {
                console.log("speak guest" + dialog);
                this.speakGuest(dialog);
            }
            await sleep(step.dialogs[i].time);
        }
    }

    muteTeacher() {
        const msg = {
            'type': 'stop',
            'host': 'Alien',
            'dialog': ''
        };

        const sumerian = document.getElementById('sumerianHost');
        sumerian.contentWindow.postMessage(msg, '*');
    }

    muteGuest() {
        const msg = {
            'type': 'stop',
            'host': 'Luke',
            'dialog': ''
        };

        const sumerian = document.getElementById('sumerianHost');
        sumerian.contentWindow.postMessage(msg, '*');
    }

    speakTeacher(message) {
        const msg = {
            'type': 'play',
            'host': 'Alien',
            'dialog': message
        };

        const sumerian = document.getElementById('sumerianHost');
        sumerian.contentWindow.postMessage(msg, '*');
    }

    speakGuest(message) {
        const msg = {
            'type': 'play',
            'host': 'Luke',
            'dialog': message
        };

        const sumerian = document.getElementById('sumerianHost');
        sumerian.contentWindow.postMessage(msg, '*');
    }

    async getLectureInfo(courseId=1, lectureId=1) {
        this.setState({ loading: true });
        const backendAPI = `${process.env.REACT_APP_BACKEND_SERVER}/courses/${courseId}/lectures/${lectureId}`;
        const res = await axios.get(backendAPI);        
        this.setState({ loading: false });

        if (res != null && res.data.listCourses != null) {
            this.setState({ lectureTitle: res.data.listCourses.items.lecture_title });
        }
        else {
            toast.error("something wrong! try again.");
        }
    }

    async getCourseInfo(courseId=1) {

        this.setState({ loading: true });
        const backendAPI = `${process.env.REACT_APP_BACKEND_SERVER}/courses/${courseId}`;
        console.log(backendAPI);
        const res = await axios.get(backendAPI);      
        console.log(res);  
        this.setState({ loading: false });

        if (res != null && res.data.listCourses != null) {
            this.setState({ course: res.data.listCourses.items });
        }
        else {
            toast.error("something wrong! try again.");
        }
    }

    async getLectureUnits(courseId=1, lectureId=1) {

        this.setState({ loading: true });
        const backendAPI = `${process.env.REACT_APP_BACKEND_SERVER}/courses/${courseId}/lectures/${lectureId}/units`;

        const res = await axios.get(backendAPI);        
        this.setState({ loading: false });

        if (res != null && res.data.listCourses != null) {
            this.setState({ units: res.data.listCourses.items }, () => {
                this.selectCurrentUnit(1, true); // set default unit
            });
        }
        else {
            toast.error("something wrong! try again.");
        }
    }

    async getUnitSteps(courseId=1, lectureId=1, unitId=1, forward=true) {

        this.setState({ loading: true });
        const backendAPI = `${process.env.REACT_APP_BACKEND_SERVER}/courses/${courseId}/lectures/${lectureId}/units/${unitId}/steps`;
        //console.log(backendAPI);
        const res = await axios.get(backendAPI);        
        this.setState({ loading: false });

        console.log(res.data);
        if (res != null && res.data.steps != null) {
            var step = 0;
            if (forward == false) {
                step = res.data.steps.length - 1;
            }
            this.setState({ steps: res.data.steps, currentStep: step }, ()=> {
                this.startLearning();
            });
        }
        else {
            toast.error("something wrong! try again.");
        }
    }

    // TODO: need to check if there's proper gesture to show more interactely
    onCorrect = () => {
        this.speakTeacher(`<speak><amazon:domain name="news"><prosody rate="110%" volume="loud"><amazon:effect name="drc">Nice!!! That's correct.</amazon:effect></prosody></amazon:domain></speak>`);
        toast.info("Nice!!! That's correct.");
    }

    onWrong = () => {
        this.speakTeacher(`<speak><amazon:domain name="news"><prosody rate="110%" volume="loud"><amazon:effect name="drc">Sorry. Try again!</amazon:effect></prosody></amazon:domain></speak>`);
        toast.info("Sorry. Try again!");
    }

    selectCurrentUnit = (unit_order, forward=true) => {

        var unitTitle = "";
        var unitId = "";
        for (var i in this.state.units) {
            if (this.state.units[i].unit_order === unit_order) {
                unitId = this.state.units[i].id;
                unitTitle = this.state.units[i].unit_title;
                break;
            }
        }

        this.setState({ currentUnitIndex: unit_order });
        this.setState({ currentUnitTitle: unitTitle });
        this.getUnitSteps(this.state.courseId, this.state.lectureId, unitId, forward);
    }

    onClickNext = () => {
        // If there's any next steps in the current unit, then move to the next step
        // If there's no next step in the current unit, then movo to the next unit
        // If there's no next unit as well, then to nothing. It's the end of the course.
        //console.log(`onClickNext currentStep:${this.state.currentStep} steps.length:${this.state.steps.length} currentUnitIndex:${this.state.currentUnitIndex}`);

        if  (this.state.currentStep === this.state.steps.length - 1) {
            if (this.state.currentUnitIndex === this.state.units.length) {
                console.log("onClickNext : Nothing to do.");
            } else {
                console.info("need to go to the next unit.");
                this.selectCurrentUnit(this.state.currentUnitIndex + 1, true);
            }
        } else {
            this.setState({ currentStep : this.state.currentStep + 1 }, () => {
                this.startLearning();
            }); 
        }      
    }

    onClickPrevious = () => {
        // If there's any previous step in the current unit, then move to the previous step
        // If there's no previous step in the current unit, then movo to the previous unit
        // If there's no previous unit as well, then to nothing
        //console.log(`onClickPrevious currentStep:${this.state.currentStep} steps.length:${this.state.steps.length} currentUnitIndex:${this.state.currentUnitIndex}`);

        if  (this.state.currentStep === 0) {
            if (this.state.currentUnit === 1) {
                console.log("onClickPrevious. Nothing to do.");
            } else {
                console.log("need to go to the previous unit.");
                this.selectCurrentUnit(this.state.currentUnitIndex - 1, false);
            }
        } else {
            this.setState({ currentStep : this.state.currentStep - 1 }, () => {
                this.startLearning();
            }); 
        }
    }

    onClickUnit = (event) => {
        console.log("onClickUnit:" + event.target.value);
        this.selectCurrentUnit(event.target.value, true);
    }

    render() {
        return (
            <div>
                <div className="container">
                    <TitleBar className="re:Invent 2021" lectureId={this.state.lectureId} lectureTitle={this.state.lectureTitle} />
                    <div className="row"><br /></div>
                    <div className="row">
                        <div className="col-6">
                            <Sumerian language={this.language} />
                        </div>
                        <div className="col-6">
                            <h5>{this.state.steps && this.state.currentUnitTitle}</h5>
                            <hr />
                            <Whiteboard content={this.state.content} language={this.language} onCorrect={this.onCorrect} onWrong={this.onWrong}/>
                        </div>
                    </div>
                    <br /><br />
                    <Navigator onClickNext={this.onClickNext} onClickPrevious={this.onClickPrevious} />
                    <br /><br />
                    <UnitList onClickUnit={this.onClickUnit} units={this.state.units} loading={this.state.loading} currentUnitIndex={this.state.currentUnitIndex} />
                </div>
                <ToastContainer position="bottom-right" autoClose="3000" />
                <br /><br />
            </div>
        );
    }
}

export default VRClassroom;