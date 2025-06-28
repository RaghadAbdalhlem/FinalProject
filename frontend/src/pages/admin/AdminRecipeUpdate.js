/* eslint-disable react-hooks/exhaustive-deps */
import { useForm } from "react-hook-form";
import { Button, Card, CardBody, Col, Form, FormGroup, Label, Row } from "reactstrap";
import classnames from "classnames";
import { useGetRecipeByIdQuery, useUpdateRecipeMutation } from "../../redux/api/recipeAPI";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AdminRecipeUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: recipe, refetch } = useGetRecipeByIdQuery(id); // Fetch the existing recipe data by ID
  const [updateRecipe, { isLoading: isUpdating, isError: updateError, error, isSuccess, data }] = useUpdateRecipeMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const onSubmit = async (data) => {
    try {
      const form = new FormData();
      form.append("title", data.title);
      form.append("dietType", data.dietType);
      form.append("calories", data.calories);
      form.append("ingredients", data.ingredients);
      form.append("instructions", data.instructions);
      if (data.media && data.media[0]) {
        form.append("media", data.media[0]);
      }

      await updateRecipe({ id, form }); // Pass ID along with the form data for updating
    } catch (error) {
      toast.error("Error updating the recipe data.");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Recipe updated successfully!");
      navigate("/content-manager/recipes");
    }

    if (updateError) {
      const errorData = error?.data?.error;
      if (Array.isArray(errorData)) {
        errorData.forEach((el) =>
          toast.error(el.message, { position: "top-right" })
        );
      } else {
        toast.error(error?.data?.message || "An unexpected error occurred!", {
          position: "top-right",
        });
      }
    }
  }, [isUpdating]);

  useEffect(() => {
    if (recipe) {
      // Populate form fields with the existing recipe data
      setValue("title", recipe.title);
      setValue("dietType", recipe.dietType);
      setValue("calories", recipe.calories);
      setValue("ingredients", recipe.ingredients);
      setValue("instructions", recipe.instructions);
    }
  }, [recipe]);

  return (
    <div className="container main-view">
      <Row className="my-3">
        <Col>
          <h3 className="mb-3">Update Recipe</h3>
        </Col>
      </Row>
      <Card>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label>Title</Label>
                  <input
                    className={`form-control ${classnames({ 'is-invalid': errors.title })}`}
                    type="text"
                    {...register('title', { required: "Title is required." })}
                  />
                  {errors.title && <small className="text-danger">{errors.title.message}</small>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Diet Type</Label>
                  <select
                    className={`form-control ${classnames({ "is-invalid": errors.dietType })}`}
                    {...register("dietType", { required: "Diet Type is required." })}
                  >
                    <option value="">Select...</option>
                    <option value="vegan">Vegan</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="pescatarian">Pescatarian</option>
                    <option value="keto">Keto</option>
                    <option value="paleo">Paleo</option>
                    <option value="gluten-free">Gluten-Free</option>
                    <option value="low-carb">Low-Carb</option>
                    <option value="high-protein">High-Protein</option>
                  </select>
                  {errors.dietType && <small className="text-danger">{errors.dietType.message}</small>}
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label>Nutritional Info</Label>
                  <input
                    className={`form-control ${classnames({ "is-invalid": errors.calories })}`}
                    type="number"
                    {...register("calories", { required: "Nutritional Info is required." })}
                  />
                  {errors.calories && <small className="text-danger">{errors.calories.message}</small>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Media</Label>
                  <input
                    className={`form-control ${classnames({ "is-invalid": errors.media })}`}
                    type="file"
                    accept="image/*,video/*"
                    {...register("media")}
                  />
                  {errors.media && <small className="text-danger">{errors.media.message}</small>}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <Label>Ingredients</Label>
                  <textarea
                    className={`form-control ${classnames({ 'is-invalid': errors.ingredients })}`}
                    {...register('ingredients', { required: 'Ingredients are required.' })}
                  ></textarea>
                  {errors.ingredients && <small className="text-danger">{errors.ingredients.message}</small>}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <Label>Instructions</Label>
                  <textarea
                    className={`form-control ${classnames({ 'is-invalid': errors.instructions })}`}
                    {...register('instructions', { required: 'Instructions are required.' })}
                  ></textarea>
                  {errors.instructions && <small className="text-danger">{errors.instructions.message}</small>}
                </FormGroup>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col>
                <Button type="submit" color="primary" className="btn-sm" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update Recipe"}
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminRecipeUpdate;
