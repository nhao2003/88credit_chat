import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsUUID } from 'class-validator';

export class CreateConversationDto {
  @ApiProperty({
    type: 'UUID',
    description: 'The id of the user initiating the conversation',
    example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
  })
  @IsUUID()
  otherUserId: string;
}
