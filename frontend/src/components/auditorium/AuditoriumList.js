import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Modal } from 'react-bootstrap';

const AuditoriumList = (props) => {

    const [ auditoriums, setAuditorium] = useState([{
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
    ]);
    const [ showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const createAuditorium = () => {
        setShowModal(true);
    }

    const handleClose = () => {
        setShowModal(false);
    }

    const enterAuditorium = (auditoriumId) => {
        navigate(`/auditorium/${auditoriumId}`);
    }

    const { id, title, url } = props;

    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="col">
                        <Button variant="primary" onClick={createAuditorium}>+ Create an Auditorium</Button>
                        <p></p>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <h4>Which auditorium would you like to enter?</h4>
                    </div>
                </div>
                <div className="row">

                    {auditoriums.map((item, index) => {
                        return (
                            <div className="col" key={index}>
                            <Card style={{ width: '18rem' }}>
                                <Card.Img variant="top" src={'/assets/images/'+ item.image} />
                                <Card.Body>
                                    <Card.Title>{item.title}</Card.Title>
                                    <Card.Text>{item.description}</Card.Text>
                                    <Button variant="primary" onClick={() => enterAuditorium(item.id)}>Go somewhere</Button>
                                </Card.Body>
                            </Card>
                        </div>
                        );
                    })}

                </div>
            </div>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Create an Auditorium</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you're creating an auditorium here!</Modal.Body>
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

export default AuditoriumList;