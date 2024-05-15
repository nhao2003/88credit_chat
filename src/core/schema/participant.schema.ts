import { Prop, Schema } from '@nestjs/mongoose';
import { isUUID } from 'class-validator';

@Schema()
export class Participant {
  @Prop({
    validate: {
      validator: (v) => {
        return isUUID(v);
      },
      message: (props) => `${props.value} is not a valid UUID!`,
    },
  })
  _id: string;

  @Prop({
    default: new Date(),
  })
  joinedAt: Date;
}
