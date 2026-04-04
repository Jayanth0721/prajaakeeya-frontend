import * as yup from 'yup';

export const phoneSchema = yup
  .string()
  .required('validation.required')
  .matches(/^[6-9]\d{9}$/i, 'validation.phone');

export const emailSchema = yup
  .string()
  .required('validation.required')
  .email('validation.email');

export const otpSchema = yup
  .string()
  .required('validation.required')
  .matches(/^\d{6}$/i, 'validation.otp');

export const epicIdSchema = yup
  .string()
  .required('validation.required')
  .matches(/^[A-Z]{3}\d{7}$/, 'validation.epicid')
  .length(10, 'validation.epicid');

export const wardSchema = yup.object({
  number: yup.string().required('validation.required'),
  name: yup.string().required('validation.required'),
  state: yup.string().required('validation.required'),
  parliamentary: yup.string().required('validation.required'),
  assembly: yup.string().required('validation.required')
});

// Minimum age requirements by election type
const MIN_AGE_BY_ELECTION_TYPE: Record<string, number> = {
  lok_sabha: 25,
  state_assembly: 25,
  municipal_corporation: 21,
  gram_panchayat: 21,
};
const DEFAULT_MIN_AGE = 21;

export const getMinAgeForElectionType = (electionType: string): number =>
  MIN_AGE_BY_ELECTION_TYPE[electionType] ?? DEFAULT_MIN_AGE;

export const createAspirantSchema = (getElectionType: () => string) => yup.object({
  name: yup.string().required('validation.required'),
  manifesto: yup.string().required('validation.required'),
  electionId: yup.number().typeError('validation.required').required('validation.required'),
  constituencyId: yup.number().typeError('validation.required').required('validation.required'),
  phone: yup.string().optional().test(
    'phone-optional',
    'validation.phone',
    (value) => !value || value.trim() === '' || /^[6-9]\d{9}$/.test(value)
  ),
  instagramLink: yup
    .string()
    .optional()
    .test('instagram-url', 'validation.instagramLink', (value) => {
      if (!value || value.trim() === '') return true;
      return /^https?:\/\/(www\.)?instagram\.com\/.+/i.test(value.trim());
    }),
  facebookLink: yup
    .string()
    .optional()
    .test('facebook-url', 'validation.facebookLink', (value) => {
      if (!value || value.trim() === '') return true;
      return /^https?:\/\/(www\.)?facebook\.com\/.+/i.test(value.trim());
    }),
  linkedinLink: yup
    .string()
    .optional()
    .test('linkedin-url', 'validation.linkedinLink', (value) => {
      if (!value || value.trim() === '') return true;
      return /^https?:\/\/(www\.)?([a-z]{2}\.)?linkedin\.com\/.+/i.test(value.trim());
    }),
  twitterLink: yup
    .string()
    .optional()
    .test('twitter-url', 'validation.twitterLink', (value) => {
      if (!value || value.trim() === '') return true;
      return /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/.+/i.test(value.trim());
    }),
  whatsappNumber: yup
    .string()
    .optional()
    .test('whatsapp-number', 'validation.whatsappNumber', (value) => {
      if (!value || value.trim() === '') return true;
      return /^[6-9]\d{9}$/.test(value.trim());
    }),
  age: yup
    .number()
    .typeError('validation.required')
    .required('validation.required')
    .integer('validation.ageInteger')
    .max(150, 'validation.ageRange')
    .test('min-age-election', '', function (value) {
      if (!value) return true;
      const electionType = getElectionType();
      const minAge = getMinAgeForElectionType(electionType);
      if (value >= minAge) return true;
      return this.createError({ message: `validation.ageMinElection:${minAge}` });
    }),
});

// Backwards-compatible static schema (uses default min age of 21)
export const aspirantSchema = createAspirantSchema(() => '');

export const voteSchema = yup.object({
  wardId: yup.number().required('validation.required'),
  aspirantId: yup.number().required('validation.required')
});
