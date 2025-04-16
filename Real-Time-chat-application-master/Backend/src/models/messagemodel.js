import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      default: null
    },
    image: {
      type: String,
      default: null
    },
    readBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: []
    },
    delivered: {
      type: Boolean,
      default: false
    },
    read: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

messageSchema.index({ senderId: 1, receiverId: 1 });
messageSchema.index({ createdAt: -1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;