import { Controller } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Body, Get, Post, Patch, Delete, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId } from 'src/core/decorators';
import { ConversationsGateway } from '../conversations/conversations.gateway';
import { MessagesGateway } from './messages.gateway';
import { WsReponseType } from 'src/common/types';

@Controller('conversations/:conversationId/messages')
@ApiTags('messages')
@ApiBearerAuth()
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly conversationsGateway: ConversationsGateway,
    private readonly messagesGateway: MessagesGateway,
  ) {}

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
  async create(
    @GetCurrentUserId() userId: string,
    @Param('conversationId') conversationId: string,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    const message = await this.messagesService.create(
      userId,
      conversationId,
      createMessageDto,
    );
    this.messagesGateway.notifyMessage(WsReponseType.NEW, message);
    return message;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    // return this.messagesService.update(id, updateMessageDto);
    const res = await this.messagesService.update(id, updateMessageDto);
    this.messagesGateway.notifyMessage(WsReponseType.UPDATE, res);
  }

  @Delete(':id')
  async remove(
    @GetCurrentUserId() userId: string,
    @Param('conversationId') conversationId: string,
    @Param('id') id: string,
  ) {
    const res = await this.messagesService.remove(userId, conversationId, id);
    this.messagesGateway.notifyMessage(WsReponseType.DELETE, res);
    return res;
  }
}
