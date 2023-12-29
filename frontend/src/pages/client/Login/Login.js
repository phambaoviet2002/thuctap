import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import images from '~/assets/images';
import { signInWithGoogle } from '~/firebaseConfig';
import ErrorMessage from '~/components/ErrorMessage';
import Image from '~/components/Image/Image';
import config from '~/config';
import { loginUser } from '~/redux/apiRequest';
import { loginValidationSchema } from './validationSchema';

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(loginValidationSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const { username, password } = errors;

    const { mutate } = useMutation({
        mutationFn: (data) => loginUser(data, dispatch, navigate),
        onSuccess: (data) => {
            if (data) {
                toast.success('Đăng nhập thành công');
            } else {
                toast.error('Đăng nhập thất bại!');
            }
        },
    });

    const onSubmitForm = (data) => {
        mutate(data);
    };

    const handleSignInGoogle = () => {
        signInWithGoogle();
    };

    return (
        <section
            class="bg-gray-50 min-h-screen flex items-center justify-center"
            style={{
                backgroundImage: `url(https://wallpapersmug.com/download/2048x1152/22daba/moon-rays-red-space-sky-abstract-mountains.jpg)`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
            }}
        >
            <div class="bg-gray-100 flex rounded-2xl shadow-lg w-1/2">
                <div className="flex flex-col items-center justify-center p-12 max-sm:w-full">
                    <Image src={images.logo} alt="Logo" className="w-24 rounded-md" />
                    <h1 className="mt-6 mb-2 text-3xl font-semibold">Chào mừng trở lại</h1>
                    <p className="text-[#555] text-2xl">Vui lòng nhập thông tin chi tiết của bạn.</p>

                    <form
                        className="flex flex-col items-center w-full gap-4 mt-10"
                        onSubmit={handleSubmit(onSubmitForm)}
                    >
                        <div className="flex flex-col w-full">
                            <input
                                className="w-full text-2xl p-4 border-[1px] border-solid border-[#999] rounded-md"
                                type="text"
                                name="username"
                                placeholder="Nhập tên người dùng của bạn"
                                {...register('username')}
                            />
                            <ErrorMessage name={username} />
                        </div>
                        <div className="flex flex-col w-full">
                            <input
                                className="w-full text-2xl p-4 border-[1px] border-solid border-[#999] rounded-md"
                                type="password"
                                name="password"
                                placeholder="Nhập mật khẩu của bạn"
                                {...register('password')}
                            />
                            <ErrorMessage name={password} />
                        </div>
                        <button className="bg-[#333] border-[1px] border-solid border-[#333] text-white w-full p-4 rounded-md text-2xl hover:bg-opacity-90">
                            Đăng nhập
                        </button>
                    </form>
                    <Link class="p-3" to="/forgot-password">
                        Quên mật khẩu
                    </Link>
                    <span className="my-2 text-[#555] text-2xl">-----HOẶC-----</span>

                    <div className="flex flex-col items-center w-full gap-4">
                        <button
                            className="bg-white border-[1px] border-solid border-[#ccc] text-2xl text-[#333] w-full p-4 rounded-md hover:bg-[rgba(0,0,0,0.05)]"
                            onClick={handleSignInGoogle}
                        >
                            <FontAwesomeIcon icon={faGoogle} className="text-red-600" />
                            <span className="ml-3">Tiếp tục với Google</span>
                        </button>
                    </div>

                    <p className="mt-8 text-2xl">
                        Bạn chưa có tài khoản?{' '}
                        <Link className="font-medium" to={config.routes.register}>
                            Đăng ký
                        </Link>
                    </p>
                </div>
                <div className="flex-1 p-8 max-sm:hidden ">
                    <Image
                        className="object-cover h-full rounded-2xl"
                        src={images.backgroundLogin}
                        alt="Login background"
                    />
                </div>
            </div>
        </section>
    );
}

export default Login;
