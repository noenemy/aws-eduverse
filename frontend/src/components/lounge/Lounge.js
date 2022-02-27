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

  // const tabContArr = [
  //   {
  //       tabTitle:(
  //         <li className={`nav-link ${activeIndex === 0 ? "active" : ""}`} onClick={()=>tabClickHandler(0)} key="0"> Rekognition Demo </li>
  //       ),
  //       tabCont:(
  //           <RekognitionDemo></RekognitionDemo>
  //       )
  //   },
  //   {
  //       tabTitle:(
  //         <li className={`nav-link ${activeIndex === 1 ? "active" : ""}`} onClick={()=>tabClickHandler(1)} key="1"> Textract Demo </li>
  //       ),
  //       tabCont:(
  //           <TextractDemo></TextractDemo>
  //       )
  //   },
  //   {
  //       tabTitle:(
  //         <li className={`nav-link ${activeIndex === 2 ? "active" : ""}`} onClick={()=>tabClickHandler(2)} key="2"> Polly Demo </li>
  //       ),
  //       tabCont:(
  //           <PollyDemo></PollyDemo>
  //       )
  //   },
  //   {
  //       tabTitle:(
  //         <li className={`nav-link ${activeIndex === 3 ? "active" : ""}`} onClick={()=>tabClickHandler(3)} key="3"> Transcribe Demo </li>
  //       ),
  //       tabCont:(
  //           <TranscribeDemo></TranscribeDemo>
  //       )
  //   },
  //   {
  //       tabTitle:(
  //         <li className={`nav-link ${activeIndex === 4 ? "active" : ""}`} onClick={()=>tabClickHandler(4)} key="4"> Sumerian Demo </li>
  //       ),
  //       tabCont:(
  //           <SumerianDemo></SumerianDemo>
  //       )
  //   }
  // ];

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

  // const tabClickHandler=(index)=>{
  //   setActiveIndex(index);
  // }

  const onChangeTab = detail => {
    setActiveId(detail.activeTabId)
  }

  return (
    <Fragment>
      <div className="container">
        {/* <ul className="nav nav-pills nav-fill">
          {tabContArr.map((section, index) => section.tabTitle)}
        </ul> */}

        <Tabs
          tabs={tabsContents}
          activeTabId={activeId}
          onChange={({detail})=> onChangeTab(detail)}
        />

        {/* <div>
          { tabContArr[activeIndex].tabCont }
        </div> */}
      </div>
    </Fragment>
  );
};

export default Lounge;