/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Button, Input, Row, Col, Container, Card, CardBody, FormGroup, Label, CardImg, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { Search } from 'react-feather';
import { useGetRecipesQuery } from '../../redux/api/recipeAPI';
import FullScreenLoader from '../../components/FullScreenLoader';

const RecipesList = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [dietType, setDietType] = useState('');
  const [minCalories, setMinCalories] = useState('');
  const [maxCalories, setMaxCalories] = useState('');
  const [page, setPage] = useState(1);
  const limit = 8; // Number of recipes per page

  // Query parameters
  const queryParams = {
    searchQuery,
    dietType,
    minCalories,
    maxCalories,
    page,
    limit
  };

  const { data, refetch, isLoading } = useGetRecipesQuery(queryParams);

  useEffect(() => {
    refetch();
  }, [searchQuery, dietType, minCalories, maxCalories, page]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'dietType') setDietType(value);
    if (name === 'minCalories') setMinCalories(value);
    if (name === 'maxCalories') setMaxCalories(value);
  };
  const handleViewDetails = (recipeId) => navigate(`/user/recipes/detail/${recipeId}`);

  // Pagination Controls
  const handlePageChange = (newPage) => setPage(newPage);

  if (isLoading) return <FullScreenLoader />;

  return (
    <div className='main-view'>
      <Container>
        <div className="text-center">
          <h2>Recipe Library</h2>
          <p className="text-primary">Discover your next favorite recipe</p>
        </div>
        <Row className="mb-2">
          <Col md={4}>
            <FormGroup>
              <Label for="search" className="font-weight-bold">Search</Label>
              <div className="search-bar">
                <Search className="search-icon" />
                <Input
                  type="text"
                  id="search"
                  placeholder="Search by recipe name"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="search-input"
                />
              </div>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="dietType" className="font-weight-bold">Diet Type</Label>
              <Input
                type="select"
                id="dietType"
                name="dietType"
                value={dietType}
                onChange={handleFilterChange}
              >
                <option value="">Select Diet Type</option>
                <option value="keto">Keto</option>
                <option value="vegan">Vegan</option>
                <option value="vegetarian">Vegetarian</option>
              </Input>
            </FormGroup>
          </Col>
          <Col md={4}>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="minCalories" className="font-weight-bold">Min Calories</Label>
                  <Input
                    type="number"
                    id="minCalories"
                    name="minCalories"
                    value={minCalories}
                    onChange={handleFilterChange}
                    placeholder="Min"
                    className="filter-input"
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="maxCalories" className="font-weight-bold">Max Calories</Label>
                  <Input
                    type="number"
                    id="maxCalories"
                    name="maxCalories"
                    value={maxCalories}
                    onChange={handleFilterChange}
                    placeholder="Max"
                    className="filter-input"
                  />
                </FormGroup>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          {data?.recipes?.map((recipe) => (
            <Col md={3} key={recipe._id} className="mb-4"> {/* 4 cards per row */}
              <Card className="recipe-card shadow-sm">
                {recipe.media && <CardImg top width="100%" src={recipe.media} alt={recipe.title} className="recipe-img" style={{ height: "250px" }} />}
                <CardBody className="text-center">
                  <h5 className="recipe-title mb-2">{recipe.title}</h5>
                  <div className="recipe-macros p-3 bg-light rounded-3 shadow-sm border">
                    {recipe.nutritionalInfo && (
                      <div className="row text-center g-3">
                        <div className="col-6">
                          <div className="p-2 bg-white border rounded">
                            <span className="text-secondary fw-semibold d-block">Calories</span>
                            <span className="fs-5 fw-bold text-dark">{recipe.nutritionalInfo.calories} kcal</span>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="p-2 bg-white border rounded">
                            <span className="text-secondary fw-semibold d-block">Carbs</span>
                            <span className="fs-5 fw-bold text-dark">{recipe.nutritionalInfo.carbs}g</span>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="p-2 bg-white border rounded">
                            <span className="text-secondary fw-semibold d-block">Protein</span>
                            <span className="fs-5 fw-bold text-dark">{recipe.nutritionalInfo.protein}g</span>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="p-2 bg-white border rounded">
                            <span className="text-secondary fw-semibold d-block">Fats</span>
                            <span className="fs-5 fw-bold text-dark">{recipe.nutritionalInfo.fats}g</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button color="primary" onClick={() => handleViewDetails(recipe._id)} className="mt-3">
                    View Details
                  </Button>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Pagination */}
        {data?.totalPages > 1 && (
          <Pagination className="mt-4 d-flex justify-content-center">
            <PaginationItem disabled={page === 1}>
              <PaginationLink previous onClick={() => handlePageChange(page - 1)} />
            </PaginationItem>
            {[...Array(data.totalPages)].map((_, index) => (
              <PaginationItem key={index} active={page === index + 1}>
                <PaginationLink onClick={() => handlePageChange(index + 1)}>
                  {index + 1}
                </PaginationLink>
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

export default RecipesList;