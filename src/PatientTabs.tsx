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

export default function PatientTabs(props: any) {
  const [value, setValue] = useState(0);
  const [patientDetail, setPatientDetail] = useState<PatientDetail>({
    firstName: '', familyName: '', age: 0, sex: 'Unknown'
  });
  const { patients } = props;

  const handleChange = async (event: React.SyntheticEvent | null, newValue: number) => {
    const patient = patients.find((p: Patient, ind: number) => ind === newValue);
    const patientId = patient && patient.id;
    const cache = window.sessionStorage.getItem(`patient|${patientId}`);
    if (cache) {
      const patientDetailData: PatientDetail = JSON.parse(cache);
      if (patientDetailData) {
        setPatientDetail(patientDetailData);
        setValue(newValue);
      }
    } else {
      const sessionToken = window.sessionStorage.getItem('ft-session-token') || '';
      const res = await fetch(`/patient-details/${patientId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': sessionToken,
        },
      });
      const patientDetailData: PatientDetail = await res.json();
      if (patientDetailData) {
        window.sessionStorage.setItem(`patient|${patientId}`, JSON.stringify(patientDetailData));
        setPatientDetail(patientDetailData);
        setValue(newValue);
      }
    }
  };

  useEffect(() => {
    // init tabs to fetch 1st tab content
    if (patientDetail && !patientDetail.firstName && patients.length > 0) {
      handleChange(null, 0);
    }
  });


  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} className='tab-wrapper' centered aria-label="basic tabs example">
          {patients && patients.map((patient: Patient, ind: number) => {
            return (
              <Tab key={patient.id} className='tab-button' label={`${patient.name} (${patient.id})`} />
            )
          })}
        </Tabs>
      </Box>

      <TabPanel value={0} index={0}>
        {patientDetail && patientDetail.firstName &&
          <div className='name-container'>
            {patientDetail && <div className='full-name'>
              {patientDetail.title} {patientDetail.preferredName ? `${patientDetail.preferredName} (${patientDetail.firstName})` : patientDetail.firstName} {patientDetail.middleName} {patientDetail.familyName} {patientDetail.suffix}
            </div>
            }

            <div className='name-detail'>
              {patientDetail.title &&
                <div className='name-item'>
                  <span className="name-label">
                    Title:
                  </span>
                  <span className='name-content'>
                    {patientDetail.title}
                  </span>
                </div>
              }

              {patientDetail.firstName &&
                <div className='name-item'>
                  <span className="name-label">
                    First Name:
                  </span>
                  <span className='name-content'>
                    {patientDetail.firstName}
                  </span>
                </div>
              }

              {patientDetail.preferredName &&
                <div className='name-item'>
                  <span className="name-label">
                    Preferred Name:
                  </span>
                  <span className='name-content'>
                    {patientDetail.preferredName}
                  </span>
                </div>
              }

              {patientDetail.middleName &&
                <div className='name-item'>
                  <span className="name-label">
                    Middle Name:
                  </span>
                  <span className='name-content'>
                    {patientDetail.middleName}
                  </span>
                </div>
              }

              {patientDetail.familyName &&
                <div className='name-item'>
                  <span className="name-label">
                    Family Name:
                  </span>
                  <span className='name-content'>
                    {patientDetail.familyName}
                  </span>
                </div>
              }

              {patientDetail.suffix &&
                <div className='name-item'>
                  <span className="name-label">
                    Suffix:
                  </span>
                  <span className='name-content'>
                    {patientDetail.suffix}
                  </span>
                </div>
              }

              {patientDetail.age &&
                <div className='name-item'>
                  <span className="name-label">
                    Age:
                  </span>
                  <span className='name-content'>
                    {patientDetail.age}
                  </span>
                </div>
              }

              {patientDetail.sex &&
                <div className='name-item'>
                  <span className="name-label">
                    Sex:
                  </span>
                  <span className='name-content'>
                    {patientDetail.sex}
                  </span>
                </div>
              }
            </div>
          </div>
        }
      </TabPanel>

    </Box>
  );
}
