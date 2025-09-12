import Stack from 'react-bootstrap/Stack';
import { Link } from 'react-router-dom';

function LeftNavBar() {
  return (
    <Stack gap={3} className="p-3">
      {/* <Link to="/" className="p-2 text-decoration-none text-dark">
        <img
            alt="logo"
            src="/home.png"
            width="25"
            height="25"
            className="d-inline-block align-top"
          />{" "}
      Home</Link> */}


      <Link to="/locations" className="p-2 text-decoration-none text-dark"> 
      <img
            alt="logo"
            src="/explore.png"
            width="25"
            height="25"
            className="d-inline-block align-top"
          />{" "} 
          Explore</Link>

          <Link to="/conditions" className="p-2 text-decoration-none text-dark"> 
      <img
            alt="logo"
            src="/water.png"
            width="25"
            height="25"
            className="d-inline-block align-top"
          />{" "} 
          Coastal Conditions</Link>

      <Link to="/mylocations" className="p-2 text-decoration-none text-dark">
      <img
            alt="logo"
            src="/mylocations.png"
            width="25"
            height="25"
            className="d-inline-block align-top"
          />{" "}
          My Locations</Link>

      <Link to="/favorites" className="p-2 text-decoration-none text-dark">
      <img
            alt="logo"
            src="/favorites.png"
            width="25"
            height="25"
            className="d-inline-block align-top"
          />{" "}
      Favorites</Link>

      <hr />
      <Link to="/profile" className="p-2 text-decoration-none text-dark">
        <img
            alt="logo"
            src="/profile.png"
            width="25"
            height="25"
            className="d-inline-block align-top"
          />{" "}
      Profile</Link>
      {/* <Link to="/settings" className="p-2 text-decoration-none text-dark">Settings</Link> */}
    </Stack>
  );
}

export default LeftNavBar;