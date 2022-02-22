import React, { Component } from 'react';
import { Card, Button } from 'react-bootstrap';

class LoungeList extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            lounges: [
                {
                    id: 1,
                    title: "Rekognition",
                    image: "dummy_180x100.png",
                    description: "Some quick example text to build."
                }, {
                    id: 2,
                    title: "Textract",
                    image: "dummy_180x100.png",
                    description: "Some quick example text to build."
                }, {
                    id: 3,
                        title: "Polly",
                    image: "dummy_180x100.png",
                    description: "Some quick example text to build."
                }, {
                    id: 4,
                    title: "Transcribe",
                    image: "dummy_180x100.png",
                    description: "Some quick example text to build."
                }, {
                    id: 5,
                    title: "Sumerian",
                    image: "dummy_180x100.png",
                    description: "Some quick example text to build."
                }
            ]
        }
    }

    enterLounge(id) {
        window.location.href = `/lounge/${id}`;
    }

    render() {
        return (
            <div>
                <h2>Lounge</h2>
                Amazon 서비스를 이용해서 구현된 각종 게임입니다.
                <p></p>
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <h4>Which game would you like to play?</h4>
                        </div>
                    </div>

                    <div className="row">
                    {this.state.lounges.map((item, index) => {
                    return (

                        <div className="col" key={index}>
                        <Card style={{ width: '14rem' }}>
                            <Card.Img variant="top" src={`/assets/images/${item.image}`} />
                            <Card.Body>
                                <Card.Title>{item.title}</Card.Title>
                                <Card.Text>{item.description}</Card.Text>
                                <Button variant="primary" onClick={() => this.enterLounge(item.id)}>Go somewhere</Button>
                            </Card.Body>
                        </Card>
                        </div>
                        );
                    })}
                    </div>
                    
                </div>
            </div>
        );
    }
}

export default LoungeList;