import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import ProTip from './ProTip';
import SignIn from './SignIn';
import Copyright from './Copyright';
import Dashboard from './Dashboard';

import { PatientList } from './types/PatientList.d';

import fetchMock from 'fetch-mock';
import initFetchMock from './initFetchMock';
initFetchMock(fetchMock);

async function ft() {
  const res = await fetch('/login', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + window.btoa('joshs' + ":" + 'joshs_pw'),
    },
    // body: JSON.stringify({a: 1, b: 'Textual content'})
  });
  const { sessionToken } = await res.json();
  console.log('lllog', sessionToken)

  const res2 = await fetch('/patients', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': sessionToken,
    },
    // body: JSON.stringify({a: 1, b: 'Textual content'})
  });
  const patients: PatientList = await res2.json();
  console.log('patients', patients);
}


export default function App() {
  ft();

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Clinical Portal
        </Typography>
        <SignIn />
        <Dashboard />
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  );
}
