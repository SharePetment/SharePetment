package com.saecdo18.petmily.member.controller;

import com.google.gson.Gson;
import com.saecdo18.petmily.jwt.TokenProvider;
import com.saecdo18.petmily.member.dto.FollowMemberDto;
import com.saecdo18.petmily.member.dto.MemberDto;
import com.saecdo18.petmily.member.entity.FollowMember;
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

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
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

    @Autowired
    private Gson gson;


    @Test
    void getMember() throws Exception {
        MemberDto.Response response = MemberDto.Response.builder()
                .name("김본명")
                .address("서울시 강서구 마곡동")
                .followerCount(0)
                .feedCount(0)
                .animalParents(false)
                .guestFollow(false)
                .build();
        given(memberService.getMember(Mockito.anyLong(), Mockito.anyLong())).willReturn(response);

        ResultActions getActions =
                mockMvc.perform(
                        get("/members/1")
                                .header("Authorization", tokenProvider.createAccessToken(1))
                                .accept(MediaType.APPLICATION_JSON)
                );

        getActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value(response.getName()));
    }

    @Test
    void patchMember() throws Exception {
        MemberDto.Patch patch = new MemberDto.Patch("닉네임","서울시 강서구 마곡동");
        String patchContent = gson.toJson(patch);

        MemberDto.Info memberInfo = MemberDto.Info.builder()
                .nickname("닉네임")
                .memberId(1l)
                .build();

        MemberDto.Response response = MemberDto.Response.builder()
                .memberInfo(memberInfo)
                .name("김본명")
                .address("서울시 강서구 마곡동")
                .followerCount(0)
                .feedCount(0)
                .animalParents(false)
                .guestFollow(false)
                .build();
        given(memberService.updateMemberStatus(Mockito.anyLong(), Mockito.anyString(), Mockito.anyString())).willReturn(response);

        ResultActions getActions =
                mockMvc.perform(
                        patch("/members/status")
                                .header("Authorization", tokenProvider.createAccessToken(1))
                                .accept(MediaType.APPLICATION_JSON)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(patchContent)
                );

        getActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value(response.getName()))
                .andExpect(jsonPath("$.memberInfo.nickname").value(response.getMemberInfo().getNickname()))
                .andExpect(jsonPath("$.address").value(response.getAddress()))
        ;
    }

    @Test
    void followingMember() throws Exception {

        MemberDto.Info memberInfo = MemberDto.Info.builder()
                .nickname("닉네임")
                .memberId(1l)
                .build();

        FollowMemberDto.Response responseFollow = FollowMemberDto.Response.builder()
                .memberInfo(memberInfo)
                .build();
        given(memberService.followMember(Mockito.anyLong(),Mockito.anyLong())).willReturn(responseFollow);

        ResultActions getActions =
                mockMvc.perform(
                        post("/members/following/1")
                                .header("Authorization", tokenProvider.createAccessToken(1))
                                .accept(MediaType.APPLICATION_JSON)

                );

        getActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.memberInfo.nickname").value(responseFollow.getMemberInfo().getNickname()))


        ;
    }

    @Test
    void followingList() throws Exception {
        MemberDto.Info memberInfo = MemberDto.Info.builder()
                .nickname("닉네임")
                .memberId(1l)
                .build();

        FollowMemberDto.Response responseFollow = FollowMemberDto.Response.builder()
                .memberInfo(memberInfo)
                .build();

        List<FollowMemberDto.Response> responses = new ArrayList<>();
        responses.add(responseFollow);

        given(memberService.followList(Mockito.anyLong())).willReturn(responses);

        ResultActions getActions =
                mockMvc.perform(
                        get("/members/following/list")
                                .header("Authorization", tokenProvider.createAccessToken(1))
                                .accept(MediaType.APPLICATION_JSON)

                );

        getActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].memberInfo.nickname").value(responses.get(0).getMemberInfo().getNickname()))

        ;
    }

    @Test
    void changeImage() throws Exception {
        MemberDto.Info memberInfo = MemberDto.Info.builder()
                .nickname("닉네임")
                .memberId(1l)
                .imageURL("axvcbfgfjaddfsdfasdiorgiojrkgfdjasdfd")
                .build();


        given(memberService.changeImage(Mockito.anyLong(), Mockito.anyLong())).willReturn(memberInfo);

        ResultActions getActions =
                mockMvc.perform(
                        patch("/members/image/1")
                                .header("Authorization", tokenProvider.createAccessToken(1))
                                .accept(MediaType.APPLICATION_JSON)

                );

        getActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nickname").value(memberInfo.getNickname()))
                .andExpect(jsonPath("$.imageURL").value(memberInfo.getImageURL()))

        ;
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
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.enable").value(nickCheckResponse.isEnable()))
        ;
    }
}