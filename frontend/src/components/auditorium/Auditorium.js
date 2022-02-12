import React, { useState, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import AuditoriumList from './AuditoriumList';
import VideoPlayer from './VideoPlayer';
import Chat from '../chat/Chat';

function leaveAuditorium() {
    window.location.href = '/auditorium';
}

function Auditorium() {
    const { auditoriumId } = useParams();

    return !auditoriumId ? ( 
        <div>
            <h2>Auditorium</h2>
            Amazon IVS를 이용해서 라이브스트리밍을 구현한 대강당 기능입니다.
            <p></p>
            <AuditoriumList />
            </div>
        ) : (

        <div className="row">
            <div className="col-sm-9">
                <h4>auditorium { auditoriumId }</h4>
                <VideoPlayer />
                <Button variant="primary" onClick={leaveAuditorium}>Exit</Button> 
            </div>
            <div className="col-sm-3">
                <Chat />
            </div>
        </div>
    )
};

export default Auditorium;