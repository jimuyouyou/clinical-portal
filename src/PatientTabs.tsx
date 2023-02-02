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

const imgLinks = [
  'https://img.freepik.com/free-vector/infographic-element-with-options_79603-159.jpg?w=740&t=st=1675306399~exp=1675306999~hmac=0f7db917ce23b5dec2b08cab68601e969f935420257dc032426e6e242266a50b',
  'https://img.freepik.com/free-vector/flat-circular-diagram-infographic_23-2148973773.jpg?w=826&t=st=1675306443~exp=1675307043~hmac=685566d5921edb18a2bce646ead9aa812d8b17b7c5b68806c3a473afecf93a2c',
  'https://img.freepik.com/free-vector/infographic-steps-collection-flat-design_52683-13833.jpg?w=826&t=st=1675306507~exp=1675307107~hmac=9d5292cde8af404260654670b05cd56a36aa9019e15a0012177af84a24be89a9',
];

const getImageLink = (value: number) => { return imgLinks[value % imgLinks.length]; }

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
        <Tabs value={value} onChange={handleChange} centered aria-label="basic tabs example">
          {patients && patients.map((patient: Patient, ind: number) => {
            return (
              <Tab key={patient.id} label={`${patient.name} (${patient.id})`} />
            )
          })}
        </Tabs>
      </Box>

      <TabPanel value={0} index={0}>
        {patientDetail && patientDetail.firstName &&
          <div>
            {patientDetail && <div>
              {patientDetail.title} {patientDetail.preferredName ? `${patientDetail.preferredName} (${patientDetail.firstName})` : patientDetail.firstName} {patientDetail.middleName} {patientDetail.familyName} {patientDetail.suffix}
            </div>
            }
            <Box>
              <img className="demoChart" src={getImageLink(value)} style={{ width: '100%' }} alt="Cover designed by Freepik" />
              <div style={{
                fontSize: 'x-small'
              }}>Cover designed by Freepik</div>
            </Box>
          </div>
        }
      </TabPanel>

    </Box>
  );
}
