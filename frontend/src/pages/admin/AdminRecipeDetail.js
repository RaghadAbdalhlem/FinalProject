import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, CardTitle, Button, Row, Col, Container, Badge } from "reactstrap";
import { useGetRecipeByIdQuery, useDeleteRecipeMutation } from "../../redux/api/recipeAPI";
import { toast } from "react-toastify";
import FullScreenLoader from "../../components/FullScreenLoader";
import { useState } from "react";
import { Trash2, ArrowLeft } from "react-feather";

const AdminRecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetRecipeByIdQuery(id);
  const [deleteRecipe] = useDeleteRecipeMutation();
  const [isDeleting, setIsDeleting] = useState(false);

  if (isLoading) return <FullScreenLoader />;
  if (error) return <div className="text-center mt-5 text-danger">Error loading recipe.</div>;

  const { title, media, dietType, nutritionalInfo, ingredients, instructions } = data;

  const renderMedia = (media) => {
    if (!media) return <div className="text-muted">No media available</div>;
    return /\.(mp4|webm|ogg)$/i.test(media) ? (
      <video src={media} className="img-fluid rounded shadow-lg" style={{ maxWidth: "100%" }} controls />
    ) : (
      <img src={media} alt="Recipe" className="img-fluid rounded shadow-lg" style={{ maxWidth: "100%" }} />
    );
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    setIsDeleting(true);
    try {
      await deleteRecipe(id).unwrap();
      toast.success("Recipe deleted successfully");
      navigate("/admin/recipes");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete recipe");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Container className="main-view">
      <div className="mb-4">
        <Button color="secondary" className="me-2" onClick={() => navigate("/admin/recipes")}>
          <ArrowLeft size={16} className="me-1" /> Back
        </Button>
      </div>
      <div className="mb-4">
        <h3>Recipe </h3>
      </div>
      <Row className="justify-content-center">
        <Col lg={12}>
          <Card className="shadow-lg border-0">
            <Row className="g-0">
              <Col md={5} className="text-center p-4 bg-light d-flex align-items-center justify-content-center">
                {renderMedia(media)}
              </Col>
              <Col md={7}>
                <CardBody className="p-5">
                  <CardTitle tag="h2" className="mb-3 text-primary fw-bold">{title}</CardTitle>
                  <div className="mb-3">
                    <strong>Diet Type:</strong> <Badge color="info">{dietType}</Badge>
                  </div>
                  <div className="mb-3">
                    <h4 className="section-title">Ingredients:</h4>
                    <ul className="ingredient-list">
                      {ingredients.map((ingredient, index) => (
                        <li key={index}>
                          <strong>{ingredient.name}:</strong> {ingredient.amount}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <h4 className="section-title">Nutritional Info:</h4>
                  <ul className="nutritional-list">
                    <li>
                      <strong>Calories:</strong> {nutritionalInfo.calories}
                    </li>
                    <li>
                      <strong>Carbs:</strong> {nutritionalInfo.carbs}
                    </li>
                    <li>
                      <strong>Protein:</strong> {nutritionalInfo.protein}
                    </li>
                    <li>
                      <strong>Fats:</strong> {nutritionalInfo.fats}
                    </li>
                  </ul>
                  <div className="mb-3">
                    <strong>Instructions:</strong>
                    <div className="text-muted border rounded p-3 bg-light">{instructions}</div>
                  </div>
                  <Button color="danger" size="sm" className="mt-3" onClick={handleDelete} disabled={isDeleting}>
                    <Trash2 size={18} className="me-1" /> {isDeleting ? "Deleting..." : "Delete Recipe"}
                  </Button>
                </CardBody>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminRecipeDetail;
