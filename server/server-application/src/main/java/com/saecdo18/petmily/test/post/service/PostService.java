package com.saecdo18.petmily.test.post.service;

import com.saecdo18.petmily.test.post.entity.Post;
import com.saecdo18.petmily.test.post.repository.PostRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public Post createPost(Post post){
        return postRepository.save(post);
    }

    public Post findPost(long postId){
        Optional<Post> optionalPost = postRepository.findById(postId);
        Post findPost = optionalPost.orElseThrow();

        return findPost;
    }

    public List<Post> findPosts(){
        return postRepository.findAll();
    }

    public void deletePost(long postId){
        Post findPost = findPost(postId);
        postRepository.delete(findPost);
    }
}
