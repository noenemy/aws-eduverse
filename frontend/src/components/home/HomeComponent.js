import React, { Component } from 'react';
import Lobby from './lobby';

class HomeComponent extends Component {
    render() {
        return (
            <div>
                Welcome to AWS Eduverse
                <Lobby />
            </div>
        );
    }
}

export default HomeComponent;