import {
  Box,
  Breadcrumbs,
  Divider,
  makeStyles,
  Typography,
  Link as MLink,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
} from '@material-ui/core';
import Link from 'next/link';
import LinkIcon from '@material-ui/icons/Link';
import React, { useEffect, useState } from 'react';
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import ContactSupportOutlinedIcon from '@material-ui/icons/ContactSupportOutlined';
import { getExams, getProblems } from '@libs/client/companies';
import clsx from 'clsx';

const useStyles = makeStyles({
  linkStyle: {
    '&:hover': {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  },
  cardRoot: {
    display: 'flex',
    width: 300,
    marginTop: 10,
    marginRight: 10,
  },
  icon: {
    fontSize: 50,
  },
  card1: {
    backgroundColor: '#088247',
    color: 'white',
  },
  card2: {
    backgroundColor: '#1B9BF9',
    color: 'white',
  },
  card3: {
    backgroundColor: '#FF1A2A',
    color: 'white',
  },
});

export default function GroupGeneral({ company }) {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState(0);
  const [exams, setExams] = useState(0);

  useEffect(async () => {
    console.log(company);
    const props = await getProblems(company.id);
    const exas = await getExams(company.id);

    setQuestions(props?.length || 0);
    setExams(exas?.length || 0);
    setLoading(false);
  }, []);

  return (
    <Box m={3}>
      <Breadcrumbs>
        <Link color="inherit" href="/company-groups">
          <Typography className={classes.linkStyle}>Company groups</Typography>
        </Link>
        <Typography color="textPrimary">Current group</Typography>

        <Typography color="textPrimary">General</Typography>
      </Breadcrumbs>
      <br />
      <Divider />
      <br />
      <Box m={3}>
        <Box m={1} display="flex" justifyContent="center">
          <Typography variant="h4">{company.name}</Typography>
          <MLink target="_blank" href={`/profile/co/${company.id}`}>
            <LinkIcon style={{ color: 'black' }} />
          </MLink>
        </Box>
        <Box m={1} display="flex" justifyContent="center">
          <MLink target="_blank" href={company.website}>
            <Typography>Go to company website</Typography>
          </MLink>
        </Box>
        <Typography variant="h4">Dashboard</Typography>
        <Divider />
        {loading ? (
          <Box m={3} display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <Box display="flex" flexWrap="wrap">
            <Card className={clsx(classes.cardRoot, classes.card1)}>
              <CardHeader
                avatar={<PeopleAltOutlinedIcon className={classes.icon} />}
              />
              <CardContent>
                <Typography variant="h4">{company.members?.length || 0}</Typography>
                <Typography variant="h6">Members</Typography>
              </CardContent>
            </Card>
            <Card className={clsx(classes.cardRoot, classes.card2)}>
              <CardHeader
                avatar={<ContactSupportOutlinedIcon className={classes.icon} />}
              />
              <CardContent>
                <Typography variant="h4">{questions}</Typography>
                <Typography variant="h6">Questions</Typography>
              </CardContent>
            </Card>
            <Card className={clsx(classes.cardRoot, classes.card3)}>
              <CardHeader
                avatar={<AssignmentOutlinedIcon className={classes.icon} />}
              />
              <CardContent>
                <Typography variant="h4">{exams}</Typography>
                <Typography variant="h6">Examinations</Typography>
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>
    </Box>
  );
}
