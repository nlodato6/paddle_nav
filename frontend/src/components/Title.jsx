import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function Title() {
  return (
    <>
      <Navbar className="bg-body-tertiary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt="logo"
              src="/nav_logo.svg"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            PaddleNav
          </Navbar.Brand>
        </Container>
      </Navbar>
    </>
  );
}

export default Title;