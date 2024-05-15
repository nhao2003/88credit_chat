import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class Conversation {
  @Prop()
  _id: string;

  @Prop()
  name: string;

  @Prop()
  participants: string[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}
