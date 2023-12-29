import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as Yup from 'yup';

import ErrorMessage from '~/components/ErrorMessage';
import config from '~/config';
import './style.css';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const schema = Yup.object().shape({
        password: Yup.string()
            .required('Mật khẩu là bắt buộc')
            .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
            .max(16, 'Vui lòng nhập tối đa 16 ký tự'),
        confirmPassword: Yup.string()
            .required('Xác nhận mật khẩu là bắt buộc')
            .oneOf([Yup.ref('password')], 'Xác nhận mật khẩu phải trùng với mật khẩu'),
    });

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema),
    });

    const { password, confirmPassword } = errors;

    const validatePassword = (password, confirmPassword) => {
        if (password !== confirmPassword) {
            toast.error('Mật khẩu và mật khẩu xác nhận không khớp');
            return false;
        }
        return true;
    };

    const onSubmitForm = async ({ password, confirmPassword }) => {
        if (!validatePassword(password, confirmPassword)) return;
        try {
            await axios.post('/v1/auth/reset-password', { token, password });
            toast.success('Đặt lại mật khẩu thành công');
            navigate(config.routes.login);
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center max-w-4xl p-8 mx-auto mt-40 bg-white rounded-xl lg:shadow-lg">
            <h1 className="mt-6 mb-4 text-4xl font-semibold">Đặt lại mật khẩu của bạn</h1>
            <p className="text-[#555] text-2xl">Vui lòng nhập mật khẩu mới của bạn.</p>

            <form className="w-full p-10 mt-4" onSubmit={handleSubmit(onSubmitForm)}>
                <div className="flex flex-col w-full gap-4">
                    <div>
                        <input
                            className="w-full text-2xl p-4 border-[1px] border-solid border-[#999] rounded-md"
                            type="password"
                            name="password"
                            {...register('password')}
                            placeholder="Nhập mật khẩu mới của bạn"
                        />
                        <ErrorMessage name={password} />
                    </div>
                    <div>
                        <input
                            className="w-full text-2xl p-4 border-[1px] border-solid border-[#999] rounded-md"
                            type="password"
                            name="confirmPassword"
                            {...register('confirmPassword')}
                            placeholder="Xác nhận mật khẩu của bạn"
                        />
                        <ErrorMessage name={confirmPassword} />
                    </div>
                    <button className="w-full text-2xl p-4 bg-[#2564CF] text-white font-medium border-[1px] border-solid border-[#999] rounded-md hover:opacity-80">
                        Đặt lại
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ResetPassword;
