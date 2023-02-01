export interface Patient {
  id: string;
  name: string;
}

export interface Patients extends Array<Patient> { }

export interface PatientList {
  patients: Patients;
}