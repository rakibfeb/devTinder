
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },

    lastName: {
      type: String,
      trim: true
    },

    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid');
        }
      }
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    age: {
      type: Number,
      min: 18
    },

    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },

    city: {
      type: String,
      trim: true
    },

    bio: {
      type: String
    },

    profilePic: {
      type: String,
      default:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
    },

    skills: {
      type: [String]
    },

    interests: {
      type: [String]
    },

    requests: [
      {
        fromUserId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        status: {
          type: String,
          enum: ['pending', 'accepted', 'rejected'],
          default: 'pending'
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
