/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  CardImg,
} from "reactstrap";
import { Heart } from "react-feather";
import { useGetRecipeByIdQuery } from "../../redux/api/recipeAPI";
import {
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} from "../../redux/api/favoriteAPI";
import { useSelector } from "react-redux";

const RecipeDetail = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.userState.user);

  const [isFavorite, setIsFavorite] = useState(false);
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();

  const {
    data: recipe,
    isLoading,
    refetch: refetchRecipe,
  } = useGetRecipeByIdQuery(id);

  /* ─────────────────────────────── Effects ─────────────────────────────── */
  useEffect(() => {
    refetchRecipe();
  }, [refetchRecipe]);

  useEffect(() => {
    if (recipe && user) {
      setIsFavorite(
        recipe.favorites && recipe.favorites.includes(user._id)
      );
    }
  }, [recipe, user]);

  /* ─────────────────────────── Favorite handlers ────────────────────────── */
  const handleSaveToFavorites = async () => {
    try {
      await addFavorite(id).unwrap();
      setIsFavorite(true);
      refetchRecipe();
    } catch (err) {
      /* eslint-disable-next-line no-console */
      console.error(err);
    }
  };

  const handleRemoveFromFavorites = async () => {
    try {
      await removeFavorite(id).unwrap();
      setIsFavorite(false);
      refetchRecipe();
    } catch (err) {
      /* eslint-disable-next-line no-console */
      console.error(err);
    }
  };

  /* ─────────────────────────────── Render ──────────────────────────────── */
  if (isLoading) return <div>Loading…</div>;

  return (
    <div className="main-view">
      <Container>
        <Card className="recipe-card shadow-lg rounded-lg">
          <CardHeader className="recipe-card-header bg-primary text-white text-center">
            <h2>{recipe.title}</h2>
          </CardHeader>

          <CardBody>
            <Row>
              <Col md={6}>
                <CardImg
                  top
                  width="100%"
                  src={recipe.media}
                  alt="Recipe"
                  className="recipe-image"
                  style={{ height: "250px" }}
                />
              </Col>

              <Col md={6}>
                <div className="recipe-info">
                  <h4 className="section-title">Ingredients:</h4>
                  <ul className="ingredient-list">
                    {recipe.ingredients.map((ing, i) => (
                      <li key={i}>
                        <strong>{ing.name}:</strong> {ing.amount}
                      </li>
                    ))}
                  </ul>

                  <h4 className="section-title">Instructions:</h4>
                  <ol className="instruction-list">{recipe.instructions}</ol>

                  <h4 className="section-title">Nutritional Info:</h4>
                  <ul className="nutritional-list">
                    <li>
                      <strong>Calories:</strong>{" "}
                      {recipe.nutritionalInfo.calories}
                    </li>
                    <li>
                      <strong>Carbs:</strong> {recipe.nutritionalInfo.carbs}
                    </li>
                    <li>
                      <strong>Protein:</strong> {recipe.nutritionalInfo.protein}
                    </li>
                    <li>
                      <strong>Fats:</strong> {recipe.nutritionalInfo.fats}
                    </li>
                  </ul>

                  <p>
                    <strong>Diet Type:</strong> {recipe.dietType}
                  </p>

                  {/* Favorite button */}
                  <Button
                    color={isFavorite ? "danger" : "primary"}
                    onClick={
                      isFavorite
                        ? handleRemoveFromFavorites
                        : handleSaveToFavorites
                    }
                    className="save-btn btn-sm"
                  >
                    <Heart
                      className={`mx-2 ${
                        isFavorite ? "text-danger" : "text-primary"
                      }`}
                    />
                    {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                  </Button>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default RecipeDetail;
