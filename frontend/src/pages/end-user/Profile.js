/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Form, FormGroup, Label, Row, Col, Card, CardBody, CardHeader, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";
import classnames from "classnames";
import { useChangePasswordMutation, useUpdateProfileMutation } from '../../redux/api/userAPI';

const Profile = () => {
  const user = useSelector((state) => state.userState.user);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [updateProfile, { isLoading: isUpdating, isError: updateError, error, isSuccess, data }] = useUpdateProfileMutation();
  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);
  const [changePassword, { isLoading: isChanging, isError: passwordError, error: passwordErrorData, isSuccess: passwordSuccess }] = useChangePasswordMutation();

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      Object.keys(user).forEach((key) => {
        setValue(key, user[key]);
      });
    }
  }, [user]);

  const { register: registerModal, handleSubmit: handleSubmitModal, formState: { errors: modalErrors }, watch, reset } = useForm();

  const onSubmit = (data) => {
    updateProfile(data);
  };

  const onSubmitPassword = (data) => {
    changePassword(data);
    toggleModal();
  };

  useEffect(() => {
    if (passwordSuccess) {
      toast.success("Password changed successfully!");
      reset();
    }
    if (passwordError) {
      toast.error(passwordErrorData?.data?.message || "Failed to change password.");
    }
  }, [isChanging]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Profile updated successfully!");
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

  return (
    <div className="main-view">
      <div className="container">
        <Card>
          <CardHeader className="text-center">
            <h3>Profile Setup</h3>
          </CardHeader>
          <CardBody>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="fullName">Full Name</Label>
                    <input
                      type="text"
                      className={`form-control ${classnames({ "is-invalid": errors.fullName })}`}
                      {...register("fullName", { required: "FullName is required" })}
                    />
                    {errors.fullName && <p className="text-danger">{errors.fullName.message}</p>}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="email">Email</Label>
                    <input
                      type="text"
                      className={`form-control ${classnames({ "is-invalid": errors.email })}`}
                      {...register("email", { required: "Email is required" })}
                    />
                    {errors.email && <p className="text-danger">{errors.email.message}</p>}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="age">Age</Label>
                    <input
                      type="number"
                      className={`form-control ${classnames({ "is-invalid": errors.age })}`}
                      {...register("age", { required: "Age is required", min: { value: 1, message: "Enter a valid age" } })}
                    />
                    {errors.age && <p className="text-danger">{errors.age.message}</p>}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="gender">Gender</Label>
                    <select className={`form-control ${classnames({ "is-invalid": errors.gender })}`} {...register("gender", { required: "Gender is required" })}>
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && <p className="text-danger">{errors.gender.message}</p>}
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="height">Height (cm)</Label>
                    <input type="number" className={`form-control ${classnames({ "is-invalid": errors.height })}`} {...register("height", { required: "Height is required" })} />
                    {errors.height && <p className="text-danger">{errors.height.message}</p>}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="weight">Weight (kg)</Label>
                    <input type="number" className={`form-control ${classnames({ "is-invalid": errors.weight })}`} {...register("weight", { required: "Weight is required" })} />
                    {errors.weight && <p className="text-danger">{errors.weight.message}</p>}
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="dietPreference">Dietary Preference</Label>
                    <select className={`form-control ${classnames({ "is-invalid": errors.dietPreference })}`} {...register("dietPreference", { required: "Diet preference is required" })}>
                      <option value="">Select Dietary Preference</option>
                      <option value="keto">Keto</option>
                      <option value="vegan">Vegan</option>
                      <option value="vegetarian">Vegetarian</option>
                      <option value="mediterranean">Mediterranean</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.dietPreference && <p className="text-danger">{errors.dietPreference.message}</p>}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="goal">Goal</Label>
                    <select className={`form-control ${classnames({ "is-invalid": errors.goal })}`} {...register("goal", { required: "Goal is required" })}>
                      <option value="">Select Goal</option>
                      <option value="lose">Lose</option>
                      <option value="gain">Gain</option>
                      <option value="maintain">Maintain</option>
                    </select>
                    {errors.goal && <p className="text-danger">{errors.goal.message}</p>}
                  </FormGroup>
                </Col>
              </Row>

              <Button color="primary" type="submit" className="btn-block">Save & Continue</Button>
              <Button color="link" className="ml-2" onClick={toggleModal}>Change Password</Button>
            </Form>
          </CardBody>
        </Card>
      </div>
      {/* Change Password Modal */}
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Change Password</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmitModal(onSubmitPassword)}>
            <FormGroup>
              <Label for="currentPassword">Current Password</Label>
              <input type="password" className={`form-control ${classnames({ "is-invalid": modalErrors.currentPassword })}`} {...registerModal("currentPassword", { required: 'Current Password is required' })} />
              {modalErrors.currentPassword && <span className="text-danger">{modalErrors.currentPassword.message}</span>}
            </FormGroup>
            <FormGroup>
              <Label for="newPassword">New Password</Label>
              <input type="password" className={`form-control ${classnames({ "is-invalid": modalErrors.newPassword })}`} {...registerModal("newPassword", { required: 'New Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters long' } })} />
              {modalErrors.newPassword && <span className="text-danger">{modalErrors.newPassword.message}</span>}
            </FormGroup>
            <FormGroup>
              <Label for="confirmPassword">Confirm Password</Label>
              <input type="password" className={`form-control ${classnames({ "is-invalid": modalErrors.confirmPassword })}`} {...registerModal("confirmPassword", { required: 'Please confirm your password', validate: (value) => value === watch('newPassword') || 'Passwords do not match' })} />
              {modalErrors.confirmPassword && <span className="text-danger">{modalErrors.confirmPassword.message}</span>}
            </FormGroup>
            <ModalFooter>
              <Button color="primary" type="submit">Submit</Button>
              <Button color="secondary" onClick={toggleModal}>Cancel</Button>
            </ModalFooter>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default Profile;
