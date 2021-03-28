import { Button } from '@material-ui/core';
import emailjs from 'emailjs-com';
import React from 'react';

export default function InvitationTab()
{
    const sendInivation = () => {
        emailjs.send(
            'service_6zw4uj8', 
            'template_nm4zffi', 
            {
                to_name: "Tuan",
                examiner_name: "Examiner",
                exam_id: "id test",
                exam_password: "123",
                send_to: "nguyenthanhtung990818@gmail.com",
            }, 
            'user_vdAvQzs8a2nH9TdfDiLcK')
    }

    return (
        <Button onClick={sendInivation} color="secondary" variant="contained">Send Invitation</Button>
    );
}