const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const ReplySchema = new Schema ({
    // set custom id to avoid confusion with parent comment
    replyId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
    },
    replyBody: {
        type: String,
    },
    writtenBy: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal),
    },
},
{
toJSON: {
    getters: true,
}
})
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
    },
    replies: [ReplySchema],
},
{
toJSON: {
    virtuals: true,
    getters: true,
},
id: false,
});

// total reply count
CommentSchema.virtual('replyCount').get(function() {
    return this.replies.length;
});

// create the model
const Comment = model('Comment', CommentSchema);

module.exports = Comment;