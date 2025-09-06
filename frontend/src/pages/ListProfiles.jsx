import { useState, useEffect } from 'react';
import { getProfiles } from '../api/authApi';
import Profile from '../components/profile';

export default function ListProfiles() {

  const [profiles, setProfiles] = useState([])

  const createProfilesList = () => {
    return profiles.map((profile, i) => <Profile key={i} profile={profile} />)
  }

  useEffect(() => {
    async function performGetProfiles() {
      const profiles = await getProfiles()
      setProfiles(profiles)
    }
    performGetProfiles()
  }, [])

  return (
    createProfilesList()
  )
}