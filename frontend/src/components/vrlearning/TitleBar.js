import React from 'react';
import { useNavigate } from 'react-router-dom';

const TitleBar = (props) => {
    const navigate = useNavigate();

    return (
        <div className="row">
            <div className="col-3">
                <i className="fas fa-book" />
                <a href="#" onClick={() => navigate(-1)}>VR Learning</a>
                /&nbsp;&nbsp;
                {props.className}
            </div>
            <div className="col-9">
                <h3>{props.lectureTitle}</h3>
            </div>
        </div>
    );
}

export default TitleBar;