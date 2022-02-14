import React, { Component } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import ClassroomList from './ClassroomList';
import Chat from '../chat/Chat'

function Classroom() {
    const { classroomId } = useParams();
    const navigate = useNavigate();

    return !classroomId ? ( 
        <div>
            <h2>Classroom</h2>
            Amazon Chime SDK를 이용해서 구현한 온라인 클래스기능입니다.
            <p></p>
            <ClassroomList />
            </div>
        ) : (
        <div>
            <div className="row">
                <div className="col-sm-9">
                    <h4>classroom { classroomId }</h4>
                    <Button variant="primary" onClick={() => navigate(-1)}>Exit</Button>
                </div>
                <div className="col-sm-3">
                    <Chat />
                </div>
            </div>

        </div>   
    )
};

export default Classroom;