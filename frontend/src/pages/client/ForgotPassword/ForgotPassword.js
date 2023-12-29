import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';

import ErrorMessage from '~/components/ErrorMessage';

const ForgotPassword = () => {
    const schema = Yup.object().shape({
        email: Yup.string().required('Email là bắt buộc').email('Email không hợp lệ'),
    });

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema),
        defaultValues: {
            email: '',
        },
    });

    const { email } = errors;

    const onSubmitForm = async ({ email }) => {
        try {
            toast.success('Vui lòng kiểm tra email của bạn');
            await axios.post(
                'v1/auth/forgot-password',
                { email },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className="flex flex-col justify-center h-screen align-items ">
            <div className="flex flex-col items-center justify-center p-8 ">
                <div className="flex flex-col items-center w-full">
                    <div className="flex flex-col items-center gap-4 mt-10 w-2/5 p-10 pl-12 pr-12 border-1 rounded-lg shadow-[8px_8px_50px_rgba(3,0,71,0.09)] ">
                        <h1 className="mt-6 mb-2 text-3xl font-semibold">Quên mật khẩu</h1>
                        <p className="text-[#555] text-2xl">Vui lòng nhập email.</p>
                        <div className="w-full">
                            <input
                                className="w-full text-2xl p-4 border-[1px] border-solid border-[#999] rounded-md"
                                type="text"
                                name="email"
                                {...register('email')}
                                placeholder="Nhập email của bạn"
                            />
                            <ErrorMessage name={email} />
                        </div>
                        <button
                            onClick={handleSubmit(onSubmitForm)}
                            className="w-full text-2xl p-4 bg-[#2564CF] text-white font-medium border-[1px] border-solid border-[#999] rounded-md hover:opacity-80"
                        >
                            Gửi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
