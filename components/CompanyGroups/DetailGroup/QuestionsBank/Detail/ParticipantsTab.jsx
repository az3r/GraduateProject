// import { getParticipants } from '@libs/client/problems';
import React, { useEffect } from 'react';


export default function ParticipantsTab({problemProp}) {
  // const [participants, setParticipants] = useState([]);
  
  useEffect(async ()=>{
   // const joiners = await getParticipants()
   console.log(problemProp);
  }, []);
  return (
    <h1>haha</h1>
  );
}

