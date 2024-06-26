import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, isValidObjectId } from 'mongoose';
import { Conversation } from './conversation.schema';
import { isUUID } from 'class-validator';

class Content {
  @Prop({
    type: String,
    required: false,
  })
  text?: string;

  @Prop({
    type: [String],
    required: false,
    default: null,
  })
  media?: string[];
}

@Schema({
  id: true,
  versionKey: false,
  timestamps: true,
})
export class Message {
  @Prop({
    ref: 'Conversation',
    type: Types.ObjectId,
    required: true,
  })
  conversation: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    validate: {
      validator: (v) => isUUID(v),
      message: (props) => `${props.value} is not a valid UUID!`,
    },
  })
  senderId: Types.UUID;

  @Prop({
    type: Content,
    required: true,
    validate: {
      validator: (v) => {
        return v.text || v.media;
      },
      message: () => 'Content must have either text or media!',
    },
  })
  content: Content;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
