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

@Controller('conversations')
@ApiTags('conversations')
@ApiBearerAuth()
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get()
  findAll(@GetCurrentUserId() userId: string) {
    return this.conversationsService.findAll(userId);
  }

  @Get(':id')
  findOne(@GetCurrentUserId() userId: string, @Param('id') id: string) {
    return this.conversationsService.findOne(userId, id);
  }

  @Post()
  create(
    @GetCurrentUserId() userId: string,
    @Body() createConversationDto: CreateConversationDto,
  ) {
    return this.conversationsService.getOrCreateConversation(
      userId,
      createConversationDto,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @GetCurrentUserId() userId: string,
    @Body() updateConversationDto: UpdateConversationDto,
  ) {
    return this.conversationsService.update(userId, id, updateConversationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetCurrentUserId() userId: string) {
    return this.conversationsService.remove(userId, id);
  }
}
