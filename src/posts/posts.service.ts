import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Post } from "./post.entity";
import { User } from "src/users/user.entity";

@Injectable()
export class PostsService {
    constructor(@InjectRepository(Post) private postsRepo: Repository<Post>) {}

    async createPost(title: string, content: string, author: User): Promise<Post> {
        const post = this.postsRepo.create({ title, content, author });
        return await this.postsRepo.save(post);
    }

    async getAllPosts(): Promise<Post[]> {
        return await this.postsRepo.find({ relations: ['authoer'] });
    }
    
    async getUserPosts(userId: number): Promise<Post[]> {
        return await this.postsRepo.find({ where: { author: { id: userId } } });
    }

    async getPostById(id: number): Promise<Post> {
        const post = await this.postsRepo.findOne({ where: { id }, relations: ['author'] });
        if(!post) {
            throw new NotFoundException('Post not found');
        }
        return post;
    }

    async updatePost(id: number, title: string, content: string, userId: number): Promise<Post> {
        const post = await this.getPostById(id);
        if(post.author.id !== userId) {
            throw new NotFoundException('Unauthorised');
        }
        post.title = title;
        post.content = content;
        return await this.postsRepo.save(post);
    }

    async deletePost(id: number, userId: number): Promise<void> {
        const post = await this.getPostById(id);
        if(post.author.id !== userId) {
            throw new NotFoundException('Unauthorised');
        }
        await this.postsRepo.delete(id);
    }
}