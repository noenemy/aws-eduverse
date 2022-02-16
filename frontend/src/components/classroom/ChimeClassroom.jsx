import React from 'react';
import { ThemeProvider } from 'styled-components';
import {
  MeetingProvider,
  lightTheme
} from 'amazon-chime-sdk-component-library-react';
import Meeting from './Meeting';
import MeetingForm from './MeetingForm';
import { useParams } from 'react-router';

const ChimeClassroom = (props) => {

	const { id } = useParams();

	return <React.Fragment>
		<ThemeProvider theme={lightTheme}>
			<MeetingProvider>
				<MeetingForm />
				<Meeting/>
			</MeetingProvider>
  	</ThemeProvider>
	</React.Fragment>
}

export default ChimeClassroom;