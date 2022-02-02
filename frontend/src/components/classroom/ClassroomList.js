import React, { Component } from 'react';
import { Card, Button } from 'react-bootstrap';

class ClassroomList extends Component {
    constructor(props, context) {
        super(props, context);
    }

    createClassroom() {
        alert('create');
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
                        <div className="col">
                            <Card style={{ width: '14rem' }}>
                                <Card.Img variant="top" src="/assets/images/dummy_180x100.png" />
                                <Card.Body>
                                    <Card.Title>강의실 #1 (데모용)</Card.Title>
                                    <Card.Text>
                                    Some quick example text to build.
                                    </Card.Text>
                                    <Button variant="primary" onClick={() => this.enterClassroom(1)}>Go somewhere</Button>
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="col">
                        <Card style={{ width: '14rem' }}>
                                <Card.Img variant="top" src="/assets/images/dummy_180x100.png" />
                                <Card.Body>
                                    <Card.Title>AWS 101</Card.Title>
                                    <Card.Text>
                                    Some quick example text to build.
                                    </Card.Text>
                                    <Button variant="primary" onClick={() => this.enterClassroom(2)}>Go somewhere</Button>
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="col">
                            <Card style={{ width: '14rem' }}>
                                <Card.Img variant="top" src="/assets/images/dummy_180x100.png" />
                                <Card.Body>
                                    <Card.Title>메타버스란 무엇인가</Card.Title>
                                    <Card.Text>
                                    Some quick example text to build.
                                    </Card.Text>
                                    <Button variant="primary" onClick={() => this.enterClassroom(3)}>Go somewhere</Button>
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="col">
                            <Card style={{ width: '14rem' }}>
                                <Card.Img variant="top" src="/assets/images/dummy_180x100.png" />
                                <Card.Body>
                                    <Card.Title>AWS 워크샵</Card.Title>
                                    <Card.Text>
                                    Some quick example text to build.
                                    </Card.Text>
                                    <Button variant="primary" onClick={() => this.enterClassroom(4)}>Go somewhere</Button>
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="col">
                            <Card style={{ width: '14rem' }}>
                                <Card.Img variant="top" src="/assets/images/dummy_180x100.png" />
                                <Card.Body>
                                    <Card.Title>AWS AI/ML 기본</Card.Title>
                                    <Card.Text>
                                    Some quick example text to build.
                                    </Card.Text>
                                    <Button variant="primary" onClick={() => this.enterClassroom(5)}>Go somewhere</Button>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ClassroomList;