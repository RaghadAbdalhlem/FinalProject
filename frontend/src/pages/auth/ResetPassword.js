/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { Form, FormGroup, Label, Button, Card, CardBody } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useResetPasswordMutation } from '../../redux/api/authAPI';

const ResetPassword = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [resetPassword, { isLoading, isSuccess }] = useResetPasswordMutation();
    
    const onSubmit = async (data) => {
        try {
            await resetPassword({ ...data, token: searchParams.get('token') }).unwrap();
            toast.success('Password updated successfully');
            navigate('/login');
        } catch (error) {
            toast.error(error?.data?.message || 'Something went wrong');
        }
    };

    useEffect(() => {
        if (isSuccess) navigate('/login');
    }, [isSuccess]);

    return (
        <div className="auth-wrapper px-2 auth-background">
            <div className="auth-inner py-2">
                <Card className="mb-0">
                    <CardBody>
                        <h4 className="text-center mb-3">Reset Password</h4>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <FormGroup>
                                <Label>New Password</Label>
                                <input className={`form-control ${errors.password ? 'is-invalid' : ''}`} type="password" {...register('password', { required: true })} />
                                {errors.password && <small className="text-danger">Password is required.</small>}
                            </FormGroup>
                            <FormGroup>
                                <Label>Confirm Password</Label>
                                <input className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} type="password" {...register('confirmPassword', { required: true, validate: value => value === watch('password') })} />
                                {errors.confirmPassword && <small className="text-danger">Passwords must match.</small>}
                            </FormGroup>
                            <Button color="orange" className="w-100" type="submit" disabled={isLoading}>
                                {isLoading ? 'Updating...' : 'Set New Password'}
                            </Button>
                        </Form>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default ResetPassword;
