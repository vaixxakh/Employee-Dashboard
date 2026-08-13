import { mapUserToEmployee } from "../mappers/userMapper";

const API_URL = "https://jsonplaceholder.typicode.com/users";

const isValidUser = (user) => (
  user &&
  typeof user === 'object' &&
  Number.isFinite(user.id) &&
  typeof user.name === 'string' &&
  typeof user.email === 'string'
);

export const getUsers = async () => {

 try {
    const response = await fetch(API_URL);

    if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if(!Array.isArray(data) || !data.every(isValidUser)) {
      throw new Error('Invalid API response: expected an array of users');
    }

    return data.map(mapUserToEmployee);

 } catch (error) {

    throw new Error(`Failed to fetch users: ${error.message}`);
  }
};
