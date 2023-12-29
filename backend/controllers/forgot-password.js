const User = require("../models/User");
const sendMail = require("../helpers/sendMail");

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Cần phải có email" });
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Không tìm thấy email" });
        const { passwordReset } = user.createChangePasswordToken();
        await user.save();
        const mailOptions = {
            from: {
                name: "Todo App",
                address: "Todoapp@gmail.com",
            }, // sender address
            to: user.email, // list of receivers
            subject: "Khôi phục mật khẩu", // Subject line
            html: `<table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
      style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
      <tr>
          <td>
              <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                  align="center" cellpadding="0" cellspacing="0">
                  <tr>
                      <td style="height:80px;">&nbsp;</td>
                  </tr>
                  <tr>
                      <td style="text-align:center;">
                        <a href="http://localhost:3000" title="logo" target="_blank">
                          <img width="60" src="https://res-1.cdn.office.net/todo/1413857_2.108.1/icons/logo.png" title="logo" alt="logo">
                        </a>
                      </td>
                  </tr>
                  <tr>
                      <td style="height:20px;">&nbsp;</td>
                  </tr>
                  <tr>
                      <td>
                          <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                              style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                              <tr>
                                  <td style="height:40px;">&nbsp;</td>
                              </tr>
                              <tr>
                                  <td style="padding:0 35px;">
                                      <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Bạn đã yêu cầu đặt lại mật khẩu của mình</h1>
                                      <span
                                          style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                      <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                      Chúng tôi không thể đơn giản gửi cho bạn mật khẩu cũ của bạn. Một liên kết duy nhất để đặt lại mật khẩu đã được tạo cho bạn. Để đặt lại mật khẩu của bạn, hãy nhấp vào liên kết sau và làm theo hướng dẫn.
                                      </p>
                                      <a href="http://localhost:3000/reset-password?token=${passwordReset}"
                                          style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Đặt lại mật khẩu</a>
                                  </td>
                              </tr>
                              <tr>
                                  <td style="height:40px;">&nbsp;</td>
                              </tr>
                          </table>
                      </td>
                  <tr>
                      <td style="height:20px;">&nbsp;</td>
                  </tr>
                  <tr>
                      <td style="height:80px;">&nbsp;</td>
                  </tr>
              </table>
          </td>
      </tr>
  </table>`, // html body
        };
        sendMail(mailOptions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifyPasswordToken = async (req, res, next) => {
    try {
        const { token, password } = req.body;

        console.log(token);

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });
        console.log(user);
        if (!user)
            return res.status(400).json({
                message: "Mã token không hợp lệ hoặc đã hết hạn. Vui lòng thử lại",
            });

        (user.resetPasswordToken = undefined), (user.resetPasswordExpires = undefined), (user.password = password);
        await user.save();
        console.log("cập nhật thành công");

        return res.status(200).json({ message: "cập nhật thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { forgotPassword, verifyPasswordToken };
