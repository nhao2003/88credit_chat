import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsUUID } from 'class-validator';

export class CreateConversationDto {
  @ApiProperty({
    type: 'UUID',
    description: 'The id of the user initiating the conversation',
  })
  @IsUUID()
  otherUserId: string;
}
