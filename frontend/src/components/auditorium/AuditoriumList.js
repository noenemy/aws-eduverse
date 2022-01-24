import React, { Component } from 'react';
import { Card, Button } from 'react-bootstrap';

class AuditoriumList extends Component {
    constructor(props, context) {
        super(props, context);
    }

    createAuditorium() {
        alert('create');
    }

    enterAuditorium(auditoriumId) {
        window.location.href = `/auditorium/${auditoriumId}`;
    }

    render() {
        return (
            <div>
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <Button variant="primary" onClick={this.createAuditorium}>+ Create an Auditorium</Button>
                            <p></p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <h4>Which auditorium would you like to enter?</h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <Card style={{ width: '18rem' }}>
                                <Card.Img variant="top" src="/assets/images/dummy_180x100.png" />
                                <Card.Body>
                                    <Card.Title>대강당 #1</Card.Title>
                                    <Card.Text>
                                    Some quick example text to build on the card title and make up the bulk of
                                    the card's content.
                                    </Card.Text>
                                    <Button variant="primary" onClick={() => this.enterAuditorium(1)}>Go somewhere</Button>
                                </Card.Body>
                            </Card>
                        </div>
                        <div class="col">
                        <Card style={{ width: '18rem' }}>
                                <Card.Img variant="top" src="/assets/images/dummy_180x100.png" />
                                <Card.Body>
                                    <Card.Title>대강당 #2</Card.Title>
                                    <Card.Text>
                                    Some quick example text to build on the card title and make up the bulk of
                                    the card's content.
                                    </Card.Text>
                                    <Button variant="primary" onClick={() => this.enterAuditorium(2)}>Go somewhere</Button>
                                </Card.Body>
                            </Card>
                        </div>
                        <div class="col">
                        <Card style={{ width: '18rem' }}>
                                <Card.Img variant="top" src="/assets/images/dummy_180x100.png" />
                                <Card.Body>
                                    <Card.Title>대강당 #3</Card.Title>
                                    <Card.Text>
                                    Some quick example text to build on the card title and make up the bulk of
                                    the card's content.
                                    </Card.Text>
                                    <Button variant="primary" onClick={() => this.enterAuditorium(3)}>Go somewhere</Button>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AuditoriumList;