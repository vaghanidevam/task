const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res) => {
    res.render('user/login', { error: null });
};

exports.postLogin = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        res.redirect('/user/dashboard');
    } else {
        res.render('user/login', { error: 'Invalid username or password' });
    }
};

exports.getSignup = (req, res) => {
    res.render('user/signup', { error: null });
};

exports.postSignup = async (req, res) => {
    const { username, password, email, gender, state, interests } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    try {
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            gender,
            state,
            interests: Array.isArray(interests) ? interests : [interests]
        });
        await newUser.save();
        res.redirect('/user/login');
    } catch (err) {
        res.render('user/signup', { error: 'Username or Email already exists' });
    }
};

exports.getDashboard = async (req, res) => {
    const user = await User.findById(req.session.user._id);
    res.render('user/dashboard', { user });
};

exports.postClick = async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);

        if (user) {
            user.totalClicks += 1;
            user.coins += 1;
            await user.save();

            res.json({
                totalClicks: user.totalClicks,
                coins: user.coins
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getPayout = async (req, res) => {
    const user = await User.findById(req.session.user._id);
    res.render('user/payout', {
        error: null,
        success: null,
        coinBalance: user.coins,
        payoutHistory: user.payoutHistory
    });
};

exports.postPayout = async (req, res) => {
    const { amount, method, details } = req.body;
    const user = await User.findById(req.session.user._id);

    const inrAmount = parseInt(amount); // Amount entered in INR
    const coinAmount = inrAmount * 100; // Convert INR to coins

    if (isNaN(inrAmount) || inrAmount <= 0) {
        return res.render('user/payout', {
            error: 'Please enter a valid amount in INR.',
            success: null,
            coinBalance: user.coins,
            payoutHistory: user.payoutHistory
        });
    }

    if (inrAmount < 50) {
        return res.render('user/payout', {
            error: 'Minimum payout is 50 Rs.',
            success: null,
            coinBalance: user.coins,
            payoutHistory: user.payoutHistory
        });
    }

    if (coinAmount > user.coins) {
        return res.render('user/payout', {
            error: 'You do not have enough coins.',
            success: null,
            coinBalance: user.coins,
            payoutHistory: user.payoutHistory
        });
    }

    user.payoutHistory.push({ amount: inrAmount, method, details });
    user.coins -= coinAmount;
    await user.save();

    res.render('user/payout', {
        error: null,
        success: 'Payout request submitted successfully!',
        coinBalance: user.coins,
        payoutHistory: user.payoutHistory
    });
};
exports.getBonus = async (req, res) => {
    const userId = req.session.userId;
    try {
        const user = await User.findById(userId);
        if (user && !user.bonusReceived) {
            user.coins += 100; // Bonus amount (100 coins example)
            user.bonusReceived = true;
            await user.save();
            res.json({ coins: user.coins });
        } else {
            res.status(400).json({ error: 'Bonus already received.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
};
