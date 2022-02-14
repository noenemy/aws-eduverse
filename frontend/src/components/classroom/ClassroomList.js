import React, { Component } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';

class ClassroomList extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {showModal: false,
            classrooms: [{
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
            ]
        };
    }

    handleClose = () => {
        this.setState({ showModal: false });
    }

    createClassroom = () => {
        this.setState({ showModal: true });
    }

    enterClassroom(classroomId) {
        window.location.href = `/classroom/${classroomId}`;
    }

    render() {
        return (
            <div>
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <Button variant="primary" onClick={this.createClassroom}>+ Create a Classroom</Button>
                            <p></p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <h4>Which classroom would you like to enter?</h4>
                        </div>
                    </div>
                    <div className="row">
                    {this.state.classrooms.map((item, index) => {
                        return (

                            <div className="col" key={index}>
                            <Card style={{ width: '14rem' }}>
                                <Card.Img variant="top" src="/assets/images/dummy_180x100.png" />
                                <Card.Body>
                                    <Card.Title>{item.title}</Card.Title>
                                    <Card.Text>{item.description}</Card.Text>
                                    <Button variant="primary" onClick={() => this.enterAuditorium(item.id)}>Go somewhere</Button>
                                </Card.Body>
                            </Card>
                            </div>
                        );
                    })}
                    </div>
                </div>

                <Modal show={this.state.showModal} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Create a Classroom</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Woohoo, you're creating a class here!</Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.handleClose}>
                        Create
                    </Button>
                    </Modal.Footer>
                </Modal>

            </div>
        );
    }
}

export default ClassroomList;