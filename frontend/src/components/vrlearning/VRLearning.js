import React, { Component, Fragment } from 'react';
import { Button } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import LoadScreen from '../../assets/images/load_screen.png'
import { API, graphqlOperation } from 'aws-amplify';
import { listCourses, listLectures } from '../../graphql/queries';
import ReactLoading from 'react-loading';
//import axios from "axios";

class VRLearningComponent extends Component {
    state = {
        selectedCourseId: "ef717ea27fc4426b99e484343a493e5a", // Korean 101
        courses: null,
        language: 'ko-KR',
        lectures: null,
        loading: false
    };

    componentDidMount() {
        this.getCourses();
        this.getLectures(this.state.selectedCourseId);
    }

    selectCourse = (courseId, language) => {
        this.setState({ selectedCourseId: courseId, language: language }, () => {
            this.getLectures(courseId);
        });
    }

    async getCourses() {
        this.setState({ loading: true });
        const res = await API.graphql(graphqlOperation(listCourses));
        //console.log(res);
        this.setState({ loading: false });

        if (res != null && res.data.listCourses != null) {
            this.setState({ courses: res.data.listCourses.items });
        }
        else {
            toast.error("something wrong! try again.");
        }
    }

    async getLectures(courseId="ef717ea27fc4426b99e484343a493e5a") {
        this.setState({ loading: true });
        console.log('@search > ' + courseId); 
        const res = await API.graphql(graphqlOperation(listLectures, {
            filter: {
                course_ref: {
                    eq: courseId
                }
            }
        }));
        console.log(res);     
        this.setState({ loading: false });

        if (res != null && res.data.listLectures != null) {
            this.setState({ lectures: res.data.listLectures.items });
        }
        else {
            toast.error("something wrong! try again.");
        }
    }

    enterClassroom = (lectureId, language) => {
        window.location.href = `/classroom?courseId=${this.state.selectedCourseId}&lectureId=${lectureId}&language=${language}`;
    }

    render() {
        return (
            <div>
                <h2>VRLearning</h2>
                Amazon AI/ML 서비스 및 Sumerian을 이용해서 구현한 셀프스터디 서비스입니다.
                <div className="container">
                    <div className="row">
                        <div className="col-6">
                            <img className="img-fluid" src={LoadScreen} alt="loadscreen" width="500" height="400"></img>
                        </div>
                        <div className="col-6">
                            <h2>
                                <i className="fas fa-quote-left" />&nbsp;
                                Hi, we are your language tutors.
                            </h2>
                            <h2>Learning a language is fun. </h2>
                            <h2>We will help you. <i className="fas fa-quote-right" />&nbsp;
                            </h2>
                            <br /><br />
                            <h2>Which language do you want to learn?</h2>
                            {this.state.courses && this.state.courses.map(( course, index) => {
                                    return (
                                        <Fragment>
                                        <Button className="ml-2" key={course.id} onClick={() => this.selectCourse(course.id, course.language)}><i className={ "fas fa-globe-" + course.icon } />&nbsp;{ course.title }</Button>
                                        &nbsp;&nbsp;</Fragment>
                                        );
                            })}
                            
                            <br /><br />
                            <h2>Which subject do you want to learn today?</h2>
                            <div className="list-group">
                                <button type="button" className="list-group-item list-group-item-action list-group-item-secondary" aria-current="true">
                                    Course content
                                </button>
                                {this.state.lectures && this.state.lectures.map(( lecture, index) => {
                                    return (
                                        <button type="button" className="list-group-item list-group-item-action" key={lecture.id} onClick={() => this.enterClassroom(lecture.id, this.state.language)}>
                                            <i className="fas fa-book" />&nbsp;{ lecture.title }
                                        </button>
                                        );
                                })}

                            </div>

                        </div>
                    </div>
                    <div className="row"> 
    
                    </div>
                    <ToastContainer position="bottom-right" autoClose="3000" />
                </div>
            </div>
        );
    }
}

export default VRLearningComponent;