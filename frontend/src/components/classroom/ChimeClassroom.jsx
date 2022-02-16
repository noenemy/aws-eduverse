import React from 'react';
import { ThemeProvider } from 'styled-components';
import {
  MeetingProvider,
  lightTheme
} from 'amazon-chime-sdk-component-library-react';
import Meeting from './Meeting';
import MeetingForm from './MeetingForm';
import { useParams } from 'react-router';
import ClassroomList from './ClassroomList';

const ChimeClassroom = (props) => {

	const { classroomId } = useParams();

	if(!classroomId) {
		return ( 
			<div>
					<h2>Classroom</h2>
					Amazon Chime SDK를 이용해서 구현한 온라인 클래스기능입니다.
					<p></p>
					<ClassroomList />
					</div>
			)
	}

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