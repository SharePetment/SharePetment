package com.saecdo18.petmily.walkmate.controller;


import com.google.gson.Gson;
import com.saecdo18.petmily.jwt.TokenProvider;
import com.saecdo18.petmily.member.dto.MemberDto;
import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.walkmate.dto.WalkMateCommentDto;
import com.saecdo18.petmily.walkmate.dto.WalkMateDto;
import com.saecdo18.petmily.walkmate.entity.WalkMate;
import com.saecdo18.petmily.walkmate.entity.WalkMateComment;
import com.saecdo18.petmily.walkmate.mapper.WalkMateCommentMapper;
import com.saecdo18.petmily.walkmate.mapper.WalkMateMapper;
import com.saecdo18.petmily.walkmate.service.WalkMateCommentService;
import com.saecdo18.petmily.walkmate.service.WalkMateService;
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
class WalkMateControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private WalkMateService walkMateService;
    @MockBean
    private WalkMateCommentService walkMateCommentService;
    @Autowired
    private TokenProvider tokenProvider;
    @Autowired
    private WalkMateMapper walkMateMapper;
    @Autowired
    private WalkMateCommentMapper commentMapper;
    @Autowired
    private Gson gson;


    @Test
    void postWalk() throws Exception {

        WalkMateDto.Post post = new WalkMateDto.Post("제목 등록", "내용 등록");
        WalkMateDto.Response response = new WalkMateDto.Response(post.getTitle(), post.getContent());

        given(walkMateService.createWalk(Mockito.any(WalkMate.class), Mockito.anyLong())).willReturn(response);

        String content = gson.toJson(post);

        ResultActions getActions =
                mockMvc.perform(
                        post("/walkmates")
                                .accept(MediaType.APPLICATION_JSON)
                                .header("Authorization", tokenProvider.createAccessToken(1L))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(content)
                );

        getActions
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value(response.getTitle()))
                .andExpect(jsonPath("$.content").value(response.getContent()));
    }

    @Test
    void updateWalk() throws Exception {

        WalkMateDto.Patch patch = new WalkMateDto.Patch("제목 수정", "내용 수정");
        WalkMateDto.Response response = new WalkMateDto.Response("원래 제목", "원래 내용");

        given(walkMateService.updateWalkMate(Mockito.any(WalkMateDto.Patch.class), Mockito.anyLong(), Mockito.anyLong()))
                .willReturn(response);


        String content = gson.toJson(patch);

        ResultActions getActions =
                mockMvc.perform(
                        patch("/walkmates/{walk-id}", 1L)
                                .accept(MediaType.APPLICATION_JSON)
                                .header("Authorization", tokenProvider.createAccessToken(1L))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(String.valueOf(content))

                );

        getActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value(response.getTitle()))
                .andExpect(jsonPath("$.content").value(response.getContent()));
    }

    @Test
    void getWalkByWalkId() throws Exception {

        WalkMateDto.Response response = new WalkMateDto.Response("제목1", "내용1");

        given(walkMateService.findWalkByWalkId(Mockito.anyLong())).willReturn(response);

        ResultActions getActions =
                mockMvc.perform(
                        get("/walkmates/bywalk/{walk-id}", 1L)
                                .accept(MediaType.APPLICATION_JSON)
                                .header("Authorization", tokenProvider.createAccessToken(1L))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(String.valueOf(response))
                );

        getActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value(response.getTitle()))
                .andExpect(jsonPath("$.content").value(response.getContent()));
    }

    @Test
    void getWalksFromMe() throws Exception {

        WalkMateDto.Response response1 = new WalkMateDto.Response("제목1", "내용1");
        WalkMateDto.Response response2 = new WalkMateDto.Response("제목2", "내용2");

        List<WalkMateDto.Response> response = new ArrayList<>();
        response.add(response1);
        response.add(response2);

        given(walkMateService.findWalksByMemberId(Mockito.anyInt(), Mockito.anyInt(), Mockito.anyLong(), Mockito.anyBoolean())).willReturn(response);

        ResultActions getActions =
                mockMvc.perform(
                        get("/walkmates/my-walks")
                                .param("openFilter", "true")
                                .param("page", "0")
                                .param("size", "10")
                                .param("location", "서울시 강서구 마곡동")
                                .accept(MediaType.APPLICATION_JSON)
                                .header("Authorization", tokenProvider.createAccessToken(1L))
                );

        getActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value(response.get(0).getTitle()))
                .andExpect(jsonPath("$[0].content").value(response.get(0).getContent()))
                .andExpect(jsonPath("$[1].title").value(response.get(1).getTitle()))
                .andExpect(jsonPath("$[1].content").value(response.get(1).getContent()));
    }

    @Test
    void getWalksByMemberId() throws Exception {

        WalkMateDto.Response response1 = new WalkMateDto.Response("제목1", "내용1");
        WalkMateDto.Response response2 = new WalkMateDto.Response("제목2", "내용2");

        List<WalkMateDto.Response> response = new ArrayList<>();
        response.add(response1);
        response.add(response2);

        given(walkMateService.findWalksByMemberId(Mockito.anyInt(), Mockito.anyInt(), Mockito.anyLong(), Mockito.anyBoolean())).willReturn(response);

        ResultActions getActions =
                mockMvc.perform(
                        get("/walkmates/other-walks/{member-id}", 1L)
                                .param("openFilter", "true")
                                .param("page", "0")
                                .param("size", "10")
                                .param("location", "서울시 강서구 마곡동")
                                .accept(MediaType.APPLICATION_JSON)
                                .header("Authorization", tokenProvider.createAccessToken(1L))
                );

        getActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value(response.get(0).getTitle()))
                .andExpect(jsonPath("$[0].content").value(response.get(0).getContent()))
                .andExpect(jsonPath("$[1].title").value(response.get(1).getTitle()))
                .andExpect(jsonPath("$[1].content").value(response.get(1).getContent()));
    }

    @Test
    void getWalks() throws Exception {

        WalkMateDto.Response response1 = new WalkMateDto.Response("제목1", "내용1", "서울시 강서구 마곡동");
        WalkMateDto.Response response2 = new WalkMateDto.Response("제목2", "내용2", "서울시 강서구 마곡동");
        WalkMateDto.Response response3 = new WalkMateDto.Response("제목3", "내용3", "서울시 양천구 목동");


        List<WalkMateDto.Response> response = new ArrayList<>();
        response.add(response1);
        response.add(response2);
        response.add(response3);

        given(walkMateService.recentPage(Mockito.anyInt(), Mockito.anyInt(), Mockito.anyString(), Mockito.anyBoolean())).willReturn(response);

        ResultActions getActions =
                mockMvc.perform(
                        get("/walkmates/walks")
                                .param("openFilter", "true")
                                .param("page", "0")
                                .param("size", "10")
                                .param("location", "서울시 강서구 마곡동")
                                .accept(MediaType.APPLICATION_JSON)
                                .header("Authorization", tokenProvider.createAccessToken(1L))
                );

        getActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("제목1"))
                .andExpect(jsonPath("$[0].content").value("내용1"))
                .andExpect(jsonPath("$[0].location").value("서울시 강서구 마곡동"))
                .andExpect(jsonPath("$[1].title").value("제목2"))
                .andExpect(jsonPath("$[1].content").value("내용2"))
                .andExpect(jsonPath("$[0].location").value("서울시 강서구 마곡동"));
    }

    @Test
    void getCommentedWalk() throws Exception {

        WalkMateDto.Response response1 = new WalkMateDto.Response("제목1", "내용1");
        WalkMateDto.Response response2 = new WalkMateDto.Response("제목2", "내용2");
        WalkMateDto.Response response3 = new WalkMateDto.Response("제목3", "내용3");

        Member member = new Member();
        MemberDto.Info info = MemberDto.Info.builder()
                .memberId(1L)
                .build();

        WalkMate walkMate = WalkMate.builder()
                .title("제목 1")
                .content("내용 1")
                .member(member)
                .build();

        WalkMateComment comment = WalkMateComment.builder()
                .member(member) //1L
                .walkMate(walkMate)
                .build();
        WalkMateCommentDto.Response commentResponse = commentMapper.commentToCommentResponseDto(comment);
        commentResponse.setMemberInfo(info);

        List<WalkMateCommentDto.Response> responseList = new ArrayList<>();
        responseList.add(commentResponse);

        response2.setComments(responseList);

        List<WalkMateDto.Response> response = new ArrayList<>();
        response.add(response1);
        response.add(response2);
        response.add(response3);

        given(walkMateService.findCommentedWalks(1L)).willReturn(response);

        ResultActions getActions =
                mockMvc.perform(
                        get("/walkmates/have/comments")
                                .accept(MediaType.APPLICATION_JSON)
                                .header("Authorization", tokenProvider.createAccessToken(1L))
                );

        getActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[1].title").value("제목2"))
                .andExpect(jsonPath("$[1].content").value("내용2"));
    }

    @Test
    void deleteWalk() throws Exception {

        long walkId = 1L;
        long memberId = 1L;

        doNothing().when(walkMateService).deleteWalk(walkId, memberId);

        ResultActions getActions =
                mockMvc.perform(
                        delete("/walkmates/{walk-id}", walkId)
                                .accept(MediaType.APPLICATION_JSON)
                                .header("Authorization", tokenProvider.createAccessToken(1L))
                                .contentType(MediaType.APPLICATION_JSON)
                );

        getActions
                .andExpect(status().isNoContent());
    }

    @Test
    void likeWalk() throws Exception {

        long walkId = 1L;
        long memberId = 1L;

        WalkMateDto.Like like = WalkMateDto.Like.builder()
                .likeCount(1)
                .isLike(true)
                .build();

        given(walkMateService.likeByMember(walkId, memberId)).willReturn(like);

        ResultActions getActions =
                mockMvc.perform(
                        patch("/walkmates/like/{walk-id}", walkId)
                                .accept(MediaType.APPLICATION_JSON)
                                .header("Authorization", tokenProvider.createAccessToken(1L))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(String.valueOf(like))
                );

        getActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.like").value(true))
                .andExpect(jsonPath("$.likeCount").value(1));
    }

    @Test
    void changeOpenStatus() throws Exception {

        WalkMateDto.Open response = new WalkMateDto.Open(1L, true);

        given(walkMateService.changeOpenStatus(Mockito.anyBoolean(), Mockito.anyLong(), Mockito.anyLong()))
                .willReturn(response);

        String content = gson.toJson(response);

        ResultActions getActions =
                mockMvc.perform(
                        patch("/walkmates/openstatus/{status}/{walk-id}", true, 1L)
                                .accept(MediaType.APPLICATION_JSON)
                                .header("Authorization", tokenProvider.createAccessToken(1L))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(String.valueOf(content))

                );

        getActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.open").value(response.getOpen()))
                .andExpect(jsonPath("$.walkMatePostId").value(response.getWalkMatePostId()));
    }
}
