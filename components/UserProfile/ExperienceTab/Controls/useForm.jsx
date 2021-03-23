/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiFormControl-root': {
      width: '90%',
      margin: theme.spacing(1),
      // padding: 5,
    },
  },
}));

export function useForm(initialFValues) {
  const [values, setValues] = React.useState(initialFValues);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  return {
    values,
    setValues,
    handleInputChange,
  };
}

export function Form(props) {
  const classes = useStyles();

  return <form className={classes.root}>{props.children}</form>;
}
