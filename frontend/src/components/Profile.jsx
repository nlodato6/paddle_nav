import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const Profile = ({ profile }) => {
  return (
    <Card className=''>
      <Card.Body className='bg-[#00D8FF]'>
        <Card.Title className='text-center'>Account: {profile.fields.account}</Card.Title>
        <div className='border-1 bg-white rounded-2xl p-4'>
          <p><strong>Street Address:</strong> {profile.fields.street_number} {profile.fields.street_name}</p>
          <p><strong>City:</strong> {profile.fields.city}</p>
          <p><strong>Zip Code:</strong> {profile.fields.zip_code}</p>
          <div className='flex justify-evenly'>
            <Button className='w-[86px]' variant="primary">Edit</Button>
            <Button className='w-[86px]' variant="danger">Delete</Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
export default Profile