import React, { Component } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import ClassroomList from './ClassroomList';

function leaveClassroom() {
    window.location.href = '/classroom';
}

function Classroom() {
    const { classroomId } = useParams();

    return !classroomId ? ( 
        <div>
            <h2>Classroom</h2>
            Amazon Chime SDK를 이용해서 구현한 온라인 클래스기능입니다.
            <p></p>
            <ClassroomList />
            </div>
        ) : (
        <div>
            <h4>classroom { classroomId }</h4>
            <Button variant="primary" onClick={leaveClassroom}>Exit</Button>
        </div>   
    )
};

export default Classroom;