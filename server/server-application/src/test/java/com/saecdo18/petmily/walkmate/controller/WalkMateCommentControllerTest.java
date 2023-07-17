package com.saecdo18.petmily.walkmate.controller;


import com.google.gson.Gson;
import com.saecdo18.petmily.jwt.TokenProvider;
import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.walkmate.dto.WalkMateCommentDto;
import com.saecdo18.petmily.walkmate.entity.WalkMate;
import com.saecdo18.petmily.walkmate.entity.WalkMateComment;
import com.saecdo18.petmily.walkmate.mapper.WalkMateCommentMapper;
import com.saecdo18.petmily.walkmate.service.WalkMateCommentService;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@SpringBootTest
@AutoConfigureMockMvc
class WalkMateCommentControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private WalkMateCommentService walkMateCommentService;
    @Autowired
    private TokenProvider tokenProvider;
    @Autowired
    private WalkMateCommentMapper commentMapper;
    @Autowired
    private Gson gson;

    @Test
    void postComment() throws Exception{

        long walkId=1L;
        long memberId=1L;

        WalkMateCommentDto.Post post = WalkMateCommentDto.Post.builder()
                .content("내용1")
                .build();

        WalkMateCommentDto.Response response = WalkMateCommentDto.Response.builder()
                .content(post.getContent())
                .build();

        given(walkMateCommentService.createComments(Mockito.any(WalkMateCommentDto.Post.class), Mockito.anyLong(), Mockito.anyLong())).willReturn(response);

        String content = gson.toJson(post);

        ResultActions getActions =
                mockMvc.perform(
                        post("/walkmates/comments/{walk-id}", walkId)
                                .accept(MediaType.APPLICATION_JSON)
                                .header("Authorization", tokenProvider.createAccessToken(memberId))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(content)
                );

        getActions
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.content").value(response.getContent()));
    }

    @Test
    void getCommentsByWalk() throws Exception{

        long walkId = 1L;
        Member member = new Member();
        WalkMate walkMate = WalkMate.builder()
                .title("산책1")
                .build();

        List<WalkMateCommentDto.Response> responseList = new ArrayList<>();

        WalkMateComment comment1 = WalkMateComment.builder()
                .content("내용1")
                .likes(0)
                .walkMate(walkMate)
                .member(member)
                .build();

        WalkMateComment comment2 = WalkMateComment.builder()
                .content("내용2")
                .likes(0)
                .walkMate(walkMate)
                .member(member)
                .build();

        WalkMateCommentDto.Response response1 = commentMapper.commentToCommentResponseDto(comment1);
        WalkMateCommentDto.Response response2 = commentMapper.commentToCommentResponseDto(comment2);

        responseList.add(response1);
        responseList.add(response2);

        given(walkMateCommentService.findCommentsByWalkId(Mockito.anyLong())).willReturn(responseList);

        ResultActions getActions=
                mockMvc.perform(
                        get("/walkmates/comments/bywalk/{walk-id}", walkId)
                                .accept(MediaType.APPLICATION_JSON)
                                .header("Authorization", tokenProvider.createAccessToken(1L))
                );

        getActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].content").value(response1.getContent()))
                .andExpect(jsonPath("$[1].content").value(response2.getContent()));

    }
    @Test
    void getCommentsByMember() throws Exception{

        long memberId = 1L;
        Member member = new Member();
        WalkMate walkMate = WalkMate.builder()
                .title("산책1")
                .build();

        List<WalkMateCommentDto.Response> responseList = new ArrayList<>();

        WalkMateComment comment1 = WalkMateComment.builder()
                .content("내용1")
                .likes(0)
                .walkMate(walkMate)
                .member(member)
                .build();

        WalkMateComment comment2 = WalkMateComment.builder()
                .content("내용2")
                .likes(0)
                .walkMate(walkMate)
                .member(member)
                .build();

        WalkMateCommentDto.Response response1 = commentMapper.commentToCommentResponseDto(comment1);
        WalkMateCommentDto.Response response2 = commentMapper.commentToCommentResponseDto(comment2);

        responseList.add(response1);
        responseList.add(response2);

        given(walkMateCommentService.findCommentsByMemberId(Mockito.anyLong())).willReturn(responseList);

        ResultActions getActions=
                mockMvc.perform(
                        get("/walkmates/comments/bymember")
                                .accept(MediaType.APPLICATION_JSON)
                                .header("Authorization", tokenProvider.createAccessToken(1L))
                );

        getActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].content").value(response1.getContent()))
                .andExpect(jsonPath("$[1].content").value(response2.getContent()));


    }

    @Test
    void patchComment() throws Exception{

        WalkMateCommentDto.Patch patch = new WalkMateCommentDto.Patch("내용 수정");
        WalkMateCommentDto.Response response = new WalkMateCommentDto.Response("바뀔 내용");

        given(walkMateCommentService.updateComment(Mockito.any(WalkMateCommentDto.Patch.class), Mockito.anyLong(), Mockito.anyLong())).willReturn(response);

        String content = gson.toJson(patch);

        ResultActions getActions =
                mockMvc.perform(
                        patch("/walkmates/comments/{comment-id}", 1L)
                                .accept(MediaType.APPLICATION_JSON)
                                .header("Authorization", tokenProvider.createAccessToken(1L))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(String.valueOf(content))
                );

        getActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").value(response.getContent()));

    }

    @Test
    void deleteComment() throws Exception{

        long commentId = 1L;
        long memberId = 1L;

        doNothing().when(walkMateCommentService).deleteComment(commentId, memberId);

        ResultActions getActions =
                mockMvc.perform(
                        delete("/walkmates/comments/{comment-id}", commentId)
                                .accept(MediaType.APPLICATION_JSON)
                                .header("Authorization", tokenProvider.createAccessToken(1L))
                                .contentType(MediaType.APPLICATION_JSON)
                );

        getActions
                .andExpect(status().isNoContent());
    }
}
