/* eslint-disable react-hooks/exhaustive-deps */
import { useForm } from "react-hook-form";
import { Button, Card, CardBody, Col, Form, FormGroup, Label, Row } from "reactstrap";
import classnames from "classnames";
import { useCreateUserMutation } from "../../redux/api/userAPI";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminUserCreate = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [createUser, { isLoading, isError, error, isSuccess, data }] = useCreateUserMutation();

  const onSubmit = async (data) => {
    try {
      await createUser(data);
    } catch (error) {
      toast.error("Error submitting the user data.");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "User created successfully!");
      navigate("/admin/users");
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
          <h3 className="mb-3">Create User</h3>
        </Col>
      </Row>
      <Card>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label>Full Name</Label>
                  <input
                    className={`form-control ${classnames({ 'is-invalid': errors.fullName })}`}
                    type="text"
                    {...register('fullName', { required: true })}
                  />
                  {errors.fullName && <small className="text-danger">Full Name is required.</small>}
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label>Email</Label>
                  <input
                    className={`form-control ${classnames({ 'is-invalid': errors.email })}`}
                    type="email"
                    {...register('email', { required: true })}
                  />
                  {errors.email && <small className="text-danger">Email is required.</small>}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label>Password</Label>
                  <input
                    className={`form-control ${classnames({ 'is-invalid': errors.password })}`}
                    type="password"
                    {...register('password', { required: true })}
                  />
                  {errors.password && <small className="text-danger">Password is required.</small>}
                </FormGroup>
              </Col>

              <Col md="6">
                <FormGroup>
                  <Label>Role</Label>
                  <select
                    className={`form-control ${classnames({ 'is-invalid': errors.role })}`}
                    {...register('role', { required: true })}
                  >
                    <option value="">Select Role...</option>
                    <option value="admin">Admin</option>
                    <option value="content-manager">Content Manager</option>
                    <option value="user">User</option>
                  </select>
                  {errors.role && <small className="text-danger">Role is required.</small>}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label>Status</Label>
                  <select
                    className={`form-control ${classnames({ 'is-invalid': errors.status })}`}
                    {...register('status', { required: true })}
                  >
                    <option value="">Select Status...</option>
                    <option value="active">Active</option>
                    <option value="block">Block</option>
                  </select>
                  {errors.status && <small className="text-danger">Status is required.</small>}
                </FormGroup>
              </Col>
            </Row>

            <Row className="mt-4">
              <Col>
                <Button type="submit" color="primary" className="btn-sm" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Create User"}
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminUserCreate;
