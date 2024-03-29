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
                    <div className="col col-1" style={{ backgroundColor: "#4D908E" }}>&nbsp;</div>
                    <div className="col col-mr-auto">

                    <h2>라운지 (Lounge)</h2>
                    다양한 Amazon AI/ML 서비스를 체험 할 수 있는 라운지 공간입니다.
                    <p>&nbsp;</p>
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <h4>어떤 AI/ML 서비스를 체험하시겠습니까?</h4>
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
                                    <Button variant="secondary" onClick={() => enterLounge(item.id)}>체험하기</Button>
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