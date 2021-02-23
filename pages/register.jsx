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
import * as React from 'react';
import {
  DeveloperRegister,
  SelectAccount,
  CompanyRegister,
} from '../components/Register';
import VerifyEmail from '../components/Register/VerifyEmail';

export default function Register() {
  const styles = useStyles();
  const [step, setStep] = React.useState(steps.length - 1);
  const accountTypeRef = React.useRef('developer');

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
          {steps.map(({ label }, index) => {
            return (
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
                      <Button
                        color="primary"
                        onClick={() => setStep(index - 1)}
                      >
                        Back
                      </Button>
                    )}
                  </StepContent>
                ) : null}
              </Step>
            );
          })}
        </Stepper>
        <Box className={styles.content}>
          <StepComponent index={step} />
        </Box>
      </Container>
    </>
  );

  function StepComponent({ index }) {
    switch (index) {
      case 1:
        return accountTypeRef.current === 'company' ? (
          <CompanyRegister onSubmitted={onSubmitted} />
        ) : (
          <DeveloperRegister onSubmitted={onSubmitted} />
        );
      case 2:
        return <VerifyEmail />;
      default:
        return <SelectAccount onSelected={onSelected} />;
    }

    function onSubmitted(form) {
      const data = new FormData(form);
      console.log(data.get('email'));
      setStep(step + 1);
    }

    function onSelected(type) {
      if (type === 'developer') {
        // do something for developer
      } else {
        // do something for company
      }
      accountTypeRef.current = type || 'developer';
      setStep(step + 1);
    }
  }
}

const steps = [
  { label: 'Select your account type', optional: false },
  { label: 'Create your new account', optional: false },
  { label: 'Verify your email', optional: true },
];
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
