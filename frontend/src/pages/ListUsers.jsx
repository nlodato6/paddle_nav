import { useState, useEffect } from 'react';
import { getUsers } from '../api/authApi';
import User from '../components/user';

export default function ListUsers() {

  const [users, setUsers] = useState([])

  const createUsersList = () => {
    return users.map((user, i) => <User key={i} user={user} />)
  }

  useEffect(() => {
    async function performGetUsers() {
      const users = await getUsers()
      setUsers(users)
    }
    performGetUsers()
  }, [])

  return (
    createUsersList()
  )
}