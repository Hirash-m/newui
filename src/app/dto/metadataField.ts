export interface MetadataField {
  name: string;
  type: string;
  label?: string;
  controlType?: string;
  selectSource?: string;
  required?: boolean;
  inputType: 'text' | 'number' | 'boolean';
  minLength?: number;
  maxLength?: number;
  options?: any[];
  displayName? : string ;
  // هر چیز دیگه‌ای که لازمه...
}
