const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

/* @route  GET api/profiles
 * @desc   get all profiles
 * @access public
 */
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', [
            'name',
            'avatar',
        ]);
        return res.json(profiles);
    } catch (err) {
        console.log(err.message);
        return res.status(500).send('Server error');
    }
});

/* @route  GET api/profiles/user
 * @desc   get profile by user id
 * @access public
 */
router.get('/user/:user_id', async (req, res) => {
    try {
        Profile.countDocuments(
            { user: req.params.user_id },
            async (err, count) => {
                if (count > 0) {
                    const profile = await Profile.findOne({
                        user: req.params.user_id,
                    }).populate('user', ['name', 'avatar']);

                    return res.json(profile);
                } else {
                    return res.status(400).json({ msg: 'Profile not found' });
                }
            }
        );
    } catch (err) {
        console.log(err.message);

        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' });
        }

        return res.status(500).send('Server error');
    }
});

/* @route  GET api/profiles/me
 * @desc   get user's profile
 * @access private
 */
router.get('/me', auth, async (req, res) => {
    try {
        Profile.countDocuments({ user: req.user.id }, async (err, count) => {
            if (count > 0) {
                const profile = await Profile.findOne({
                    user: req.user.id,
                }).populate('user', ['name', 'avatar']);

                return res.json({ profile });
            } else {
                return res
                    .status(400)
                    .json({ msg: 'There is no profile for this user' });
            }
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500).send('Server error');
    }
});

/* @route  POST api/profiles
 * @desc   create or update a user profile
 * @access private
 */
router.post(
    '/',
    [
        auth,
        [
            check('status', 'Status is required').not().isEmpty(),
            check('skills', 'Skills are required').not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        const {
            company,
            website,
            location,
            bio,
            status,
            githubUsername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin,
        } = req.body;
        const profileFields = {};

        profileFields.user = req.user.id;

        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubUsername) profileFields.githubUsername = githubUsername;
        if (skills)
            profileFields.skills = skills
                .split(',')
                .map((skill) => skill.trim());

        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (facebook) profileFields.social.facebook = facebook;
        if (twitter) profileFields.social.twitter = twitter;
        if (instagram) profileFields.social.instagram = instagram;
        if (linkedin) profileFields.social.linkedin = linkedin;

        try {
            Profile.countDocuments(
                { user: req.user.id },
                async (err, count) => {
                    if (count > 0) {
                        const profile = await Profile.findOneAndUpdate(
                            { user: req.user.id },
                            { $set: profileFields },
                            { new: true }
                        );

                        return res.json(profile);
                    } else {
                        const profile = new Profile(profileFields);

                        await profile.save();
                        return res.json(profile);
                    }
                }
            );
        } catch (err) {
            console.log(err.message);
            return res.status(500).send(err.message);
        }
    }
);

module.exports = router;
