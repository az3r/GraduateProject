import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React from 'react';

const SnackBarContext = React.createContext({
  snackbar: {
    open: false,
    severity: '',
    message: '',
  },
  toggle: () => {},
});

export default function SnackBarProvider({ children }) {
  const [snackbar, toggle] = React.useState({
    open: false,
    severity: '',
    message: '',
  });
  return (
    <SnackBarContext.Provider value={{ snackbar, toggle }}>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => toggle({ open: false })}
      >
        <Alert variant="filled" severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      {children}
    </SnackBarContext.Provider>
  );
}

export function useSnackBar() {
  return React.useContext(SnackBarContext);
}
