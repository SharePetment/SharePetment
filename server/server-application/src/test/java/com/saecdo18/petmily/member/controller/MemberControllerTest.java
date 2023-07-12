package com.saecdo18.petmily.member.controller;

import com.saecdo18.petmily.jwt.TokenProvider;
import com.saecdo18.petmily.member.dto.MemberDto;
import com.saecdo18.petmily.member.service.MemberService;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@SpringBootTest(properties = {"spring.config.name=application-test", "spring.config.location=classpath:/"})
@AutoConfigureMockMvc
class MemberControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MemberService memberService;

    @Autowired
    private TokenProvider tokenProvider;


    @Test
    void getMember() throws Exception {
        MemberDto.Response respone = MemberDto.Response.builder()
                .name("김본명")
                .address("서울시 강서구 마곡동")
                .followerCount(0)
                .feedCount(0)
                .animalParents(false)
                .guestFollow(false)
                .build();
        given(memberService.getMember(Mockito.anyLong(), Mockito.anyLong())).willReturn(respone);

        ResultActions getActions =
                mockMvc.perform(
                        get("/members/1/1")
                                .header("Authorization", tokenProvider.createAccessToken(6))
                                .accept(MediaType.APPLICATION_JSON)
                );

        getActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value(respone.getName()));
    }

    @Test
    void patchMember() throws Exception {
        MemberDto.Response respone = MemberDto.Response.builder()
                .name("김본명")
                .address("서울시 강서구 마곡동")
                .followerCount(0)
                .feedCount(0)
                .animalParents(false)
                .guestFollow(false)
                .build();
        given(memberService.getMember(Mockito.anyLong(), Mockito.anyLong())).willReturn(respone);

        ResultActions getActions =
                mockMvc.perform(
                        get("/members/1/1")
                                .header("Authorization", tokenProvider.createAccessToken(6))
                                .accept(MediaType.APPLICATION_JSON)
                );

        getActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value(respone.getName()));
    }

    @Test
    void followingMember() {
    }

    @Test
    void followingList() {
    }

    @Test
    void changeImage() {
    }

    @Test
    void checkNickname() throws Exception {
        String nickname = "testNick";
        MemberDto.NickCheckResponse nickCheckResponse = MemberDto.NickCheckResponse.builder()
                .checkMessage("사용가능한 닉네임입니다")
                .enable(true)
                .build();
        given(memberService.checkNickname(Mockito.anyString())).willReturn(nickCheckResponse);

        mockMvc.perform(
                post("/members/nickname-check/testNick")
                        .accept(MediaType.APPLICATION_JSON)
        )
                .andExpect(status().isOk());
    }
}