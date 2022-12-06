const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config = require('config');
const User = require('../../models/User');

/* @route  POST api/users
 * @desc   register user
 * @access public
 */
router.post(
    '/',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check(
            'password',
            'Please enter a password with 6 or more characters'
        ).isLength({ min: 6 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        const { name, email, password } = req.body;

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            User.countDocuments({ email }, async (err, count) => {
                if (count > 0) {
                    return res.status(400).json({
                        errors: [{ msg: 'User already exists' }],
                    });
                } else {
                    const avatar = gravatar.url(email, {
                        s: '200',
                        r: 'pg',
                        d: 'mm',
                    });

                    user = new User({
                        name,
                        email,
                        password,
                        avatar,
                    });

                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(password, salt);
                    await user.save();

                    const payload = {
                        user: {
                            id: user.id,
                        },
                    };

                    jwt.sign(
                        payload,
                        config.get('jwtSecret'),
                        { expiresIn: 36000 },
                        (err, token) => {
                            if (err) throw err;
                            return res.status(200).json({ token });
                        }
                    );
                }
            });
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server error');
        }
    }
);

module.exports = router;
