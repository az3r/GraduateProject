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
              {step > 0 && (
                <StepContent>
                  {index > 0 && index < steps.length - 1 && (
                    <Button color="primary" onClick={() => setStep(index - 1)}>
                      Back
                    </Button>
                  )}
                </StepContent>
              )}
            </Step>
          ))}
        </Stepper>
        <Box className={styles.content}>
          <StepComponent />
        </Box>
      </Container>
    </>
  );

  function StepComponent() {
    switch (step) {
      case 0:
        return <SelectAccountStep />;
      case 1:
        return <RegisterStep />;
      case 2:
        return <VerifyAccountStep />;
      default:
        throw new Error(`received step ${step} out of ${steps.length} steps`);
    }
  }

  function RegisterStep() {
    function onRegistered(account) {
      dataRef.current.account = account;
      setStep(step + 1);
    }
    return dataRef.current.accountType === 'developer' ? (
      <DeveloperRegister onRegistered={onRegistered} />
    ) : (
      <CompanyRegister onRegistered={onRegistered} />
    );
  }

  function SelectAccountStep() {
    return (
      <SelectAccount
        onSelected={(accountType) => {
          dataRef.current.accountType = accountType;
          setStep(step + 1);
        }}
      />
    );
  }

  function VerifyAccountStep() {
    function onVerified() {}
    const { email } = dataRef.current.account;
    return <VerifyEmail email={email} onVerified={onVerified} />;
  }
}

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
