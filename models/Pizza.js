const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

// create the pizza schema
const PizzaSchema = new Schema(
    {
    pizzaName: {
        type: String,
    },
    createdBy: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
        type: String,
        default: 'Large'
    },
    toppings: [],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);

// total comment count
PizzaSchema.virtual('commentCount').get(function() {
    return this.comments.length;
});

// create the pizza model
const Pizza = model('Pizza', PizzaSchema);

// export the pizza model
module.exports = Pizza;