import React, { Component } from 'react';
import LoungeList from './LoungeList';

class Lounge extends Component {
    render() {
        return (
            <div>
                <h2>Lounge</h2>
                Amazon 서비스를 이용해서 구현된 각종 게임입니다.
                <p></p>
                <LoungeList />
            </div>
        );
    }
}

export default Lounge;