import React, { Component } from 'react'

export class Navbar extends Component {
    static defaultProps = {
        title: 'Hello There',
        icon: 'fas fa-chalkboard-teacher'
    };

    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="/">
                            &nbsp;&nbsp;&nbsp;
                            <i className={this.props.icon} /> &nbsp;&nbsp;{this.props.title}
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </a>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    
                        <div className="collapse navbar-collapse" id="navbarResponsive">
                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item">
                                    <a className="nav-link" href="/home">Home</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/auditorium">Auditorium</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/classroom">Classroom</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/vrlearning">VR Learning</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/lounge">Lounge</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/about">About</a>
                                </li>
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" id="dropdown09" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="flag-icon flag-icon-kr"> </span> 한국어</a>
                                    <div className="dropdown-menu" aria-labelledby="dropdown09">
                                        <a className="dropdown-item" href="#fr"><span class="flag-icon flag-icon-us"> </span>  English</a>
                                        <a className="dropdown-item" href="#it"><span class="flag-icon flag-icon-es"> </span>  Spanish</a>
                                        <a className="dropdown-item" href="#ru"><span class="flag-icon flag-icon-cn"> </span>  Chinese</a>
                                        <a className="dropdown-item" href="#ru"><span class="flag-icon flag-icon-jp"> </span>  Japanese</a>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        )
    }
}

export default Navbar
