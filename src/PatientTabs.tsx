import React, { useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Patient, PatientList } from './types/PatientList.d';
import { PatientDetail } from './types/PatientDetail.d';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      // hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {true && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

// function a11yProps(index: number) {
//   return {
//     id: `simple-tab-${index}`,
//     'aria-controls': `simple-tabpanel-${index}`,
//   };
// }

export default function PatientTabs(props: any) {
  const [value, setValue] = useState(0);
  const [patientDetail, setPatientDetail] = useState<PatientDetail>({
    firstName: '', familyName: '', age: 0, sex: 'Unknown'
  });
  const { patients } = props;

  const handleChange = async (event: React.SyntheticEvent | null, newValue: number) => {
    const patient = patients.find((p: Patient, ind: number) => ind === newValue);
    const patientId = patient && patient.id;
    const sessionToken = window.sessionStorage.getItem('ft-session-token') || '';
    console.log('sessionToken', [sessionToken, newValue, patient, patients]);
    const res = await fetch(`/patient-details/${patientId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': sessionToken,
      },
      // body: JSON.stringify({a: 1, b: 'Textual content'})
    });
    const patientDetailData: PatientDetail = await res.json();
    console.log('patientDetailData', patientDetailData);
    setPatientDetail(patientDetailData);
    setValue(newValue);
  };

  useEffect(() => {
    // init tabs to fetch 1st tab content
    if (patientDetail && !patientDetail.firstName) {
      handleChange(null, 0);
    }
  });

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} centered aria-label="basic tabs example">
          {patients && patients.map((patient: Patient, ind: number) => {
            return (
              <Tab key={patient.id} label={patient.name} />
            )
          })}
        </Tabs>
      </Box>

      <TabPanel value={0} index={0}>
        {patientDetail && patientDetail.firstName &&
          <div>
            {patientDetail && patientDetail.preferredName && <div>
              {patientDetail.title} {patientDetail.preferredName} ({patientDetail.firstName}) {patientDetail.middleName} {patientDetail.familyName} {patientDetail.suffix}
            </div>
            }
            {patientDetail && !patientDetail.preferredName && <div>
              {patientDetail.title} {patientDetail.firstName} {patientDetail.middleName} {patientDetail.familyName} {patientDetail.suffix}
            </div>
            }
          </div>
        }
      </TabPanel>

    </Box>
  );
}
