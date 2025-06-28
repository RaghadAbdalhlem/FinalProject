/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Container, Card, CardBody, CardImg, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'react-feather';
import { useGetFavoritesQuery, useAddFavoriteMutation, useRemoveFavoriteMutation } from '../../redux/api/favoriteAPI';
import FullScreenLoader from '../../components/FullScreenLoader';
import { useSelector } from 'react-redux';

const Favorites = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.userState.user);
  const [page, setPage] = useState(1);
  const limit = 8; // Number of recipes per page

  const queryParams = {
    page,
    limit
  };

  const { data, refetch, isLoading } = useGetFavoritesQuery(queryParams);
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();

  useEffect(() => {
    refetch();
  }, [page, refetch]);

  const handleAddFavorite = async (recipeId) => {
    try {
      await addFavorite(recipeId);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveFavorite = async (recipeId) => {
    try {
      await removeFavorite(recipeId);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewDetails = (recipeId) => navigate(`/user/recipes/detail/${recipeId}`);

  // Pagination Controls
  const handlePageChange = (newPage) => setPage(newPage);

  if (isLoading) return <FullScreenLoader />;

  return (
    <div className="main-view">
      <Container>
        <div className="text-center">
          <h2>Your Favorite Recipes</h2>
          <p className="text-primary">All your favorite recipes in one place</p>
        </div>

        <Row>
          {data.recipes?.map((recipe) => (
            <Col md={3} key={recipe._id} className="mb-4">
              <Card className="recipe-card shadow-sm">
                {recipe.media && <CardImg top width="100%" src={recipe.media} alt={recipe.title} style={{ height: "250px" }} className="recipe-img" />}
                <CardBody className="text-center">
                  <h5 className="recipe-title mb-2">{recipe.title}</h5>
                  <p className="text-muted">Calories: {recipe.calories} kcal</p>
                  <div className='d-flex mt-3'>
                    <Button color="primary" onClick={() => handleViewDetails(recipe._id)} className="mx-1">
                      View
                    </Button>
                    <Button
                      color={recipe.favorites.includes(user._id) ? 'danger' : 'success'}
                      onClick={() =>
                        recipe.favorites.includes(user._id) ? handleRemoveFavorite(recipe._id) : handleAddFavorite(recipe._id)
                      }
                      className="mx-1"
                    >
                      <Heart className="mx-2" />
                      {recipe.favorites.includes(user._id) ? 'Remove from Favorites' : 'Add to Favorites'}
                    </Button>
                  </div>

                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Pagination */}
        {data?.totalPages > 0 && (
          <Pagination className="mt-4 d-flex justify-content-center">
            <PaginationItem disabled={page === 1}>
              <PaginationLink previous onClick={() => handlePageChange(page - 1)} />
            </PaginationItem>
            {[...Array(data.totalPages)].map((_, index) => (
              <PaginationItem key={index} active={page === index + 1}>
                <PaginationLink onClick={() => handlePageChange(index + 1)}>{index + 1}</PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem disabled={page === data.totalPages}>
              <PaginationLink next onClick={() => handlePageChange(page + 1)} />
            </PaginationItem>
          </Pagination>
        )}
      </Container>
    </div>
  );
};

export default Favorites;
