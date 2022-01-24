import React, { Component } from 'react';
import { Card, Button } from 'react-bootstrap';

class LoungeList extends Component {
    constructor(props, context) {
        super(props, context);
    }

    enterLounge(loungeId) {
        window.location.href = `/lounge/${loungeId}`;
    }

    render() {
        return (
            <div>
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <h4>Which game would you like to play?</h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <Card style={{ width: '18rem' }}>
                                <Card.Img variant="top" src="/assets/images/dummy_180x100.png" />
                                <Card.Body>
                                    <Card.Title>Flash Card Game</Card.Title>
                                    <Card.Text>
                                    Some quick example text to build on the card title and make up the bulk of
                                    the card's content.
                                    </Card.Text>
                                    <Button variant="primary" onClick={() => this.enterLounge(1)}>Go somewhere</Button>
                                </Card.Body>
                            </Card>
                        </div>
                        <div class="col">
                        <Card style={{ width: '18rem' }}>
                                <Card.Img variant="top" src="/assets/images/dummy_180x100.png" />
                                <Card.Body>
                                    <Card.Title>Tetris</Card.Title>
                                    <Card.Text>
                                    Some quick example text to build on the card title and make up the bulk of
                                    the card's content.
                                    </Card.Text>
                                    <Button variant="primary" onClick={() => this.enterLounge(2)}>Go somewhere</Button>
                                </Card.Body>
                            </Card>
                        </div>
                        <div class="col">
                        <Card style={{ width: '18rem' }}>
                                <Card.Img variant="top" src="/assets/images/dummy_180x100.png" />
                                <Card.Body>
                                    <Card.Title>Speech Test</Card.Title>
                                    <Card.Text>
                                    Some quick example text to build on the card title and make up the bulk of
                                    the card's content.
                                    </Card.Text>
                                    <Button variant="primary" onClick={() => this.enterLounge(3)}>Go somewhere</Button>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LoungeList;