import React, { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { getClassroom } from '../../graphql/queries';
import { ThemeProvider } from 'styled-components';
import {
  MeetingProvider,
  VoiceFocusProvider,
  BackgroundBlurProvider,
  lightTheme
} from 'amazon-chime-sdk-component-library-react';
import Meeting from './Meeting';
import Chat from './Chat'
import Attendee from './Attendee'
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';

const ChimeClassroom = (props) => {

	const { id } = useParams();
  const [ title, setTitle ] = useState();
	const navigate = useNavigate();

  useEffect(async () => {
    if (id) {
        const result = await API.graphql(graphqlOperation(getClassroom, {id}));
        setTitle(result.data.getClassroom.title);
    }
    }, []);

	return (
    <div>
      <div className="row">
        <React.Fragment>
          <ThemeProvider theme={lightTheme}>
          <BackgroundBlurProvider>            
            <MeetingProvider>
              <div className="col-sm-9">
                <div>
                    <p className="h3">
                        <a href="#" onClick={() => navigate(-1)}><i className="fa fa-angle-left px-4"></i></a>
                        { title }
                    </p>
                  </div>
                <Meeting title={id}/>
              </div>
              <div className="col-sm-3">
                <Attendee />
                <Chat title={id}/>
              </div>
            </MeetingProvider>
            </BackgroundBlurProvider>
          </ThemeProvider>
        </React.Fragment>
      </div>
    </div>
  );
}

export default ChimeClassroom;