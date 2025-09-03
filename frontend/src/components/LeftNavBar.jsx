import Stack from 'react-bootstrap/Stack';

function LeftNavBar() {
  return (
    <Stack gap={3}>
      <div className="p-2">Home </div>
      <div className="p-2">Explore </div>
      <div className="p-2">Saved </div>
      <div className="p-2">Favorites </div>
      <hr />
      <div className="p-2">Profile </div>
      <div className="p-2">Settings </div>
    </Stack>
  );
}

export default LeftNavBar;