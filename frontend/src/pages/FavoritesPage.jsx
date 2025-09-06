// /pages/FavoritesPage.jsx
import Container from 'react-bootstrap/Container';
import ListFavorites from './ListFavorites';

function FavoritesPage() {
  return (
    <Container fluid className="mt-8">
      <h2 className="text-center">My Favorites</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-4">
        <ListFavorites />
      </div>
    </Container>
  );
}

export default FavoritesPage;
