const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');

/* @route  POST api/posts
 * @desc   create a post
 * @access private
 */
router.post(
    '/',
    [auth, [check('text', 'Text is required').not().isEmpty()]],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                msg: errors.array(),
            });
        }

        try {
            const user = await User.findById(req.user.id).select('-password');
            const newPost = new Post({
                user: req.user.id,
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
            });

            const post = await newPost.save();
            return res.json(post);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server error');
        }
    }
);

/* @route  GET api/posts
 * @desc   get all posts
 * @access private
 */
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        return res.json(posts);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
});

/* @route  GET api/posts/:post_id
 * @desc   get post by id
 * @access private
 */
router.get('/:post_id', auth, async (req, res) => {
    try {
        Post.countDocuments({ _id: req.params.post_id }, async (err, count) => {
            if (count > 0) {
                const post = await Post.findById(req.params.post_id);
                return res.json(post);
            } else {
                return res.status(404).send('Post not found');
            }
        });
    } catch (err) {
        console.error(err.message);

        if (err.kind === 'ObjectId') {
            return res.status(404).send('Post not found');
        }

        return res.status(500).send('Server error');
    }
});

/* @route  DELETE api/posts/:post_id
 * @desc   delete post by id
 * @access private
 */
router.delete('/:post_id', auth, async (req, res) => {
    try {
        Post.countDocuments({ _id: req.params.post_id }, async (err, count) => {
            if (count > 0) {
                const post = await Post.findById(req.params.post_id);

                if (post.user.toString() !== req.user.id) {
                    return res.status(401).send('User not authorized');
                }

                await post.remove();
                return res.json({ msg: 'Post removed' });
            } else {
                return res.status(404).send('Post not found');
            }
        });
    } catch (err) {
        console.error(err.message);

        if (err.kind === 'ObjectId') {
            return res.status(404).send('Post not found');
        }

        return res.status(500).send('Server error');
    }
});

/* @route  PUT api/posts/like/:like_id
 * @desc   like a post
 * @access private
 */
router.put('/like/:like_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.like_id);

        if (
            post.likes.filter((like) => like.user.toString() === req.user.id)
                .length > 0
        ) {
            return res.status(400).json({ msg: 'Post already liked' });
        }

        post.likes.unshift({ user: req.user.id });
        post.save();
        return res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
});

/* @route  PUT api/posts/like/:like_id
 * @desc   unlike a post
 * @access private
 */
router.put('/unlike/:unlike_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.unlike_id);
        console.log(post);

        console.log(
            post.likes.filter((like) => like.user.toString() === req.user.id)
                .length
        );
        if (
            post.likes.filter((like) => like.user.toString() === req.user.id)
                .length === 0
        ) {
            return res.status(400).json({ msg: 'Post has not yet been liked' });
        }

        const removeIndex = post.likes
            .map((like) => like.user.toString())
            .indexOf(req.user.unlike_id);

        post.likes.splice(removeIndex, 1);
        post.save();
        return res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
});

/* @route  POST api/posts/comment/:comment_id
 * @desc   comment on a post
 * @access private
 */
router.post(
    '/comment/:comment_id',
    [auth, [check('text', 'Text is required').not().isEmpty()]],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                msg: errors.array(),
            });
        }

        try {
            const user = await User.findById(req.user.id).select('-password');
            const post = await Post.findById(req.params.comment_id);
            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id,
            };

            post.comments.unshift(newComment);
            post.save();

            return res.json(post.comments);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server error');
        }
    }
);

/* @route  DELETE api/posts/comment/:comment_id
 * @desc   delete a comment
 * @access private
 */
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        console.log(post);
        const comment = post.comments.find(
            (comment) => (comment.id = req.params.comment_id)
        );

        if (!comment) {
            return res.status(404).json({ msg: 'Comment does not exist' });
        }

        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        post.comments = post.comments.filter(
            ({ id }) => id !== req.params.comment_id
        );

        post.save();
        return res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
});

module.exports = router;
