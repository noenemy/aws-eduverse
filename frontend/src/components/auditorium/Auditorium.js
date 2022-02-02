import React, { useState, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import AuditoriumList from './AuditoriumList';
import * as _IVSPlayer from 'amazon-ivs-player';
import IVSPlayer from './IVSPlayer';

function leaveAuditorium() {
    window.location.href = '/auditorium';
}

function Auditorium() {
    const { auditoriumId } = useParams();

    const [qualities, setQualities] = useState([]);
    const [url] = useState("https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8");
  
    const player = useMemo(() => _IVSPlayer.create({
      wasmWorker: "https://player.live-video.net/1.2.0/amazon-ivs-wasmworker.min.js",
      wasmBinary: "https://player.live-video.net/1.2.0/amazon-ivs-wasmworker.min.wasm",
    }),[]);

    const onReady = useCallback(() => {
        const qualities = player.getQualities()

        if (qualities[0].name !== "unknown") {
            player.setAutoQualityMode(false)
            setQualities(player.getQualities())

            return
        }
        
    }, [player, setQualities]);

    return !auditoriumId ? ( 
        <div>
            <h2>Auditorium</h2>
            Amazon IVS를 이용해서 라이브스트리밍을 구현한 대강당 기능입니다.
            <p></p>
            <AuditoriumList />
            </div>
        ) : (
        <div>
            <h4>auditorium { auditoriumId }</h4>

            <button onClick={() => console.log(player.getQuality())}>Get my quality now</button>

            {qualities.map((quality, key) => (
                <button key={`quality-${key}`} onClick={() => player.setQuality(quality, false)} >{quality.name}</button>
            ))}

            <IVSPlayer 
                player={player}
                width="100%"
                height="100%"
                controls={true}
                url={url}
                playing={true}
                onReady={onReady}
            />
            <Button variant="primary" onClick={leaveAuditorium}>Exit</Button>
        </div>   
    )
};

export default Auditorium;