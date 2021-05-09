import { getMembers } from '@libs/client/companies';
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Divider,
  IconButton,
  makeStyles,
  OutlinedInput,
  Tooltip,
  Typography,
} from '@material-ui/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import HelpIcon from '@material-ui/icons/Help';
import LinkIcon from '@material-ui/icons/Link';
import React, { useEffect, useState } from 'react';

const useStyles = makeStyles((theme) => ({
  outlinedInput: {
    height: 30,
    margin: 20,
    width: 350,
    borderRadius: 16,
  },
  root: {
    width: 200,
    marginRight: 20,
  },
  avt: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 20,
  },
  linkStyle: {
    '&:hover': {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  },
}));

export default function GroupMember({ user, company }) {
  const [members, setMembers] = useState([]);
  const classes = useStyles();
  const router = useRouter();
  const { id } = router.query;

  useEffect(async () => {
    const mems = await getMembers(company);
    setMembers(mems);
  }, []);

  return (
    <Box m={3}>
      <Breadcrumbs>
        <Link color="inherit" href="/company-groups">
          <Typography className={classes.linkStyle}>Company groups</Typography>
        </Link>
        <Typography color="textPrimary">Current group</Typography>

        <Typography color="textPrimary">Group members</Typography>
      </Breadcrumbs>
      <Divider />

      <Box m={3} p={2} display="flex" justifyContent="center">
        <OutlinedInput
          className={classes.outlinedInput}
          placeholder="Search..."
        />
      </Box>
      <Box m={3} display="flex" justifyContent="flex-end">
        <Tooltip title="Only admin can add members.">
          <IconButton aria-label="delete">
            <HelpIcon />
          </IconButton>
        </Tooltip>
        <Link href={`/company-groups/${id}/members/add`}>
          <Button
            color="secondary"
            variant="contained"
            disabled={user.role !== 'company'}
          >
            Add member
          </Button>
        </Link>
      </Box>
      <Box display="flex" flexWrap="wrap">
        <Card className={classes.root}>
          <CardActionArea>
            <CardContent style={{ wordWrap: 'break-word' }}>
              <Avatar
                alt="Remy Sharp"
                src={company.avatar}
                className={classes.avt}
              />
              <Chip style={{marginBottom: 10}} label="Admin" variant="outlined" size="small" />
              <Typography gutterBottom variant="h5" component="h2">
                {company.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {company.email}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
          <Button size="small" color="primary" variant="outlined">
                Contributions
              </Button>
              <IconButton color="secondary" aria-label="add an alarm">
                <LinkIcon />
              </IconButton>
          </CardActions>
        </Card>
        {members.map((item) => (
          <Card className={classes.root}>
            <CardActionArea>
              <CardContent style={{ wordWrap: 'break-word' }}>
                <Avatar
                  alt="Remy Sharp"
                  src={item.avatar}
                  className={classes.avt}
                />
                <Typography gutterBottom variant="h5" component="h2">
                  {item.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {item.email}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" color="primary" variant="outlined">
                Contributions
              </Button>
              <IconButton color="secondary" aria-label="add an alarm">
                <LinkIcon />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
