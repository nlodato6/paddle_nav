import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const User = ({ user }) => {
  return (
    <Card className=''>
      <Card.Body className='bg-[#00D8FF]'>
        <Card.Title className='text-center'>{user.first_name} {user.last_name}</Card.Title>
        <div className='border-1 p-2 bg-white rounded-2xl'>
          <p className='text-center font-bold'>
            Email:
          </p>
          <p className='text-center'>
            {user.email}
          </p>
          <div className='flex justify-evenly'>
            <Button className='w-[86px]' variant="primary">Edit</Button>
            <Button className='w-[86px]' variant="danger">Delete</Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
export default User