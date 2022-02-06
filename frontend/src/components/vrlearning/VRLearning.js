import React, { Component, Fragment } from 'react';
import { Button } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import LoadScreen from '../../assets/images/load_screen.png'

class VRLearningComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: [{
                id: "1",
                language: "ko-KR",
                icon: "asia",
                course_title: "한국어"
            },
            {
                id: "2",
                language: "es-ES",
                icon: "europe",
                course_title: "Spanish"
            }],
            lectures: [{
                id: "1",
                lecture_title: "1강. 인사말을 배워봅시다."
            }, 
            {
                id: "2",
                lecture_title: "2강. 드라마로 배우는 한국어 표현"
            }]
        };
    }

    render() {
        return (
            <div>
                <h2>VRLearning</h2>
                Amazon AI/ML 서비스 및 Sumerian을 이용해서 구현한 셀프스터디 서비스입니다.
                <div className="container">
                    <div className="row">
                        <br /><br />
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <img className="img-fluid" src={LoadScreen} alt="loadscreen" width="500" height="400"></img>
                        </div>
                        <div className="col-6">
                            <br /><br />
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
                                        <Button className="ml-2" key={course.id} onClick={() => this.selectCourse(course.id, course.language)}><i className={ "fas fa-globe-" + course.icon } />&nbsp;{ course.course_title }</Button>
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
                                            <i className="fas fa-book" />&nbsp;{ lecture.lecture_title }
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