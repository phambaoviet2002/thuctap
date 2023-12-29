import * as Yup from 'yup';

export const registerValidationSchema = Yup.object().shape({
    username: Yup.string().required('Tên người dùng là bắt buộc'),
    email: Yup.string().required('Email là bắt buộc').email('Email không hợp lệ'),
    password: Yup.string().required('Mật khẩu là bắt buộc'),
});
