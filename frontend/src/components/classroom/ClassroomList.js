import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify';
import { listClassrooms } from '../../graphql/queries';
import ReactLoading from 'react-loading';

const ClassroomList = (props) => {

    const [ classrooms, setClassroom ] = useState([]);
    const [ showModal, setShowModal ] = useState(false);
    const [ loading, setLoading ] = useState(true);
    const navigate = useNavigate();

    useEffect(async () => {
        const result = await API.graphql(graphqlOperation(listClassrooms));
        console.log(result);
        setLoading(false);
        setClassroom(result.data.listClassrooms.items);
    }, []);

    const handleClose = () => {
        setShowModal(false);
    }

    const createClassroom = () => {
        setShowModal(true);
    }

    const enterClassroom = (classroomId) => {
        navigate(`/classroom/${classroomId}`);
    }

    return (
        <div>
            <h2>Classroom</h2>
            Amazon Chime SDK를 이용해서 구현한 온라인 클래스기능입니다.
            <p></p>

            <div className="container">
                <div className="row">
                    <div className="col">
                        <Button variant="primary" onClick={createClassroom}>+ Create a Classroom</Button>
                        <p></p>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <h4>Which classroom would you like to enter?</h4>
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
                            <Card.Img variant="top" src="/assets/images/dummy_180x100.png" />
                            <Card.Body>
                                <Card.Title>{item.title}</Card.Title>
                                <Card.Text>{item.description}</Card.Text>
                                <Button variant="primary" onClick={() => enterClassroom(item.id)}>Go somewhere</Button>
                            </Card.Body>
                        </Card>
                        </div>
                    );
                })}
                </div>
            </div>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Create a Classroom</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you're creating a class here!</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleClose}>
                    Create
                </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
}

export default ClassroomList;