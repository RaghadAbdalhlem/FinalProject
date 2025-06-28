/* eslint-disable react-hooks/exhaustive-deps */
import { Form, FormGroup, Label, Button, Card, CardBody } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import classnames from 'classnames';
import logo1Img from '../../assets/images/logo.png';
import { toast } from 'react-toastify';
import { useRegisterUserMutation } from '../../redux/api/authAPI';
import { useEffect } from 'react';

const ContentRegister = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();

    const [registerUser, { isLoading, isError, error, isSuccess }] = useRegisterUserMutation();
    const navigate = useNavigate();

    const onSubmit = (data) => {
        data.role = "content-manager";
        registerUser(data);
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success('Account created successfully!');
            navigate('/login');
        }

        if (isError) {
            const errorMsg = error.data && error.data.message ? error.data.message : error.data;
            toast.error(errorMsg, { position: 'top-right' });
        }
    }, [isLoading]);

    return (
        <div className="auth-wrapper px-2 auth-background">
            <div className="auth-inner py-2">
                <Card className="mb-0">
                    <CardBody>
                        <div className="mb-4 d-flex justify-content-center">
                            <img className="logo" src={logo1Img} alt="Logo" />
                        </div>

                        <div className="row mb-3">
                            <div className="col-12">
                                <h4 className="text-center">Create a Content Manager</h4>
                            </div>
                        </div>

                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <FormGroup>
                                <Label>Full Name</Label>
                                <input
                                    className={`form-control ${classnames({ 'is-invalid': errors.fullName })}`}
                                    type="text"
                                    {...register('fullName', { required: true })}
                                />
                                {errors.fullName && <small className="text-danger">Full Name is required.</small>}
                            </FormGroup>

                            <FormGroup>
                                <Label>Email</Label>
                                <input
                                    className={`form-control ${classnames({ 'is-invalid': errors.email })}`}
                                    type="email"
                                    {...register('email', { required: true })}
                                />
                                {errors.email && <small className="text-danger">Email is required.</small>}
                            </FormGroup>

                            <FormGroup>
                                <Label>Password</Label>
                                <input
                                    className={`form-control ${classnames({ 'is-invalid': errors.password })}`}
                                    type="password"
                                    {...register('password', { required: true, minLength: 6 })}
                                />
                                {errors.password && <small className="text-danger">Password must be at least 6 characters.</small>}
                            </FormGroup>

                            <FormGroup>
                                <Label>Confirm Password</Label>
                                <input
                                    className={`form-control ${classnames({ 'is-invalid': errors.confirmPassword })}`}
                                    type="password"
                                    {...register('confirmPassword', {
                                        required: true,
                                        validate: (value) => value === watch('password') || 'Passwords do not match'
                                    })}
                                />
                                {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword.message}</small>}
                            </FormGroup>

                            <div className="mt-3">
                                <Button color="orange" className="btn btn-block w-100" type="submit" disabled={isLoading}>
                                    {isLoading ? 'Creating account...' : 'REGISTER'}
                                </Button>
                            </div>
                            <div className="mt-4 d-flex justify-content-center">
                                <p>
                                    Already have an account?{' '}
                                    <Link to="/login">
                                        <span className='fw-bold'>Login</span>
                                    </Link>
                                </p>
                            </div>
                        </Form>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default ContentRegister;
