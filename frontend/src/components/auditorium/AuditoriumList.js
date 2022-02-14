import React, { Component } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';

class AuditoriumList extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {showModal: false,
            auditoriums: [{
                    id: 1,
                    title: "대강당 #1 (데모용)",
                    image: "dummy_180x100.png",
                    description: "Some quick example text to build on the card title and make up the bulk of the card's content.",
                    url: ""
                }, {
                    id: 2,
                    title: "대강당 #2 (Live)",
                    image: "dummy_180x100.png",
                    description: "Some quick example text to build on the card title and make up the bulk of the card's content.",
                    url: ""
                }, {
                    id: 3,
                    title: "대강당 #3 (Live)",
                    image: "dummy_180x100.png",
                    description: "Some quick example text to build on the card title and make up the bulk of the card's content.",
                    url: ""
                } 
            ]
        };
    }

    createAuditorium = () => {
        this.setState({ showModal: true });
    }

    handleClose = () => {
        this.setState({ showModal: false });
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

                        {this.state.auditoriums.map((item, index) => {
                            return (
                                <div className="col" key={index}>
                                <Card style={{ width: '18rem' }}>
                                    <Card.Img variant="top" src={'/assets/images/'+ item.image} />
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
                    <Modal.Title>Create an Auditorium</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Woohoo, you're creating an auditorium here!</Modal.Body>
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

export default AuditoriumList;