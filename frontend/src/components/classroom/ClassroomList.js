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
                            <Card style={{ width: '18rem' }}>
                                <Card.Img variant="top" src="holder.js/100px180" />
                                <Card.Body>
                                    <Card.Title>강의실 #1</Card.Title>
                                    <Card.Text>
                                    Some quick example text to build on the card title and make up the bulk of
                                    the card's content.
                                    </Card.Text>
                                    <Button variant="primary" onClick={() => this.enterClassroom(1)}>Go somewhere</Button>
                                </Card.Body>
                            </Card>
                        </div>
                        <div class="col">
                        <Card style={{ width: '18rem' }}>
                                <Card.Img variant="top" src="holder.js/100px180" />
                                <Card.Body>
                                    <Card.Title>강의실 #2</Card.Title>
                                    <Card.Text>
                                    Some quick example text to build on the card title and make up the bulk of
                                    the card's content.
                                    </Card.Text>
                                    <Button variant="primary" onClick={() => this.enterClassroom(2)}>Go somewhere</Button>
                                </Card.Body>
                            </Card>
                        </div>
                        <div class="col">
                        <Card style={{ width: '18rem' }}>
                                <Card.Img variant="top" src="holder.js/100px180" />
                                <Card.Body>
                                    <Card.Title>강의실 #3</Card.Title>
                                    <Card.Text>
                                    Some quick example text to build on the card title and make up the bulk of
                                    the card's content.
                                    </Card.Text>
                                    <Button variant="primary" onClick={() => this.enterClassroom(3)}>Go somewhere</Button>
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