import Stack from 'react-bootstrap/Stack';
import { Link } from 'react-router-dom';

function LeftNavBar() {
  return (
    <Stack gap={3} className="p-3">
      <Link to="/" className="p-2 text-decoration-none text-dark">Home</Link>
      <Link to="/locations" className="p-2 text-decoration-none text-dark">Explore</Link>
      <Link to="/saved" className="p-2 text-decoration-none text-dark">Saved</Link>
      <Link to="/favorites" className="p-2 text-decoration-none text-dark">Favorites</Link>
      <hr />
      <Link to="/profile" className="p-2 text-decoration-none text-dark">Profile</Link>
      <Link to="/settings" className="p-2 text-decoration-none text-dark">Settings</Link>
    </Stack>
  );
}

export default LeftNavBar;