const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    // LẤY ACCESS TOKEN TỪ HEADER, REFRESH TOKEN TỪ COOKIE
    const token = req.headers.token;
    const refreshToken = req.cookies.refreshToken;
    if (token) {
        const accessToken = token.split(" ")[1];
        jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
            if (err) {
                return res.status(403).json("Token không hợp lệ!");
            }
            req.user = user;
            next();
        });
    } else {
        res.status(401).json("Bạn chưa được xác thực");
    }
};

const verifyTokenAndUserAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("Bạn không được phép thực hiện điều này!");
        }
    });
};

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("Bạn không được phép thực hiện điều này!");
        }
    });
};

module.exports = {
    verifyToken,
    verifyTokenAndUserAuthorization,
    verifyTokenAndAdmin,
};
