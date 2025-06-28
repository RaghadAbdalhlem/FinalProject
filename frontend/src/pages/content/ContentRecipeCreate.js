/* eslint-disable react-hooks/exhaustive-deps */
import { useFieldArray, useForm } from "react-hook-form";
import { Button, Card, CardBody, Col, Form, FormGroup, Label, Row } from "reactstrap";
import classnames from "classnames";
import { useCreateRecipeMutation } from "../../redux/api/recipeAPI";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ContentRecipeCreate = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm({
    defaultValues: {
      ingredients: [{ name: "", amount: "" }],
      nutritionalInfo: { calories: "", carbs: "", protein: "", fats: "" }
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients"
  });

  const [createRecipe, { isLoading, isError, error, isSuccess, data }] = useCreateRecipeMutation();

  const onSubmit = async (data) => {
    try {
      const form = new FormData();
      form.append("title", data.title);
      form.append("dietType", data.dietType);
      form.append("nutritionalInfo", JSON.stringify(data.nutritionalInfo));
      form.append("ingredients", JSON.stringify(data.ingredients));
      form.append("instructions", data.instructions);
      if (data.media && data.media[0]) {
        form.append("media", data.media[0]);
      }

      await createRecipe(form);
    } catch (error) {
      toast.error("Error submitting the recipe data.");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Recipe created successfully!");
      navigate("/content-manager/recipes");
    }

    if (isError) {
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
  }, [isLoading]);

  return (
    <div className="container main-view">
      <Row className="my-3">
        <Col>
          <h3 className="mb-3">Create Recipe</h3>
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
                    {...register('title', { required: true })}
                  />
                  {errors.title && <small className="text-danger">Title is required.</small>}
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
            </Row>
            <Row>
              <Col md={12}>
                <FormGroup>
                  <Label className="fw-bold">Nutritional Info</Label> {/* Added Section Label */}
                  <Row>
                    <Col md={3}>
                      <FormGroup>
                        <Label>Calories</Label>
                        <input
                          type="number"
                          className={`form-control ${classnames({ "is-invalid": errors.nutritionalInfo?.calories })}`}
                          {...register("nutritionalInfo.calories", { required: "Calories are required", min: { value: 0, message: "Must be positive" } })}
                          placeholder="Calories"
                        />
                        {errors.nutritionalInfo?.calories && <small className="text-danger">{errors.nutritionalInfo.calories.message}</small>}
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label>Carbs (g)</Label>
                        <input
                          type="number"
                          className={`form-control ${classnames({ "is-invalid": errors.nutritionalInfo?.carbs })}`}
                          {...register("nutritionalInfo.carbs", { required: "Carbs are required", min: { value: 0, message: "Must be positive" } })}
                          placeholder="Carbs"
                        />
                        {errors.nutritionalInfo?.carbs && <small className="text-danger">{errors.nutritionalInfo.carbs.message}</small>}
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label>Protein (g)</Label>
                        <input
                          type="number"
                          className={`form-control ${classnames({ "is-invalid": errors.nutritionalInfo?.protein })}`}
                          {...register("nutritionalInfo.protein", { required: "Protein is required", min: { value: 0, message: "Must be positive" } })}
                          placeholder="Protein"
                        />
                        {errors.nutritionalInfo?.protein && <small className="text-danger">{errors.nutritionalInfo.protein.message}</small>}
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label>Fats (g)</Label>
                        <input
                          type="number"
                          className={`form-control ${classnames({ "is-invalid": errors.nutritionalInfo?.fats })}`}
                          {...register("nutritionalInfo.fats", { required: "Fats are required", min: { value: 0, message: "Must be positive" } })}
                          placeholder="Fats"
                        />
                        {errors.nutritionalInfo?.fats && <small className="text-danger">{errors.nutritionalInfo.fats.message}</small>}
                      </FormGroup>
                    </Col>
                  </Row>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label>Media</Label>
                  <input
                    className={`form-control ${classnames({ "is-invalid": errors.media })}`}
                    type="file"
                    accept="image/*,video/*"
                    {...register("media", { required: "Media is required." })}
                  />
                  {errors.media && <small className="text-danger">{errors.media.message}</small>}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <Label>Ingredients</Label>
                  {fields.map((item, index) => (
                    <Row key={item.id} className="mb-2 align-items-center">
                      <Col md={5}>
                        <input
                          type="text"
                          className={`form-control ${classnames({ "is-invalid": errors.ingredients?.[index]?.name })}`}
                          {...register(`ingredients.${index}.name`, { required: "Ingredient name is required" })}
                          placeholder="Ingredient Name"
                        />
                        {errors.ingredients?.[index]?.name && <small className="text-danger">{errors.ingredients[index].name.message}</small>}
                      </Col>
                      <Col md={4}>
                        <input
                          type="number"
                          className={`form-control ${classnames({ "is-invalid": errors.ingredients?.[index]?.amount })}`}
                          {...register(`ingredients.${index}.amount`, { required: "Amount is required", min: { value: 1, message: "Amount must be greater than 0" } })}
                          placeholder="Amount (grams)"
                        />
                        {errors.ingredients?.[index]?.amount && <small className="text-danger">{errors.ingredients[index].amount.message}</small>}
                      </Col>
                      <Col md={3}>
                        <Button color="danger" className="btn-sm" onClick={() => remove(index)}>Remove</Button>
                      </Col>
                    </Row>
                  ))}
                  <div className="mt-2">
                    <Button color="primary" className="btn-sm" onClick={() => append({ name: "", amount: "" })}>+ Add Ingredient</Button>
                  </div>

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
                <Button type="submit" color="primary" className="btn-sm" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Create Recipe"}
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default ContentRecipeCreate;