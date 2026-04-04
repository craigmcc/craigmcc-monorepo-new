/**
 * "Database" types for Daisy Alone examples.
 */

// Public Types --------------------------------------------------------------

export type Profile = {
  // The email address of the profile.
  email: string;
  // The first name of the profile.
  firstName: string;
  // The last name of the profile.
  lastName: string;
  // The password of the profile. (not encrypted because this is a demo)
  password: string;
}

export type SignUp = {
  // The confirm password field for sign up.
  confirmPassword: string;
  // The email address of the profile.
  email: string;
  // The first name of the profile.
  firstName: string;
  // The last name of the profile.
  lastName: string;
  // The password of the profile. (not encrypted because this is a demo)
  password: string;
}

// Types from jsonplaceholder.typicode.com -----------------------------------

export type User = {
  // The unique identifier for the user.
  id: number;
  // The name of the user.
  name: string;
  // The username of the user.
  username: string;
  // The email address of the user.
  email: string;
  // The phone number of the user.
  phone: string;
  // The website of the user.
  website: string;
}
