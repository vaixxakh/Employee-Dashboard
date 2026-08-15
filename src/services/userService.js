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

export const createUser = async (user) => {
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if(!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();

  } catch (error){
    throw new Error(`Failed to create user: ${error.message}`)
  }

};

export const updateUser = async (id, user) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
};

export const deleteUser = async (id) => {

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
   });
  
   if(!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
   }

   return true;
} catch (error) {
  throw new Error(`Failed to delete user: ${error.message}`);
  }
};
