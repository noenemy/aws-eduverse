import React, { Fragment, useState, useEffect } from 'react';
import { Button } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import LoadScreen from '../../assets/images/load_screen.png'
import { API, graphqlOperation } from 'aws-amplify';
import { searchCourses, searchLectures } from '../../graphql/queries';
import { useNavigate } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/user/userState';

const VRLearning = (props) => {

    const [ selectedCourseId, setSelectedCourseId ] = useState("ef717ea27fc4426b99e484343a493e5a"); // Korean 101
    const [ courses, setCourses ] = useState();
    const [ language, setLanguage ] = useState('ko-KR');
    const [ lectures, setLectures ] = useState();
    const [ courseLoading, setCourseLoading ] = useState(false);
    const [ lectureLoading, setLectureLoading ] = useState(false);
    const user = useRecoilValue(userState);
    
    const navigate = useNavigate();

    useEffect(() => {
        getCourses();
        getLectures(selectedCourseId);
    }, []);

    const selectCourse = (courseId, language) => {
       setSelectedCourseId(courseId);
       setLanguage(language);
       getLectures(courseId);
    }

    const getCourses = async () => {
        setCourses(null);
        setCourseLoading(true);

        const res = await API.graphql(graphqlOperation(searchCourses, {
            sort: { direction: 'asc', field: 'order' }
        }));
        setCourseLoading(false);

        if (res != null && res.data.searchCourses != null) {
            setCourses(res.data.searchCourses.items);
        }
        else {
            toast.error("something wrong! try again.");
        }
    }

    const getLectures = async (courseId="ef717ea27fc4426b99e484343a493e5a") => {
        setLectures(null);
        setLectureLoading(true);
        
        const res = await API.graphql(graphqlOperation(searchLectures, {
            filter: { course_ref: { eq: courseId } },
            sort: { direction: 'asc', field: 'order' }
        })); 
        setLectureLoading(false);

        if (res != null && res.data.searchLectures != null) {
            setLectures(res.data.searchLectures.items);
        }
        else {
            toast.error("something wrong! try again.");
        }
    }

    const enterClassroom = (lectureId, language) => {
        navigate(`/vrlearning/classroom?courseId=${selectedCourseId}&lectureId=${lectureId}&language=${language}`);
    }

    return (

        <div className="vh-100">
            <div className="container-fluid h-100">
                <div className="row h-100">
                    <div className="col col-1" style={{ backgroundColor: "#43AA8D" }}>&nbsp;</div>
                    <div className="col col-mr-auto">
                                    
                        <h2>VRLearning</h2>
                        Amazon AI/ML 서비스 및 Sumerian을 이용해서 구현한 셀프스터디 서비스입니다.
                        <div className="container">
                            <div className="row">
                                <div className="col-5">
                                    <img className="img-fluid" src={LoadScreen} alt="loadscreen" width="460"></img>
                                </div>
                                <div className="col-7">
                                    <h2>
                                        <i className="fas fa-quote-left" />&nbsp;
                                        Hi, we are your language tutors.
                                    </h2>
                                    <h2>Learning a language is fun. </h2>
                                    <h2>We will help you. <i className="fas fa-quote-right" />&nbsp;
                                    </h2>
                                    <br />
                                    <h2>Which language do you want to learn?</h2>
                                    { courseLoading &&
                                        <ReactLoading type="spin" color="#123abc" size="sm" /> 
                                    }
                                    { courses && courses.map(( course, index) => {
                                        return (
                                            <Fragment key={course.id}>
                                            <Button className="ml-2" onClick={() => selectCourse(course.id, course.language)}><i className={ "fas fa-globe-" + course.icon } />&nbsp;{ course.title }</Button>
                                            &nbsp;&nbsp;</Fragment>
                                            );
                                    })}
                                    
                                    <br /><br />
                                    <h2>Which subject do you want to learn today?</h2>
                                    <div className="list-group">
                                        <button type="button" className="list-group-item list-group-item-action list-group-item-secondary" aria-current="true">
                                            Course content
                                        </button>
                                        { lectureLoading &&
                                            <ReactLoading type="spin" color="#123abc" /> 
                                        }
                                        { lectures && lectures.map(( lecture, index) => {
                                            return (
                                                <button type="button" className="list-group-item list-group-item-action" key={lecture.id} onClick={() => enterClassroom(lecture.id, language)}>
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
                </div>
            </div>
        </div>
    );
}

export default VRLearning;