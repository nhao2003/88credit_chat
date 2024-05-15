import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class Message {
  @Prop()
  _id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
