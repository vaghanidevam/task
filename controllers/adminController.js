const User = require('../models/User');

// Admin Login Page
exports.getLogin = (req, res) => {
    res.render('admin/login', { error: null });
};

// Admin Login Authentication
exports.postLogin = async (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
        req.session.admin = true;
        res.redirect('/admin/dashboard');
    } else {
        res.render('admin/login', { error: 'Invalid credentials' });
    }
};

// Admin Dashboard with Pagination and Payout Summary
exports.getDashboard = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const users = await User.find({})
            .skip(skip)
            .limit(limit);

        const totalUsers = await User.countDocuments();
        const totalPages = Math.ceil(totalUsers / limit);

        const totalClicks = await User.aggregate([
            { $group: { _id: null, totalClicks: { $sum: "$totalClicks" } } }
        ]);

        const totalEarnings = await User.aggregate([
            { $group: { _id: null, totalCoins: { $sum: "$coins" } } }
        ]);

        const allPayouts = await User.find({}, 'payoutHistory');
        const totalPayoutAmount = allPayouts.reduce((acc, user) => {
            const userTotal = user.payoutHistory.reduce((sum, payout) => sum + payout.amount, 0);
            return acc + userTotal;
        }, 0);

        res.render('admin/dashboard', {
            users,
            totalUsers,
            totalPages,
            currentPage: page,
            totalClicks: totalClicks[0]?.totalClicks || 0,
            totalEarnings: (totalEarnings[0]?.totalCoins || 0) / 1000,
            allPayouts,
            totalPayoutAmount
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

// Remove User
exports.removeUser = async (req, res) => {
    try {
        const { userId } = req.body;
        await User.findByIdAndDelete(userId);
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to remove user");
    }
};
