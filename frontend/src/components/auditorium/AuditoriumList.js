import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Modal } from 'react-bootstrap';
import { API, graphqlOperation } from 'aws-amplify';
import { searchAuditoriums } from '../../graphql/queries';
import ReactLoading from 'react-loading';
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/user/userState';

const AuditoriumList = (props) => {

    const [ auditoriums, setAuditorium] = useState([]);
    const [ showModal, setShowModal] = useState(false);
    const [ loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = useRecoilValue(userState);
    
    useEffect( () => {
        listAuditoriums();
    }, []);

    const listAuditoriums = async () => {
        const result = await API.graphql(graphqlOperation(searchAuditoriums, {
            sort: { direction: 'asc', field: 'order' }
        }));
        console.log(result);
        setLoading(false);
        setAuditorium(result.data.searchAuditoriums.items);
    }

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
            <h2>Auditorium</h2>
            Amazon IVS를 이용해서 라이브스트리밍을 구현한 대강당 기능입니다.
            <p></p>

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

                    { loading &&
                        <ReactLoading type="spin" color="#123abc" /> 
                    }

                    {auditoriums.map((item, index) => {
                        return (
                            <div className="col" key={index}>
                            <Card style={{ width: '18rem' }}>
                                <Card.Img variant="top" src={`/assets/images/${item.image}`} />
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