import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import PatientTabs from './PatientTabs';
import PropTypes from 'prop-types';
import { Patient, PatientList } from './types/PatientList.d';
import { Clinician } from './types/Clinician.d';


// const propTypes = {
//   onSignOut: PropTypes.func.isRequired,
// };

// type Props = PropTypes.InferProps<typeof propTypes>;

export default function Dashboard() {
  const [clinician, setClinician] = useState<Clinician>({ username: '', role: '', firstName: '', familyName: '' });
  const [patients, setPatients] = useState<PatientList>({ patients: [] });

  useEffect(() => {
    async function fetchMyAPI() {
      const sessionToken = window.sessionStorage.getItem('ft-session-token') || '';
      const res = await fetch('/clinician-details', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': sessionToken,
        },
      });
      const clinicianData: Clinician = await res.json();
      setClinician(clinicianData);
    }

    fetchMyAPI();

  }, [window.sessionStorage.getItem('ft-logged-in-user')]);


  useEffect(() => {
    async function fetchMyAPI() {
      const sessionToken = window.sessionStorage.getItem('ft-session-token') || '';
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
      setPatients(patientsData);
    }

    fetchMyAPI();

  }, [window.sessionStorage.getItem('ft-logged-in-user')]);

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            // marginTop: 8,
            // display: 'flex',
            // flexDirection: 'column',
            // alignItems: 'center',
          }}
        >
          <Typography variant="h5" component="h1" gutterBottom>
            Clinical Portal
          </Typography>
        </Box>

        <Box sx={{
          //  my: 4
        }}>
          <Typography variant="subtitle1" component="h1" gutterBottom>
            {clinician &&
              <div>
                {clinician.title} {clinician.preferredName ? `${clinician.preferredName} (${clinician.firstName})` : clinician.firstName} {clinician.middleName} {clinician.familyName} {clinician.suffix}
              </div>
            }
          </Typography>
        </Box>
      </Box>
      <PatientTabs patients={patients.patients} />
    </Container>
  );
}
