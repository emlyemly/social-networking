const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const request = require('request');

const config = require('config');
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
        console.error(err.message);

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
        console.log('hello');
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
        console.error(err.message);
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
            console.error(err.message);
            return res.status(500).send(err.message);
        }
    }
);

/* @route  DELETE api/profiles
 * @desc   delete profile, user, and posts
 * @access private
 */
router.delete('/', auth, async (req, res) => {
    try {
        await Profile.findOneAndRemove({ user: req.user.id });
        await User.findOneAndRemove({ _id: req.user.id });

        return res.json({ msg: 'Profile and user deleted' });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
});

/* @route  PUT api/profiles/experience
 * @desc   add experience to profile
 * @access private
 */
router.put(
    '/experience',
    [
        auth,
        [
            check('title', 'Title is required').not().isEmpty(),
            check('company', 'Company is required').not().isEmpty(),
            check('from', 'From is required').not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, company, location, from, to, current, description } =
            req.body;

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description,
        };

        try {
            const profile = await Profile.findOne({
                user: req.user.id,
            });

            profile.experience.unshift(newExp);
            await profile.save();
            return res.json(profile);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server error');
        }
    }
);

/* @route  DELETE api/profiles/experience/:exp_id
 * @desc   delete experience to profile
 * @access private
 */
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id,
        });

        const removeIndex = profile.experience
            .map((item) => item.id)
            .indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);
        await profile.save();
        return res.json(profile);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
});

/* @route  PUT api/profiles/education
 * @desc   add education to profile
 * @access private
 */
router.put(
    '/education',
    [
        auth,
        [
            check('school', 'School is required').not().isEmpty(),
            check('degree', 'Degree is required').not().isEmpty(),
            check('fieldOfStudy', 'Field of study is required').not().isEmpty(),
            check('from', 'From is required').not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { school, degree, fieldOfStudy, from, to, current, description } =
            req.body;

        const newEdu = {
            school,
            degree,
            fieldOfStudy,
            from,
            to,
            current,
            description,
        };

        try {
            const profile = await Profile.findOne({
                user: req.user.id,
            });

            profile.education.unshift(newEdu);
            await profile.save();
            return res.json(profile);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server error');
        }
    }
);

/* @route  DELETE api/profiles/education/:edu_id
 * @desc   delete education to profile
 * @access private
 */
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id,
        });

        const removeIndex = profile.education
            .map((item) => item.id)
            .indexOf(req.params.exp_id);

        profile.education.splice(removeIndex, 1);
        await profile.save();
        return res.json(profile);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
});

/* @route  GET api/profiles/github/:username
 * @desc   get user repos
 * @access public
 */
router.get('/github/:username', async (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${
                req.params.username
            }/repos?per_page=5&sort=created:asc&client_id=${config.get(
                'githubClientId'
            )}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' },
        };

        request(options, (error, response, body) => {
            if (error) console.log(error);

            if (response.statusCode !== 200) {
                return res.status(404).json({
                    msg: 'No github profile found',
                });
            }

            return res.json(JSON.parse(body));
        });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
});

module.exports = router;
