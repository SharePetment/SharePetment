package com.saecdo18.serverapplication.test.post.repository;

import com.saecdo18.serverapplication.test.post.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
}
