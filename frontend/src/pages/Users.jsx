import ListUsers from "./ListUsers";
import Container from 'react-bootstrap/Container';

function Users() {
  return (
    <Container fluid className="mt-8">
      <h2 className="text-center">Users List</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-rows-[auto] gap-8 p-4'>
        <ListUsers />
      </div>
    </Container>
  )
}

export default Users;