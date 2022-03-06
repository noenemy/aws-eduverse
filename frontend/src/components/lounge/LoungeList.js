import React, { Component, useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/user/userState';

const LoungeList = props => {

    const navigate = useNavigate();
    const user = useRecoilValue(userState);

    const [lounges, setLounges] = useState([
        {
            id: 0,
            title: "Rekognition",
            image: "rekognition-card.png",
            description: "Some quick example text to build."
        }, {
            id: 1,
            title: "Textract",
            image: "textract-card.png",
            description: "Some quick example text to build."
        }, {
            id: 2,
                title: "Polly",
            image: "polly-card.png",
            description: "Some quick example text to build."
        }, {
            id: 3,
            title: "Transcribe",
            image: "transcribe-card.png",
            description: "Some quick example text to build."
        }, {
            id: 4,
            title: "Sumerian",
            image: "sumerian-card.png",
            description: "Some quick example text to build."
        }
    ]);

    const enterLounge = (id) => {
        navigate(`/lounge/${id}`)
    }
    

    return (
        <div className="vh-100">
            <div className="container-fluid h-100">
                <div className="row h-100">
                    <div className="col col-1" style={{ backgroundColor: "#F9C74F" }}>&nbsp;</div>
                    <div className="col col-mr-auto">

                    <h2>Lounge</h2>
                    Amazon 서비스를 이용해서 구현된 각종 게임입니다.
                    <p>&nbsp;</p>
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <h4>Which game would you like to play?</h4>
                            </div>
                        </div>

                        <div className="row">
                        {lounges.map((item, index) => {
                        return (

                            <div className="col" key={index}>
                            <Card style={{ width: '14rem' }}>
                                <Card.Img variant="top" src={`/assets/images/${item.image}`} />
                                <Card.Body>
                                    <Card.Title>{item.title}</Card.Title>
                                    <Card.Text>{item.description}</Card.Text>
                                    <Button variant="primary" onClick={() => enterLounge(item.id)}>Go somewhere</Button>
                                </Card.Body>
                            </Card>
                            </div>
                            );
                        })}
                        </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoungeList;