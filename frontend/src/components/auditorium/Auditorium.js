import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';
import Chat from '../home/Chat';
import { API, graphqlOperation } from 'aws-amplify';
import { getAuditorium } from '../../graphql/queries';
import ScrollToTop from '../home/ScrollToTop';

function Auditorium() {
    const { id } = useParams();
    const [ title, setTitle ] = useState("");
    const [ url, setUrl ] = useState("");
    const [ auditorium, setAuditorium ] = useState();
    const navigate = useNavigate();

    useEffect(async () => {
        if (id) {
            const result = await API.graphql(graphqlOperation(getAuditorium, {id}));
            setTitle(result.data.getAuditorium.title);
            setUrl(result.data.getAuditorium.url);
            console.log("@getAuditorium > " + url);
        }
    }, []);

    return (
        <ScrollToTop>
            <div className="row vh-100">
                <div className="col-sm-9">
                    <div>
                        
                        <p className="h3">
                            <a href="#" onClick={() => navigate(-1)}><i className="fa fa-angle-left px-4"></i></a>
                            { title }
                        </p>
                    </div>
                    { url && 
                        <VideoPlayer url={ url } />
                    }  
                    
                </div>
                <div className="col-sm-3 vh-100">
                    <Chat title={id} />
                </div>
            </div>
        </ScrollToTop>
    );
}

export default Auditorium;