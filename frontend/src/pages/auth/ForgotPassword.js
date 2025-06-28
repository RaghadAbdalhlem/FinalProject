/* eslint-disable react-hooks/exhaustive-deps */
import { Form, FormGroup, Label, Button, Card, CardBody } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForgotPasswordMutation } from '../../redux/api/authAPI';

const ForgotPassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

    const onSubmit = async (data) => {
        try {
            await forgotPassword(data).unwrap();
            toast.success('Reset link sent to your email');
        } catch (error) {
            toast.error(error?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="auth-wrapper px-2 auth-background">
            <div className="auth-inner py-2">
                <Card className="mb-0">
                    <CardBody>
                        <h4 className="text-center mb-3">Forgot Password</h4>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <FormGroup>
                                <Label>Email</Label>
                                <input className={`form-control ${errors.email ? 'is-invalid' : ''}`} type="email" {...register('email', { required: true })} />
                                {errors.email && <small className="text-danger">Email is required.</small>}
                            </FormGroup>
                            <Button color="orange" className="w-100" type="submit" disabled={isLoading}>
                                {isLoading ? 'Sending...' : 'Send Reset Email'}
                            </Button>
                            <div className="mt-3 text-center">
                                <Link to="/login">Back to Login</Link>
                            </div>
                        </Form>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default ForgotPassword;
