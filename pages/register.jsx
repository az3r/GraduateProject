import * as React from 'react';
import {
  Box,
  Button,
  Container,
  makeStyles,
  Step,
  StepContent,
  StepLabel,
  Stepper,
} from '@material-ui/core';
import Head from 'next/head';
import PropTypes from 'prop-types';
import {
  DeveloperRegister,
  SelectAccount,
  CompanyRegister,
} from '../components/Register';
import VerifyEmail from '../components/Register/VerifyEmail';

const steps = [
  { label: 'Select your account type', optional: false },
  { label: 'Create your new account', optional: false },
  { label: 'Verify your email', optional: true },
];

export default function Register() {
  const styles = useStyles();
  const [step, setStep] = React.useState(0);
  const dataRef = React.useRef({});

  return (
    <>
      <Head>
        <title>Register</title>
        <meta property="og-title" content="Register" />
      </Head>
      <Container className={styles.root}>
        <Stepper
          activeStep={step}
          className={styles.header}
          title="Register account"
        >
          {steps.map(({ label }, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              {step > 0 ? (
                <StepContent>
                  {index === steps.length - 1 ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setStep(index - 1)}
                    >
                      Skip
                    </Button>
                  ) : (
                    <Button color="primary" onClick={() => setStep(index - 1)}>
                      Back
                    </Button>
                  )}
                </StepContent>
              ) : null}
            </Step>
          ))}
        </Stepper>
        <Box className={styles.content}>
          <StepBody
            step={step}
            data={dataRef.current}
            onCompleted={parseData}
          />
        </Box>
      </Container>
    </>
  );

  function parseData({ account, email }) {
    setStep(step + 1);
  }
}

function StepBody({ step, data, cache, onCompleted }) {
  switch (step) {
    case 1: {
      const account = data.account || 'developer';
      return account === 'developer' ? (
        <CompanyRegister
          cache={(form) => {
            console.log(form);
            cache();
          }}
        />
      ) : (
        <DeveloperRegister
          cache={(form) => {
            console.log(form);
          }}
        />
      );
    }
    case 2:
      return <VerifyEmail email={data.email} />;
    default:
      return (
        <SelectAccount onSelected={(account) => onCompleted({ account })} />
      );
  }
}

StepBody.propTypes = {
  step: PropTypes.number.isRequired,
  cache: PropTypes.func.isRequired,
  onCompleted: PropTypes.func.isRequired,
  data: PropTypes.shape({
    account: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flex: 1,
  },
  content: {
    flex: 10,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));
