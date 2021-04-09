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
import {
  DeveloperRegister,
  SelectAccount,
  CompanyRegister,
} from '@components/Register';
import VerifyEmail from '@components/Register/VerifyEmail';

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
    <Container className={styles.root}>
      <Head>
        <title>Register</title>
        <meta property="og-title" content="Register" />
      </Head>
      <Stepper activeStep={step} title="Register account">
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
      <Box flexGrow="1">
        <StepComponent />
      </Box>
    </Container>
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
    return <VerifyEmail user={dataRef.current.account} />;
  }
}

const useStyles = makeStyles(() => ({
  root: {
    height: '80vh',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
  },
}));
