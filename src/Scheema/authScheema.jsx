import { z } from 'zod';

export const authSchema = z.object({
  stakeholder: z.string().nonempty('Please select a stakeholder type'),
  email: z.string().optional().refine(
    (val) => val === '' || z.string().email('Invalid email').safeParse(val).success,
    { message: 'Invalid email' }
  ).transform((val) => val || ''),
  cnic: z.string().optional().transform((val) => val || ''),
  password: z.string().optional().transform((val) => val || ''),
}).refine(
  (data) => {
    if (data.stakeholder === 'employee') {
      return data.email !== '' && data.cnic !== '';
    }
    return true;
  },
  { message: 'Email and CNIC are required for employee', path: ['email'] }
).refine(
  (data) => {
    if (data.stakeholder === 'hr') {
      return data.email !== '' && data.password !== '';
    }
    return true;
  },
  { message: 'Email and password are required for HR', path: ['email'] }
).refine(
  (data) => {
    if (data.stakeholder === 'superadmin') {
      return data.password !== '';
    }
    return true;
  },
  { message: 'Password is required for Super Admin', path: ['password'] }
);