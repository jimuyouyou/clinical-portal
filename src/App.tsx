import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import ProTip from './ProTip';
import SignIn from './SignIn';
import Copyright from './Copyright';
import Dashboard from './Dashboard';

import { PatientList } from './types/PatientList.d';

import fetchMock from 'fetch-mock';
import initFetchMock from './initFetchMock';
initFetchMock(fetchMock);

export default function App() {
  const [refresh, setRefresh] = useState(false);
  const handleSignIn = () => {
    setRefresh(!refresh);
  };

  const handleSignOut = () => {
    window.sessionStorage.removeItem('ft-session-token');
    window.sessionStorage.removeItem('ft-logged-in-user');

    Object.keys(window.sessionStorage).forEach((key) => {
      if (key.startsWith('patient|')) window.sessionStorage.removeItem(key);
    });

    setRefresh(!refresh);
  };

  const isLoggedIn = window.sessionStorage.getItem('ft-session-token') && window.sessionStorage.getItem('ft-logged-in-user');

  return (
    <Container maxWidth="lg">

      {isLoggedIn &&
        <Button onClick={handleSignOut} sx={{
          marginTop: -6,
          float: 'right',
        }}>
          Logout
        </Button>
      }
      <Box sx={{ my: 4 }}>

        {!isLoggedIn && <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Clinical Portal
          </Typography>
        </Box>
        }

        {!isLoggedIn && <SignIn onSignIn={handleSignIn} />}

        {isLoggedIn && <Dashboard />}

        {/* <ProTip /> */}
        <Copyright />
      </Box>
    </Container>
  );
}
