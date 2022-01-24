import React, { Component } from 'react';
import ClassroomList from './ClassroomList';

class ClassroomComponent extends Component {
    render() {
        return (
            <div>
                <h2>Classroom</h2>
                Amazon Chime SDK를 이용해서 구현한 온라인 클래스기능입니다.
                <p></p>
                <ClassroomList />
            </div>
        );
    }
}

export default ClassroomComponent;