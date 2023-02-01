import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import PatientTabs from './PatientTabs';
import PropTypes from 'prop-types';
import { Patient, PatientList } from './types/PatientList.d';
import { Clinician } from './types/Clinician.d';


const propTypes = {
  onSignOut: PropTypes.func.isRequired,
};

type Props = PropTypes.InferProps<typeof propTypes>;

export default function Dashboard(props: Props) {
  const [clinician, setClinician] = useState<Clinician>({ username: '', role: '', firstName: '', familyName: '' });
  const [patients, setPatients] = useState<PatientList>({ patients: [] });

  useEffect(() => {
    async function fetchMyAPI() {
      const sessionToken = window.sessionStorage.getItem('ft-session-token') || '';
      console.log('sessionToken', sessionToken);
      const res = await fetch('/clinician-details', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': sessionToken,
        },
        // body: JSON.stringify({a: 1, b: 'Textual content'})
      });
      const clinicianData: Clinician = await res.json();
      console.log('clinician', clinician);
      setClinician(clinicianData);
    }

    fetchMyAPI();

  }, [window.sessionStorage.getItem('ft-logged-in-user')]);


  useEffect(() => {
    async function fetchMyAPI() {
      const sessionToken = window.sessionStorage.getItem('ft-session-token') || '';
      console.log('sessionToken', sessionToken);
      const res = await fetch('/patients', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': sessionToken,
        },
        // body: JSON.stringify({a: 1, b: 'Textual content'})
      });
      const patientsData: PatientList = await res.json();
      console.log('patientsData', patientsData);
      setPatients(patientsData);
    }

    fetchMyAPI();

  }, [window.sessionStorage.getItem('ft-logged-in-user')]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {clinician && clinician.preferredName && <div>
            {clinician.title} {clinician.preferredName} ({clinician.firstName}) {clinician.middleName} {clinician.familyName} {clinician.suffix}
          </div>
          }
          {clinician && !clinician.preferredName && <div>
            {clinician.title} {clinician.firstName} {clinician.middleName} {clinician.familyName} {clinician.suffix}
          </div>
          }
        </Typography>
        <Button onClick={props.onSignOut}>
          Logout
        </Button>
      </Box>
      <PatientTabs patients={patients.patients} />
    </Container>
  );
}
