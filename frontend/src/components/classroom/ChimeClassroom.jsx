import React from 'react';
import { ThemeProvider } from 'styled-components';
import {
  MeetingProvider,
  lightTheme
} from 'amazon-chime-sdk-component-library-react';
import Meeting from './Meeting';
import Chat from './Chat'
import Attendee from './Attendee'
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';

const ChimeClassroom = (props) => {

	const { id } = useParams();
	const navigate = useNavigate();

	return (
    <div>
      <div className="row">
        <React.Fragment>
          <ThemeProvider theme={lightTheme}>
            <MeetingProvider>
              <div className="col-sm-9">
                <h4>
                  classroom {id}
                  {/* <Button variant="primary" onClick={() => navigate(-1)}>Exit</Button> */}
                </h4>
                <Meeting />
              </div>
              <div className="col-sm-3">
                <Attendee />

                <Chat
                // chatChannel={this.state.chatChannel}
                // title={this.state.title}
                // owner={this.state.owner}
                />
              </div>
            </MeetingProvider>
          </ThemeProvider>
        </React.Fragment>
      </div>
    </div>
  );
}

export default ChimeClassroom;