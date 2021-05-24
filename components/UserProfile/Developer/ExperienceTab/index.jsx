/* eslint-disable eqeqeq */
/* eslint-disable no-lone-blocks */
/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  Grid,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import WorkIcon from '@material-ui/icons/Work';
import SchoolIcon from '@material-ui/icons/School';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import { useAuth } from '@hooks/auth';
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import dateFormat from 'dateformat';
import Popup from '@components/UserProfile/Developer/ExperienceTab/Controls/Popup';
import ExperienceForm from '@components/UserProfile/Developer/ExperienceTab/Controls/ExperienceForm';
import * as devServices from '@libs/client/developers';

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: 'white',
  },
  paper: {
    padding: theme.spacing(1),
    color: 'theme.palette.text.secondary',
  },
  saveButton: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
  },
  divider: {
    border: '1px solid white',
    borderBottomColor: '#eeeeee',
  },
  textField: {
    width: 150,
  },
  leftButtonsInDiv: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));

// create a new array without filtered element
const without = (array, filtered) =>
  array.filter((element) => element != filtered);

export default function ExperienceTab(props) {
  const classes = useStyles();
  const { user, setUser, setSnackBarState, isOnlyWatch } = props;
  const [openPopup, setOpenPopup] = useState(false);
  const [openAlertDialog, setOpenAlertDialog] = React.useState(false);

  // user get from useAuth()
  const { user: auth } = useAuth();

  // check action for popup: add new exp or edit exp
  const [isAddNewExp, setIsAddNewExp] = useState(true);

  // experience can be edited in popup
  const [elementForEdit, setElementForEdit] = useState(null);

  // save index of elementForEdit
  const [elementForEditID, setElementForEditID] = useState(-1);

  // timeline elements
  const [timelineElements, setTimelineElements] = React.useState(
    user.experiences
  );

  useEffect(() => {
    setTimelineElements(user.experiences);
  }, [user.experiences]);

  const handleDeleteElement = (event) => {
    const index = event.currentTarget.value;
    const element = timelineElements[index];
    const filteredElements = without(timelineElements, element);
    setTimelineElements(filteredElements);
  };

  const handleEditElement = (id, editedExp) => {
    timelineElements[id] = editedExp;
    setOpenPopup(false);
  };

  const handleAddElement = (newExp) => {
    setTimelineElements([...timelineElements, newExp]);
    setOpenPopup(false);
  };

  const handleUpdateUser = async () => {
    setOpenAlertDialog(false);

    try {
      const newUser = { ...user, experiences: timelineElements };
      await devServices.update(auth.uid, newUser);
      setUser(newUser);

      setSnackBarState({
        open: true,
        severity: 'success',
        message: 'Update successfully!',
      });
    } catch (err) {
      console.log(err);
      setSnackBarState({
        open: true,
        severity: 'error',
        message: 'Internal server error',
      });
    }
  };

  // open popup to add new exp
  const openPopupToAddNew = () => {
    setElementForEdit(null);
    setOpenPopup(true);
    setIsAddNewExp(true);
    setElementForEditID(-1);
  };

  // open experience in popup to edit
  const openPopupToEdit = (event) => {
    const index = event.currentTarget.value;
    const element = timelineElements[index];
    setElementForEdit(element);
    setOpenPopup(true);
    setIsAddNewExp(false);
    setElementForEditID(index);
  };

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={10}>
              <Typography
                style={{
                  fontWeight: 'bolder',
                  fontSize: 20,
                }}
              >
                Experience Timeline
              </Typography>
            </Grid>
            <Grid item xs={12} sm={2}>
              {isOnlyWatch ? null : (
                <Button
                  className={classes.saveButton}
                  variant="contained"
                  color="primary"
                  startIcon={<SaveOutlinedIcon />}
                  onClick={() => setOpenAlertDialog(true)}
                >
                  Save Changes
                </Button>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.divider}>
          <VerticalTimeline>
            {timelineElements.map((element, index) => {
              const isWorkIcon = element.type === 'work';
              const format = 'dd/mmm/yyyy';
              const formattedBeginDate = dateFormat(element.beginDate, format);
              const formattedEndDate = dateFormat(element.endDate, format);
              const date = `${formattedBeginDate} - ${formattedEndDate}`;

              return (
                <VerticalTimelineElement
                  className="vertical-timeline-element--work"
                  contentStyle={{}}
                  contentArrowStyle={{
                    borderRight: '7px solid  rgb(33, 150, 243)',
                  }}
                  dateClassName="date"
                  date={date}
                  iconStyle={
                    isWorkIcon
                      ? { background: '#06D6A0' }
                      : { background: '#f9c74f' }
                  }
                  icon={isWorkIcon ? <WorkIcon /> : <SchoolIcon />}
                >
                  <div>
                    <h3 className="vertical-timeline-element-title">
                      {element.title}
                    </h3>
                    <h4 className="vertical-timeline-element-subtitle">
                      {element.company}
                    </h4>
                    <p>{element.description}</p>
                  </div>
                  {isOnlyWatch ? null : (
                    <div className={classes.leftButtonsInDiv}>
                      <IconButton
                        aria-label="delete"
                        value={index}
                        onClick={handleDeleteElement}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        aria-label="edit"
                        value={index}
                        onClick={openPopupToEdit}
                      >
                        <EditIcon />
                      </IconButton>
                    </div>
                  )}
                </VerticalTimelineElement>
              );
            })}

            {isOnlyWatch ? null : (
              <VerticalTimelineElement
                iconStyle={{ background: '#088247', color: '#fff' }}
                icon={<AddRoundedIcon />}
                iconOnClick={openPopupToAddNew}
                date="Add New Experience"
              />
            )}
          </VerticalTimeline>
        </Grid>
      </Grid>

      {/* Popup Dialog to add new Experience */}
      <Popup
        title="Experience"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <ExperienceForm
          handleAddElement={handleAddElement}
          handleEditElement={handleEditElement}
          isAddNewExp={isAddNewExp}
          elementForEdit={elementForEdit}
          elementForEditID={elementForEditID}
        />
      </Popup>

      {/* alert dialog to save user */}
      <Dialog
        open={openAlertDialog}
        onClose={() => setOpenAlertDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to save these changes?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAlertDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateUser} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
