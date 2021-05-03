import { Box, Breadcrumbs, Divider, Typography } from '@material-ui/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import React, { useState } from 'react';
import ParticipantsTab from './ParticipantsTab';
import DetailTab from './DetailTab';

export default function DetailQuestion({ user, problemProp }) {
  const [value, setValue] = useState(0);

  const router = useRouter();
  const { id } = router.query;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box m={3}>
      <Breadcrumbs>
        <Link href="/company-groups">Company groups</Link>
        <Link href={`/company-groups/${id}`}>Current group</Link>
        <Link href={`/company-groups/${id}/questions-bank`}>
          Questions bank
        </Link>
        <Typography color="textPrimary">Detail</Typography>
      </Breadcrumbs>
      <Divider />
      <br />
      {problemProp.isMCQ ? (
        <DetailTab user={user} problemProp={problemProp} />
      ) : (
        <>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Detail" />
            <Tab label="Participants" /> 
          </Tabs>
          <TabPanel value={value} index={0}>
            <DetailTab user={user} problemProp={problemProp} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <ParticipantsTab problemProp={problemProp} />
          </TabPanel>
        </>
      )}
    </Box>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
