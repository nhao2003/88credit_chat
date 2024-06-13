import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { ConversationsService } from './conversations.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId } from 'src/core/decorators';
import { GetParamId } from 'src/core/decorators/get-param-id.decorator';
import { ConversationsGateway } from './conversations.gateway';
import { WsReponseType } from 'src/common/types';

@Controller('conversations')
@ApiTags('conversations')
@ApiBearerAuth()
export class ConversationsController {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly conversationsGateway: ConversationsGateway,
  ) {}

  @Get()
  findAll(@GetCurrentUserId() userId: string) {
    return this.conversationsService.findAll(userId);
  }

  @Get(':id')
  findOne(@GetCurrentUserId() userId: string, @GetParamId() id: string) {
    return this.conversationsService.findOne(userId, id);
  }

  @Post()
  async getOrCreateConversation(
    @GetCurrentUserId() userId: string,
    @Body() createConversationDto: CreateConversationDto,
  ) {
    console.log(userId, createConversationDto);
    const result = await this.conversationsService.getOrCreateConversation(
      userId,
      createConversationDto,
    );
    this.conversationsGateway.notifyConversation(
      result.isNew ? WsReponseType.NEW : WsReponseType.UPDATE,
      result.conversation,
    );
    return result.conversation;
  }

  @Patch(':id')
  async update(
    @GetParamId() id: string,
    @GetCurrentUserId() userId: string,
    @Body() updateConversationDto: UpdateConversationDto,
  ) {
    // return this.conversationsService.update(userId, id, updateConversationDto);
    const conversation = await this.conversationsService.update(
      userId,
      id,
      updateConversationDto,
    );
    return conversation;
  }

  @Delete(':id')
  remove(@GetParamId() id: string, @GetCurrentUserId() userId: string) {
    return this.conversationsService.remove(userId, id);
  }
}
