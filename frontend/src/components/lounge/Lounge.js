import React, { Fragment, useEffect, useState } from 'react';
import PollyDemo from './PollyDemo';
import RekognitionDemo from './RekognitionDemo';
import TextractDemo from './TextractDemo';
import TranscribeDemo from './TranscribeDemo';
import SumerianDemo from './SumerianDemo';
import { Tabs } from '@awsui/components-react';
import { useLocation } from 'react-router-dom';

const Lounge = props => {

  const [activeId, setActiveId] = useState(0);

  const location = useLocation();

  useEffect(()=>{
    const path = location.pathname.split("/");
    console.log(path)
    if(path.length >= 3 )
      setActiveId(path[2])
  }, []);

  const tabsContents = [
    {
      label: "Rekognition Demo",
      id: "0",
      content: <RekognitionDemo></RekognitionDemo>
    },
    {
      label: "Textract Demo",
      id: "1",
      content: <TextractDemo></TextractDemo>
    },
    {
      label: "Polly Demo",
      id: "2",
      content: <PollyDemo></PollyDemo>
    },
    {
      label: "Transcribe Demo",
      id: "3",
      content: <TranscribeDemo></TranscribeDemo>
    },
    {
      label: "Sumerian Demo",
      id: "4",
      content: <SumerianDemo></SumerianDemo>
    },
  ]

  const onChangeTab = detail => {
    setActiveId(detail.activeTabId)
  }

  return (
    <Fragment>
      <div className="container">

        <Tabs
          tabs={tabsContents}
          activeTabId={activeId}
          onChange={({detail})=> onChangeTab(detail)}
        />

      </div>
    </Fragment>
  );
};

export default Lounge;