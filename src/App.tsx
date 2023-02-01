import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import ProTip from './ProTip';

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
      'Authorization': 'Basic '+ window.btoa('joshs' + ":" + 'joshs_pw'),
    },
    // body: JSON.stringify({a: 1, b: 'Textual content'})
  });
  const {sessionToken} = await res.json();
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

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}.
    </Typography>
  );
}

export default function App() {
  ft();

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create React App example with TypeScript
        </Typography>
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  );
}
