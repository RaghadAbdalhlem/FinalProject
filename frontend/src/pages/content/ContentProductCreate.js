/* eslint-disable react-hooks/exhaustive-deps */
import { useForm } from "react-hook-form";
import { Button, Card, CardBody, Col, Form, FormGroup, Label, Row } from "reactstrap";
import classnames from "classnames";
import { useCreateProductMutation } from "../../redux/api/productAPI";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ContentProductCreate = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [createProduct, { isLoading, isError, error, isSuccess, data }] = useCreateProductMutation();

  const onSubmit = async (data) => {
    try {
      const form = new FormData();
      form.append("title", data.title);
      form.append("category", data.category);
      form.append("price", data.price);
      form.append("description", data.description);
      form.append("benefits", data.benefits);
      form.append("usageInstructions", data.usageInstructions);
      if (data.image && data.image[0]) {
        form.append("image", data.image[0]);
      }

      await createProduct(form);
    } catch (error) {
      toast.error("Error submitting the product data.");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Product created successfully!");
      navigate("/content-manager/products");
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
          <h3 className="mb-3">Create Product</h3>
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
                  <Label>Category</Label>
                  <select
                    className={`form-control ${classnames({ 'is-invalid': errors.category })}`}
                    {...register('category', { required: "Category is required." })}
                  >
                    <option value="">Select Category...</option>
                    <option value="vitamins">Vitamins</option>
                    <option value="proteins">Proteins</option>
                    <option value="supplements">Supplements</option>
                    <option value="herbs">Herbs</option>
                    <option value="minerals">Minerals</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.category && <small className="text-danger">{errors.category.message}</small>}
                </FormGroup>
              </Col>


              <Col md={6}>
                <FormGroup>
                  <Label>Price</Label>
                  <input
                    className={`form-control ${classnames({ 'is-invalid': errors.price })}`}
                    type="number"
                    step="0.01"
                    {...register('price', { required: true })}
                  />
                  {errors.price && <small className="text-danger">Price is required.</small>}
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label>Product Image</Label>
                  <input
                    className={`form-control ${classnames({ 'is-invalid': errors.image })}`}
                    type="file"
                    accept="image/*"
                    {...register('image', { required: "Image is required." })}
                  />
                  {errors.image && <small className="text-danger">{errors.image.message}</small>}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <Label>Description</Label>
                  <textarea
                    className={`form-control ${classnames({ 'is-invalid': errors.description })}`}
                    {...register('description', { required: 'Description is required.' })}
                  ></textarea>
                  {errors.description && <small className="text-danger">{errors.description.message}</small>}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <Label>Usage Instructions</Label>
                  <textarea
                    className={`form-control ${classnames({ 'is-invalid': errors.usageInstructions })}`}
                    {...register('usageInstructions', { required: 'Usage Instructions is required.' })}
                  ></textarea>
                  {errors.usageInstructions && <small className="text-danger">{errors.usageInstructions.message}</small>}
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormGroup>
                  <Label>Benefits</Label>
                  <textarea
                    className={`form-control ${classnames({ 'is-invalid': errors.benefits })}`}
                    {...register('benefits', { required: 'Benefits is required.' })}
                  ></textarea>
                  {errors.benefits && <small className="text-danger">{errors.benefits.message}</small>}
                </FormGroup>
              </Col>
            </Row>

            <Row className="mt-4">
              <Col>
                <Button type="submit" color="primary" className="btn-sm" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Create Product"}
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default ContentProductCreate;
