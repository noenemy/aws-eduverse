import React, { useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ClassroomList = (props) => {

    const [classrooms, setClassroom] = useState([{
            id: 1,
            title: "강의실 #1 (데모용)",
            image: "dummy_180x100.png",
            description: "Some quick example text to build."
        }, {
            id: 2,
            title: "AWS 101",
            image: "dummy_180x100.png",
            description: "Some quick example text to build."
        }, {
            id: 3,
            title: "메타버스란 무엇인가",
            image: "dummy_180x100.png",
            description: "Some quick example text to build."
        }, {
            id: 4,
            title: "AWS 워크샵",
            image: "dummy_180x100.png",
            description: "Some quick example text to build."
        }, {
            id: 5,
            title: "AWS AI/ML 기본",
            image: "dummy_180x100.png",
            description: "Some quick example text to build."
        }
    ]);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

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