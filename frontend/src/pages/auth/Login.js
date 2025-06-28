/* eslint-disable react-hooks/exhaustive-deps */
import { Form, FormGroup, Label, Button, Card, CardBody } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import classnames from 'classnames';
import logo1Img from '../../assets/images/logo.png';
import { toast } from 'react-toastify';
import { useLoginUserMutation } from '../../redux/api/authAPI';
import { useEffect } from 'react';
import { getHomeRouteForLoggedInUser, getUserData } from '../../utils/Utils';

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const [loginUser, { isLoading, isError, error, isSuccess }] = useLoginUserMutation();
    const navigate = useNavigate();

    const onSubmit = (data) => {
        loginUser(data);
    };

    useEffect(() => {
        if (isSuccess) {
            const user = getUserData();
            toast.success('You successfully logged in');
            navigate(getHomeRouteForLoggedInUser(user.role));
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
                                <h4 className="text-center">Login to Your Account</h4>
                            </div>
                        </div>

                        <Form onSubmit={handleSubmit(onSubmit)}>
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
                                    {...register('password', { required: true })}
                                />
                                {errors.password && <small className="text-danger">Password is required.</small>}
                            </FormGroup>

                            {/* Forgot Password Link */}
                            <div className="d-flex justify-content-end mb-3">
                                <Link to="/forgot-password" className="forgot-password-link">
                                    Forgot Password?
                                </Link>
                            </div>

                            <div className="mt-3">
                                <Button color="orange" className="btn btn-block w-100" type="submit" disabled={isLoading}>
                                    {isLoading ? 'Logging in...' : 'LOGIN'}
                                </Button>
                            </div>
                            <div className="mt-4 text-center">
                                <p className="mb-3 text-muted">Don’t have an account?</p>
                                <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                                    <Link
                                        to="/register-content"
                                        className="text-decoration-none border border-primary rounded-pill px-4 py-2 text-primary fw-semibold 
                      hover-bg-primary hover-text-white transition"
                                    >
                                        Content Manager
                                    </Link>
                                    <Link
                                        to="/register-user"
                                        className="text-decoration-none border border-success rounded-pill px-4 py-2 text-success fw-semibold 
                      hover-bg-success hover-text-white transition"
                                    >
                                        User
                                    </Link>
                                </div>
                            </div>

                        </Form>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default Login;
