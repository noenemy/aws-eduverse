import React from 'react';
import {
  useRosterState,
  Roster,
  RosterGroup,
  RosterAttendee,
  RosterCell,
  RosterHeader,
} from 'amazon-chime-sdk-component-library-react';


const Attendee = () => {
  const { roster } = useRosterState();

  const attendees = Object.values(roster);

  const attendeeItems = attendees.map(attendee => {
    const { chimeAttendeeId, externalUserId } = attendee;
    console.log(attendee);
    return (
      // <RosterAttendee key={chimeAttendeeId} attendeeId={externalUserId} name={externalUserId}/>
      <RosterCell key={chimeAttendeeId} attendeeId={externalUserId} name={externalUserId}/>
    );
  });

  return (
    <Roster css="height: 20rem; width: 100%">
      <RosterHeader
        title="Present"
        badge={attendees.length}
      />
      <RosterGroup >{attendeeItems}
      </RosterGroup>
    </Roster>
  );
};

export default Attendee;