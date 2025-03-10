import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PostsService } from './posts.service';
import { Body, Controller, Post, UseGuards , Request, Get, Param, Put, Delete } from "@nestjs/common";

@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createPost(@Body() body: { title: string; content: string }, @Request() req) {
        return this.postsService.createPost(body.title, body.content, req.user);
    }

    @Get()
    async getAllPosts() {
        return this.postsService.getAllPosts();
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getUserPosts(@Request() req) {
        return this.postsService.getUserPosts(req.user.userId);
    }

    @Get(':id')
    async getPost(@Param('id') id: string) {
        return this.postsService.getPostById(+id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updatePost(@Param('id') id: string, @Body() body: { title: string; content: string }, @Request() req) {
        return this.postsService.updatePost(+id, body.title, body.content, req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deletePost(@Param(':id') id: string, @Request() req) {
        return this.postsService.deletePost(+id, req.user.userId);
    }
}