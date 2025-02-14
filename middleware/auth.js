module.exports = {
    isLoggedIn: (req, res, next) => {
        if (req.session.user) {
            next();
        } else {
            res.redirect('/user/login');
        }
    },
    isAdmin: (req, res, next) => {
        if (req.session.admin) {
            next();
        } else {
            res.redirect('/admin/login');
        }
    },
};