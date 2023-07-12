package com.saecdo18.petmily.walkmate.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.saecdo18.petmily.jwt.TokenProvider;
import com.saecdo18.petmily.member.dto.MemberDto;
import com.saecdo18.petmily.member.service.MemberService;
import com.saecdo18.petmily.walkmate.dto.WalkMateDto;
import com.saecdo18.petmily.walkmate.entity.WalkMate;
import com.saecdo18.petmily.walkmate.mapper.WalkMateMapper;
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
    @Autowired
    private TokenProvider tokenProvider;
    @Autowired
    private WalkMateMapper mapper;
    @Autowired
    private Gson gson;
    @Autowired
    private ObjectMapper objectMapper;


    @Test
    void postWalk() throws Exception{

        WalkMateDto.Post post = new WalkMateDto.Post("제목 등록", "내용 등록");
        WalkMateDto.Response response = new WalkMateDto.Response(post.getTitle(), post.getContent());

        given(walkMateService.createWalk(Mockito.any(WalkMate.class), Mockito.anyLong())).willReturn(response);

        String content = gson.toJson(post);
        System.out.println("@@@@@@@@@@@@@" + content + "@@@@@@@@@@@@@");

        ResultActions getActions =
                mockMvc.perform(
                        post("/walkmates/{member-id}", 1L)
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
    void updateWalk() throws Exception{

        WalkMateDto.Patch patch = new WalkMateDto.Patch("제목 수정", "내용 수정");
        WalkMateDto.Response response = new WalkMateDto.Response("원래 제목", "원래 내용");

        given(walkMateService.updateWalkMate(Mockito.any(WalkMateDto.Patch.class), Mockito.anyLong(), Mockito.anyLong()))
                .willReturn(response);


        String content = gson.toJson(patch);
        System.out.println("@@@@@@@@@@@@@" + content + "@@@@@@@@@@@@@");

        ResultActions getActions =
                mockMvc.perform(
                        patch("/walkmates/{walk-id}/{member-id}", 1L, 1L)
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
    void getWalkByWalkId() throws Exception{

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
    void getWalksByMemberId() throws Exception{

        WalkMateDto.Response response1 = new WalkMateDto.Response("제목1", "내용1");
        WalkMateDto.Response response2 = new WalkMateDto.Response("제목2", "내용2");

        List<WalkMateDto.Response> response = new ArrayList<>();
        response.add(response1);
        response.add(response2);

        given(walkMateService.findWalksByMemberId(Mockito.anyInt(), Mockito.anyInt(), Mockito.anyLong(), Mockito.anyBoolean())).willReturn(response);

        ResultActions getActions =
                mockMvc.perform(
                        get("/walkmates/bymember/{member-id}", 1L)
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




}
