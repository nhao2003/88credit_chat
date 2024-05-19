import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString, IsUUID, ValidateNested } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @ApiProperty({
    example: 'Hello, this is a message',
    description: 'The message content',
  })
  text: string;

  @IsString({ each: true })
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
    },
    example: ['https://example.com/image.png'],
    description: 'An array of media URLs',
  })
  media: string[];
}
