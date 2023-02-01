export interface PatientDetail {
  title?: string;
  firstName: string;
  preferredName?: string;
  middleName?: string;
  familyName: string;
  suffix?: string;
  age: number;
  sex: 'Male' | 'Female' | 'Unknown' | 'Indeterminate';
}