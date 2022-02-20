import React from 'react';
import { ThemeProvider } from 'styled-components';
import {
  MeetingProvider,
  lightTheme
} from 'amazon-chime-sdk-component-library-react';
import Meeting from './Meeting';
import Chat from './Chat'
import { useParams } from 'react-router';

const ChimeClassroom = (props) => {

	const { id } = useParams();

	return <React.Fragment>
		<ThemeProvider theme={lightTheme}>
		<Chat
                    // chatChannel={this.state.chatChannel} 
                    // title={this.state.title} 
                    // owner={this.state.owner}
                    />
			<MeetingProvider>
				<Meeting/>
			</MeetingProvider>
			
  	</ThemeProvider>
	</React.Fragment>
}

export default ChimeClassroom;