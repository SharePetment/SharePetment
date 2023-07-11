package com.saecdo18.petmily.feed.controller;

import com.google.gson.Gson;
import com.saecdo18.petmily.feed.dto.FeedDto;
import com.saecdo18.petmily.feed.service.FeedServiceImpl;
import com.saecdo18.petmily.member.dto.MemberDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;

@WebMvcTest(FeedController.class)
@MockBean(JpaMetamodelMappingContext.class)
class FeedControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FeedServiceImpl feedService;

    @Autowired
    private Gson gson;

//    public FeedDto.Response getOneFeed(long feedId, long memberId) {
//        MemberDto.Info memberInfo = Mme
//
//        return FeedDto.Response.builder()
//                .feedId(feedId)
//                .memberInfo()
//                .build();
//    }

    @Test
    @DisplayName("피드 가져오기 테스트")
    void getFeed() {
        long feedId = 1L;
        long memberId = 1L;

        FeedDto.Response response = FeedDto.Response.builder()

                .build();

    }

    @Test
    void getFeedsRandom() {
    }

    @Test
    void getFeedsByMember() {
    }

    @Test
    void getFeedsByMemberFollow() {
    }

    @Test
    void createFeed() {
    }

    @Test
    void patchFeed() {
    }

    @Test
    void deleteFeed() {
    }

    @Test
    void likeFeed() {
    }
}