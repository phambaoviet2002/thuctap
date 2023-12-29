import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';

const Profile = () => {
    const { id } = useParams();
    const token = useSelector((state) => state.auth.login.currentUser.accessToken);
    const [avatarUrl, setAvatarUrl] = useState('');

    const defaultAvatar =
        'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png';

    const schema = yup.object().shape({
        username: yup.string().min(5, 'Username phải hơn 5 kí tự').required('Username là bắt buộc'),
        email: yup.string().email('Vui lòng nhập đúng định dạng email').required('Email là bắt buộc'),
        avatar: yup.mixed().required('Vui lòng chọn ảnh'),
    });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        const getUserById = async () => {
            try {
                const res = await axios.get(`/v1/user/${id}`, {
                    headers: { token: `Bearer ${token}` },
                });
                setValue('username', res.data.data.username);
                setValue('email', res.data.data.email);
                setAvatarUrl(res.data.data.avatar);
            } catch (error) {
                console.log(error);
            }
        };
        getUserById();
    }, [id, token, setValue]);

    const handleSelectFile = (e) => {
        setValue('avatar', e.target.files[0]);
        setAvatarUrl(URL.createObjectURL(e.target.files[0]));
    };

    const handleUpdate = (data) =>
        axios.put(`/v1/user/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
                token: `Bearer ${token}`,
            },
        });

    const updateProfile = useMutation({
        mutationFn: (data) => handleUpdate(data),
        onSuccess: ({ data }) => {
            if (data.success) {
                toast.success('Cập nhật hồ sơ thành công');
                window.location.reload();
            }
        },
        onError: ({ response: { data } }) => {
            toast.error(data.message);
        },
    });

    return (
        <div className="w-[500px] mx-auto">
            <div className="flex flex-col items-center justify-center p-12 max-sm:w-full">
                <h1 className="mt-6 mb-2 text-3xl font-semibold">Hồ sơ</h1>
                <p className="text-[#555] text-2xl">Vui lòng nhập thông tin chi tiết của bạn.</p>
                <form
                    className="flex flex-col items-center w-full gap-4 mt-10"
                    onSubmit={handleSubmit(updateProfile.mutate)}
                    encType="multipart/form-data"
                >
                    <div className="w-full">
                        <input
                            className={`w-full text-2xl p-4 border-[1px] border-solid border-[#999] rounded-md ${
                                errors.username ? 'border-red-500' : ''
                            }`}
                            type="text"
                            name="username"
                            placeholder="Nhập tên người dùng của bạn"
                            {...register('username')}
                        />
                        <p className="text-red-500">{errors.username?.message}</p>
                    </div>

                    <div className="w-full">
                        <input
                            disabled
                            className={`w-full text-2xl p-4 border-[1px] border-solid border-[#999] rounded-md ${
                                errors.email ? 'border-red-500' : ''
                            }`}
                            type="text"
                            name="email"
                            placeholder="Nhập email của bạn"
                            {...register('email')}
                        />
                        <p className="text-red-500">{errors.email?.message}</p>
                    </div>

                    <div className="w-full">
                        <input
                            onChange={handleSelectFile}
                            className={`w-full text-2xl p-4 border-[1px] border-solid border-[#999] rounded-md ${
                                errors.avatar ? 'border-red-500' : ''
                            }`}
                            type="file"
                            name="avatar"
                            placeholder="Nhập hình đại diện của bạn"
                        />
                        <p className="text-red-500">{errors.avatar?.message}</p>
                    </div>

                    <img
                        src={avatarUrl ? avatarUrl : defaultAvatar}
                        className="w-[100px] h-[100px] object-cover rounded-full border-[1px] border-solid border-[#999]"
                        alt="Avatar"
                    />

                    <LoadingButton
                        type="submit"
                        loading={updateProfile.isLoading}
                        variant="contained"
                        style={{ padding: '10px', width: 120, marginTop: '10px', fontSize: '12px' }}
                    >
                        Gửi
                    </LoadingButton>
                </form>
            </div>
        </div>
    );
};

export default Profile;
