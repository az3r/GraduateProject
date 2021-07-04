import {
  Box,
  Breadcrumbs,
  Divider,
  makeStyles,
  Typography,
  Button,
  Avatar,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Link as MLink,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { removeMemberFromGroup } from '@libs/client/companies';
import Link from 'next/link';
import dateFormat from 'dateformat';

const useStyles = makeStyles({
  outlinedInput: {
    height: 30,
    margin: 20,
    width: 350,
    borderRadius: 16,
  },

  typeStyle: {
    margin: '20px',
  },
  linkStyle: {
    '&:hover': {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  },
  titleCol: {
    whiteSpace: 'nowrap',
    width: 550,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  avatar: {
    width: '90px',
    height: '90px',
  },
  spacing: {
    marginBottom: '30px',
  },
  centerPage: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  examineeTable: {
    width: '50%',
    border: '1px solid black',
    borderCollapse: 'collapse',
    textAlign: 'left',
    paddingTop: '5px',
    paddingBottom: '5px',
    paddingLeft: '5px',
    paddingRight: '5px',
  },
});

export default function DetailDevGroup({ user, developer, exams, isDev }) {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const router = useRouter();
  const classes = useStyles();
  const { id, idGroup : group, uid } = router.query;
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleAgree = async () => {
    await removeMemberFromGroup({
      developerId: uid,
      companyId: id,
      groupId: group,
    });
    setOpen(false);
    setOpen2(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClose2 = () => {
    setOpen2(false);
    router.replace(`/company-groups/${id}/groups/${group}`);
  };

  return (
    <Box m={3}>
      <Breadcrumbs>
        <Link href="/company-groups">
          <Typography className={classes.linkStyle}>Company groups</Typography>
        </Link>
        <Link href={!isDev ? `/company-groups/${id}` : "#"}>
          <Typography className={classes.linkStyle}>Current group</Typography>
        </Link>
        <Link href={`/company-groups/${id}/groups`}>
          <Typography className={classes.linkStyle}>Groups</Typography>
        </Link>
        <Link href={`/company-groups/${id}/groups/detail?idGroup=${group}`}>
          <Typography className={classes.linkStyle}>Detail group</Typography>
        </Link>
        <Typography color="textPrimary">Detail member</Typography>
      </Breadcrumbs>
      <br />
      <Divider />
      <br />
      <Box m={3}>
        <Avatar
          className={[classes.avatar, classes.centerPage, classes.spacing].join(
            ' '
          )}
          alt="Remy Sharp"
          src={developer.avatar}
        />
        <table
          className={[
            classes.examineeTable,
            classes.centerPage,
            classes.spacing,
          ].join(' ')}
        >
          <tr>
            <th className={classes.examineeTable}>Name:</th>
            <td className={classes.examineeTable}>
              <Typography>{developer.name}</Typography>
            </td>
          </tr>
          <tr>
            <th className={classes.examineeTable}>Email:</th>
            <td className={classes.examineeTable}>
              <Typography>{developer.email}</Typography>
            </td>
          </tr>
        </table>
      </Box>
      <Box m={3}>
        <Table
          className={classes.table}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bolder' }}>
                Examination
              </TableCell>
              <TableCell style={{ fontWeight: 'bolder' }}>Status</TableCell>
              <TableCell style={{ fontWeight: 'bolder' }}>Start</TableCell>
              <TableCell style={{ fontWeight: 'bolder' }}>End</TableCell>
              {!isDev ? (
                <TableCell style={{ fontWeight: 'bolder' }}>#</TableCell>
              ) : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {exams.map((item, index) => (
              <TableRow
                className={classes.tableRow}
                hover
                style={
                  index % 2
                    ? { background: 'rgb(250, 250, 250)' }
                    : { background: 'white' }
                }
              >
                <TableCell
                  component="th"
                  scope="row"
                  className={classes.linkStyle}
                >
                  <MLink target="_blank" href={isDev ? `/examination/${item.id}` : `/company-groups/${id}/examinations/detail?exam=${item.id}`}>
                    <div className={classes.titleCol}>{item.title}</div>
                  </MLink>
                </TableCell>
                <TableCell>
                  <Typography>
                    {item.submission ? 'Done' : 'Not submitted'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>
                    {item.startAt ? dateFormat(
                      new Date(item.startAt),
                      'HH:MM TT, dd-mmmm-yyyy'
                    ) : '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>
                    {item.endAt ? dateFormat(new Date(item.endAt), 'HH:MM TT, dd-mmmm-yyyy') : "-"}
                  </Typography>
                </TableCell>
                {!isDev ? (
                  <TableCell>
                    <MLink
                      href={`/company-groups/${id}/examinations/result?exam=${item.id}&uid=${developer.id}`}
                      target="_blank"
                    >
                      <Button color="secondary">Submission</Button>
                    </MLink>
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      {user.id === id ? (
        <Box m={5} display="flex" justifyContent="center">
          <Button
            onClick={handleClickOpen}
            variant="contained"
            style={{ color: 'red' }}
            startIcon={<DeleteIcon />}
          >
            Delete member
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogContent style={{ width: 500 }}>
              <Box>
                <Box display="flex" justifyContent="center" m={3}>
                  <ErrorOutlineIcon style={{ fontSize: 50, color: 'red' }} />
                </Box>
                <Typography style={{ textAlign: 'center' }}>
                  Do you want to delete this member?
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleAgree} color="primary" autoFocus>
                Agree
              </Button>
              <Button onClick={handleClose} color="secondary">
                Disagree
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={open2} onClose={handleClose2}>
            <DialogContent style={{ width: 500 }}>
              <Box>
                <Box display="flex" justifyContent="center" m={3}>
                  <CheckCircleOutlineIcon
                    style={{ fontSize: 50, color: '#088247' }}
                  />
                </Box>
                <Typography style={{ textAlign: 'center' }}>
                  Delete successfully
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose2} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      ) : null}
    </Box>
  );
}
