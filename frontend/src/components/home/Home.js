import React, { Component } from 'react';
import Lobby from './lobby';

class Home extends Component {
    render() {
        return (
            <div>
                Welcome to AWS Eduverse
                <Lobby />
            </div>
        );
    }
}

export default Home;