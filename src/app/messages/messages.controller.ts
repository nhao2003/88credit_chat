import { Controller } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Body, Get, Post, Patch, Delete, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId } from 'src/core/decorators';

@Controller('conversations/:conversationId/messages')
@ApiTags('messages')
@ApiBearerAuth()
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  findAll(
    @GetCurrentUserId() userId: string,
    @Param('conversationId') conversationId: string,
  ) {
    return this.messagesService.findAll(userId, conversationId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(id);
  }

  @Post()
  create(
    @GetCurrentUserId() userId: string,
    @Param('conversationId') conversationId: string,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.messagesService.create(
      userId,
      conversationId,
      createMessageDto,
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(id, updateMessageDto);
  }

  @Delete(':id')
  remove(
    @GetCurrentUserId() userId: string,
    @Param('conversationId') conversationId: string,
    @Param('id') id: string,
  ) {
    return this.messagesService.remove(userId, conversationId, id);
  }
}
