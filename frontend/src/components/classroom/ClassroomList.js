import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify';
import { searchClassrooms } from '../../graphql/queries';
import { createClassroom, deleteClassroom } from '../../graphql/mutations';
import ReactLoading from 'react-loading';
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/user/userState';

const ClassroomList = (props) => {

    const [ classrooms, setClassroom ] = useState([]);
    const [ showCreateModal, setShowCreateModal ] = useState(false);
    const [ loading, setLoading ] = useState(true);
    const navigate = useNavigate();
    const user = useRecoilValue(userState);

    useEffect(() => {
        listClassrooms();
    }, []);

    const listClassrooms = async () => {
        const result = await API.graphql(graphqlOperation(searchClassrooms, {
            sort: { direction: 'asc', field: 'order' }
        }));
        console.log(result);
        setLoading(false);
        setClassroom(result.data.searchClassrooms.items);
    }

    const closeCreateDialog = () => {
        setShowCreateModal(false);
    }

    const openCreateDialog = () => {
        setShowCreateModal(true);
    }

    const addClassroom = async (e) => {
        e.preventDefault();
        const newItem = {
            title: e.target.formTextTitle.value,
            description: e.target.formTextDescription.value,
            image: e.target.formSelectImage.value,
            order: 99    
        }

        const result = await API.graphql(graphqlOperation(createClassroom, {
            input: newItem
        }));
        console.log("@addClassroom > " + result);

        if (result && result.data && result.data.createClassroom) {
            let newClassroomList = classrooms;
            newClassroomList.push(result.data.createClassroom);
            setClassroom(newClassroomList);
        }
        closeCreateDialog();
    }

    const removeClassroom = async (classroomId) => {

        if (window.confirm("Do you really want to delete the classroom?")) {

            const result = await API.graphql(graphqlOperation(deleteClassroom, {
                input: { id : classroomId }
            }));
            console.log("@removeClassroom > " + result.data);

            if (result && result.data && result.data.deleteClassroom) {
                let newClassroomList = classrooms.filter(item => item.id !== result.data.deleteClassroom.id);
                setClassroom(newClassroomList);
            }
        }
    }

    const enterClassroom = (classroomId) => {
        navigate(`/classroom/${classroomId}`);
    }

    return (
        <div className="vh-100">
            <div className="container-fluid h-100">
                <div className="row h-100">
                    <div className="col col-1" style={{ backgroundColor: "#90BE6D" }}>&nbsp;</div>
                    <div className="col col-mr-auto">

                    <h2>강의실 (Classroom)</h2>
                    Amazon Chime SDK를 이용해서 구현한 온라인 클래스 서비스입니다.

                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <Button variant="secondary" onClick={openCreateDialog}>+ 강의실 만들기</Button>
                                <p>&nbsp;</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <h4>강의실 목록</h4>
                            </div>
                        </div>

                        <div className="row">
                        { loading &&
                            <ReactLoading type="spin" color="#123abc" /> 
                        }

                        {classrooms.map((item, index) => {
                            return (

                                <div className="col" key={index}>
                                <Card style={{ width: '14rem' }}>
                                    <Card.Img variant="top" src={`/assets/images/${item.image}`} />
                                    <Card.Body>
                                        <Card.Title>{item.title}</Card.Title>
                                        <Card.Text>{item.description}</Card.Text>
                                        <Button variant="secondary" onClick={() => enterClassroom(item.id)}>강의실 입장</Button>
                                        &nbsp;
                                        <a href="#" class="text-info mx-1" onClick={() => removeClassroom(item.id)}>X</a>
                                    </Card.Body>
                                </Card>
                                </div>
                            );
                        })}
                        </div>
                    </div>

                    <Modal show={showCreateModal} onHide={closeCreateDialog} onSubmit={addClassroom}>
                        <Modal.Header closeButton>
                        <Modal.Title>Create a Classroom</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group as={Row} className="mb-3" controlId="formTextTitle">
                                    <Form.Label column sm="4">
                                    Title
                                    </Form.Label>
                                    <Col sm="8">
                                    <Form.Control type="text" placeholder="" />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-3" controlId="formTextDescription">
                                    <Form.Label column sm="4">
                                    Description
                                    </Form.Label>
                                    <Col sm="8">
                                    <Form.Control type="text" placeholder="" />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-3" controlId="formSelectImage">
                                    <Form.Label column sm="4">
                                    Card Image
                                    </Form.Label>
                                    <Col sm="8">
                                    <Form.Select aria-label="Default select example">
                                        <option value="laptop_180x100.png">Laptop</option>
                                        <option value="servers_180x100.png">Servers</option>
                                        <option value="robot_180x100.png">Robot</option>
                                        <option value="metaverse_180x100.png">Metaverse</option>
                                        <option value="workshop_180x100.png">Workshop</option>
                                    </Form.Select>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>&nbsp;</Form.Group>
                                <Button variant="secondary" onClick={closeCreateDialog}>Cancel</Button>
                                &nbsp;
                                <Button type="submit" variant="primary">Submit</Button>
                            </Form>
                        </Modal.Body>
                    </Modal>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default ClassroomList;