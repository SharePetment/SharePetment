package com.saecdo18.serverapplication.test.post.controller;

import com.saecdo18.serverapplication.test.post.dto.PostPostDto;
import com.saecdo18.serverapplication.test.post.entity.Post;
import com.saecdo18.serverapplication.test.post.repository.PostRepository;
import com.saecdo18.serverapplication.test.post.service.PostService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/posts")
public class PostController {

    private final PostService postService;
    private final PostRepository postRepository;

    public PostController(PostService postService, PostRepository postRepository) {
        this.postService = postService;
        this.postRepository = postRepository;
    }

    @PostMapping
    public ResponseEntity postPost(@RequestBody PostPostDto postPostDto){
        Post post = new Post();
        post.setTitle(postPostDto.getTitle());
        post.setDetail(postPostDto.getDetail());
        postService.createPost(post);

        return new ResponseEntity(post, HttpStatus.CREATED);
    }

    @DeleteMapping("/{post-id}")
    public ResponseEntity deletePost(@PathVariable("post-id") long postId){
        postService.deletePost(postId);

        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }
}
