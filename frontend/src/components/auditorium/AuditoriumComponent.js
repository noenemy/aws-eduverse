import React, { Component } from 'react';
import AuditoriumList from './AuditoriumList';

class AuditoriumComponent extends Component {
    render() {
        return (
            <div>
                <h2>Auditorium</h2>
                Amazon IVS를 이용해서 라이브스트리밍을 구현한 대강당 기능입니다.
                <p></p>
                <AuditoriumList />
            </div>
        );
    }
}

export default AuditoriumComponent;