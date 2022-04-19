const { Schema, model } = require('mongoose');

// create the comment schema
const CommentSchema = new Schema ({
    writtenBy: {
        type: String
    },
    commentBody: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// create the model
const Comment = model('Comment', CommentSchema);

module.exports = Comment;