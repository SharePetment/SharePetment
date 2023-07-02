package com.saecdo18.serverapplication.swagger.swaggertest.controller;

import com.saecdo18.serverapplication.swagger.swaggertest.dto.UserPostDto;
import com.saecdo18.serverapplication.swagger.swaggertest.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;


@RestController
public class UserController {
    private List<User> members = new ArrayList<>();
    private int id = 0;



    // User 추가
    @PostMapping("/users")
    @Operation(summary = "Post User", description = "회원 가입")
    public ResponseEntity postUser(@RequestBody UserPostDto postDto) {
        members.add( new User(id, postDto.getNickname(), postDto.getPassword()) );
        id ++;
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    // User 조회
    @GetMapping("/users/{member-id}")
    @Operation(summary = "Get User", description = "회원 조회")
    public ResponseEntity findUser(@PathVariable("member-id") int id) {
        return new ResponseEntity(members.get(id),HttpStatus.OK);
    }

    // User 전체 조회
    @GetMapping("/users")
    @Operation(summary = "Get Users", description = "모든 회원 조회")
    public List<User> findUsers() {
        return members;
    }
}
