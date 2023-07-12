package com.saecdo18.petmily.walkmate.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.saecdo18.petmily.jwt.TokenProvider;
import com.saecdo18.petmily.member.dto.MemberDto;
import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.member.service.MemberService;
import com.saecdo18.petmily.walkmate.dto.WalkMateCommentDto;
import com.saecdo18.petmily.walkmate.dto.WalkMateDto;
import com.saecdo18.petmily.walkmate.entity.WalkMate;
import com.saecdo18.petmily.walkmate.entity.WalkMateComment;
import com.saecdo18.petmily.walkmate.mapper.WalkMateCommentMapper;
import com.saecdo18.petmily.walkmate.mapper.WalkMateMapper;
import com.saecdo18.petmily.walkmate.service.WalkMateCommentService;
import com.saecdo18.petmily.walkmate.service.WalkMateService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
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
                        post("/walkmates/comments/{walk-id}/{member-id}", walkId, memberId)
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

        List<WalkMateCommentDto.Response> responseList = new ArrayList<>();

        WalkMateComment comment1 = new WalkMateComment("내용1", Mockito.any(Member.class));
        WalkMateComment comment2 = new WalkMateComment("내용2", Mockito.any(Member.class));

        WalkMateCommentDto.Response response1 = commentMapper.commentToCommentResponseDto(comment1);
        WalkMateCommentDto.Response response2 = commentMapper.commentToCommentResponseDto(comment2);

        responseList.add(response1);
        responseList.add(response2);

//        given(walkMateCommentService.findCommentsByWalkId(Mockito.anyLong())).willReturn(responseList);

    }
//
//    @Test
//    void getCommentsByMember()
//
//    @Test
//    void patchComment()
//
    @Test
    void deleteComment() throws Exception{

        long commentId = 1L;
        long memberId = 1L;

        doNothing().when(walkMateCommentService).deleteComment(commentId, memberId);

        ResultActions getActions =
                mockMvc.perform(
                        delete("/walkmates/comments/{comment-id}/{member-id}", commentId, memberId)
                                .accept(MediaType.APPLICATION_JSON)
                                .header("Authorization", tokenProvider.createAccessToken(1L))
                                .contentType(MediaType.APPLICATION_JSON)
                );

        getActions
                .andExpect(status().isNoContent());
    }
}
