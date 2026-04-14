// Shared validation helpers for all reservation / booking forms

const NAME_REGEX = /^[a-zA-Z\s'\-.]+$/;
const PHONE_REGEX = /^\d{10}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate guest/person name.
 * Rules: required, letters/spaces/hyphens/apostrophes only, min 2 chars.
 */
export const validateName = (value = "") => {
  const v = value.trim();
  if (!v) return "Name is required";
  if (v.length < 2) return "Name must be at least 2 characters";
  if (!NAME_REGEX.test(v)) return "Name must contain only letters (no numbers or special characters)";
  return null;
};

/**
 * Validate Indian phone number.
 * Rules: required, exactly 10 digits.
 */
export const validatePhone = (value = "") => {
  const v = value.trim().replace(/\s/g, "");
  if (!v) return "Phone number is required";
  if (!/^\d+$/.test(v)) return "Phone number must contain digits only";
  if (v.length !== 10) return "Phone number must be exactly 10 digits";
  return null;
};

/**
 * Validate email address.
 * @param {string} value
 * @param {boolean} required - pass false to make email optional
 */
export const validateEmail = (value = "", required = true) => {
  const v = value.trim();
  if (!v) return required ? "Email address is required" : null;
  if (!EMAIL_REGEX.test(v)) return "Enter a valid email address (e.g. name@example.com)";
  return null;
};

/**
 * Validate reservation date.
 * Rules: required, must be today or a future date.
 */
export const validateDate = (value = "") => {
  if (!value) return "Date is required";
  const selected = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (isNaN(selected.getTime())) return "Enter a valid date";
  if (selected < today) return "Date cannot be in the past";
  return null;
};

/**
 * Validate reservation time.
 * Rules: required.
 */
export const validateTime = (value = "") => {
  if (!value) return "Time is required";
  return null;
};

/**
 * Validate number of guests.
 * Rules: required, positive integer, min 1, max 500.
 */
export const validateGuests = (value = "") => {
  if (value === "" || value === null || value === undefined) return "Number of guests is required";
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1) return "Enter at least 1 guest";
  if (n > 500) return "Maximum 500 guests allowed";
  return null;
};

/**
 * Validate number of persons (optional field in group bookings).
 * Rules: optional, but if provided must be a positive integer.
 */
export const validatePersons = (value = "") => {
  if (value === "" || value === null || value === undefined) return null; // optional
  const n = Number(value);
  if (isNaN(n) || !Number.isInteger(n) || n < 1) return "Enter a valid number of persons (min 1)";
  if (n > 10000) return "Maximum 10,000 persons allowed";
  return null;
};

/**
 * Run full validation for a simple table reservation form.
 * Returns an errors object — empty means no errors.
 */
export const validateReservationForm = ({ guestName, contactNumber, date, time, totalGuest }) => {
  const errors = {};
  const nameErr = validateName(guestName);
  if (nameErr) errors.guestName = nameErr;
  const phoneErr = validatePhone(contactNumber);
  if (phoneErr) errors.contactNumber = phoneErr;
  const dateErr = validateDate(date);
  if (dateErr) errors.date = dateErr;
  const timeErr = validateTime(time);
  if (timeErr) errors.time = timeErr;
  const guestErr = validateGuests(totalGuest);
  if (guestErr) errors.totalGuest = guestErr;
  return errors;
};

/**
 * Run full validation for the restaurant reserve dialog (includes email).
 */
export const validateReserveDialogForm = ({ guestName, contactNumber, emailAddress, date, time, totalGuest }) => {
  const errors = {};
  const nameErr = validateName(guestName);
  if (nameErr) errors.guestName = nameErr;
  const phoneErr = validatePhone(contactNumber);
  if (phoneErr) errors.contactNumber = phoneErr;
  const emailErr = validateEmail(emailAddress, true);
  if (emailErr) errors.emailAddress = emailErr;
  const dateErr = validateDate(date);
  if (dateErr) errors.date = dateErr;
  const timeErr = validateTime(time);
  if (timeErr) errors.time = timeErr;
  const guestErr = validateGuests(totalGuest);
  if (guestErr) errors.totalGuest = guestErr;
  return errors;
};

/**
 * Run full validation for a group booking / events enquiry form.
 */
export const validateGroupBookingForm = ({ name, phone, email, persons }) => {
  const errors = {};
  const nameErr = validateName(name);
  if (nameErr) errors.name = nameErr;
  const phoneErr = validatePhone(phone);
  if (phoneErr) errors.phone = phoneErr;
  const emailErr = validateEmail(email, true);
  if (emailErr) errors.email = emailErr;
  const personsErr = validatePersons(persons);
  if (personsErr) errors.persons = personsErr;
  return errors;
};
