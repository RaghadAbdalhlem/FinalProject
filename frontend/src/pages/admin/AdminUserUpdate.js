/* eslint-disable react-hooks/exhaustive-deps */
import { useForm } from "react-hook-form";
import { Button, Card, CardBody, Col, Form, FormGroup, Label, Row } from "reactstrap";
import classnames from "classnames";
import { useGetUserByIdQuery, useUpdateUserMutation } from "../../redux/api/userAPI";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AdminUserUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: user, isLoading: isUserLoading, isError: isUserError } = useGetUserByIdQuery(id);
  const [updateUser, { isLoading, isError, error, isSuccess, data }] = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data)
    try {
      await updateUser({ id, data });
    } catch (error) {
      toast.error("Error submitting the user data.");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "User updated successfully!");
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

  useEffect(() => {
    if (user) {
      setValue("fullName", user.fullName);
      setValue("email", user.email);
      setValue("role", user.role);
      setValue("status", user.status);
    }
  }, [user, setValue]);

  if (isUserLoading) {
    return <div>Loading...</div>;
  }

  if (isUserError) {
    return <div>Error fetching user details.</div>;
  }

  return (
    <div className="container main-view">
      <Row className="my-3">
        <Col>
          <h3 className="mb-3">Update User</h3>
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
              <Col md="6">
                <FormGroup>
                  <Label>Status</Label>
                  <select
                    className={`form-control ${classnames({ 'is-invalid': errors.status })}`}
                    {...register('status', { required: true })}
                  >
                    <option value="">Select Status...</option>
                    <option value="active">Active</option>
                    <option value="blocked">Block</option>
                  </select>
                  {errors.status && <small className="text-danger">Status is required.</small>}
                </FormGroup>
              </Col>
            </Row>

            <Row className="mt-4">
              <Col>
                <Button type="submit" color="primary" className="btn-sm" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update User"}
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminUserUpdate;
