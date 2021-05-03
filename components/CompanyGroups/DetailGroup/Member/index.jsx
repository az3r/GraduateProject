import { getMembers } from '@libs/client/companies';
import {
  Avatar,
  Badge,
  Box,
  Breadcrumbs,
  Button,
  Divider,
  makeStyles,
  OutlinedInput,
  Typography,
} from '@material-ui/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import React, { useEffect, useState } from 'react';

const useStyles = makeStyles((theme) => ({
  outlinedInput: {
    height: 30,
    margin: 20,
    width: 350,
    borderRadius: 16,
  },
  addBtn: {
    float: 'right',
    marginBottom: '10px',
  },
  itemsContainer: {
    clear: 'right',
  },
  createdDate: {
    color: 'black',
  },
  typeStyle: {
    margin: '20px',
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
}));

export default function GroupMember({ company }) {
  console.log(company);
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
          Company groups
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
        <Link href={`/company-groups/${id}/members/add`}>
          <Button color="secondary" variant="contained">
            Add question
          </Button>
        </Link>
      </Box>

      <Box m={3} display="flex" justifyContent="center">
        <Badge badgeContent="Admin group" color="primary">
          <Card className={classes.root}>
            <CardActionArea>
              <CardContent style={{ wordWrap: 'break-word' }}>
                <Avatar
                  alt="Remy Sharp"
                  src={company.avatar}
                  className={classes.avt}
                />
                <Typography gutterBottom variant="h5" component="h2">
                  {company.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {company.email}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" color="primary">
                Share
              </Button>
              <Button size="small" color="primary">
                Learn More
              </Button>
            </CardActions>
          </Card>
        </Badge>
      </Box>

      <Box display="flex">
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
              <Button size="small" color="primary">
                Share
              </Button>
              <Button size="small" color="primary">
                Learn More
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
