package com.saecdo18.petmily.feed.controller;

import com.google.gson.Gson;
import com.saecdo18.petmily.feed.dto.FeedCommentDto;
import com.saecdo18.petmily.feed.dto.FeedDto;
import com.saecdo18.petmily.feed.service.FeedServiceImpl;
import com.saecdo18.petmily.image.dto.ImageDto;
import com.saecdo18.petmily.jwt.JwtAuthenticationFilter;
import com.saecdo18.petmily.jwt.TokenProvider;
import com.saecdo18.petmily.member.dto.MemberDto;
import com.saecdo18.petmily.member.repository.MemberRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {"spring.config.name=application-test", "spring.config.location=classpath:/"})
@AutoConfigureMockMvc
class FeedControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FeedServiceImpl feedService;

    @Autowired
    private Gson gson;

    @Autowired TokenProvider tokenProvider;

    @Test
    @DisplayName("피드 가져오기 테스트")
    void getFeed() throws Exception {
        long feedId = 1L;
        long memberId = 1L;

        FeedDto.Response feedDto = getOneFeed(feedId);
        String content = gson.toJson(feedDto);

        System.out.println(content);

        given(feedService.getFeed(feedId, memberId)).willReturn(feedDto);

        ResultActions actions = mockMvc.perform(
                get("/feeds/all/{feed-id}/{member-id}", feedId, memberId)
                        .header("Authorization", tokenProvider.createAccessToken(memberId))
        );

        actions
                .andExpect(status().isOk())
                .andExpect(content().json(content))
                .andExpect(jsonPath("$.feedId").value(feedId))
                .andExpect(jsonPath("$.memberInfo.memberId").value(memberId));

    }

    @Test
    @DisplayName("피드 최신순 가져오기 테스트")
    void getFeedsRandom() throws Exception {
        long memberId = 1L;
        List<FeedDto.Response> responseList = getFeedList(2);
        FeedDto.PreviousListIds previousListIds = getPreviousListIds();
        String content = gson.toJson(responseList);
        String previousList = gson.toJson(previousListIds);

        given(feedService.getFeedsRecent(previousListIds, memberId)).willReturn(responseList);

        ResultActions actions = mockMvc.perform(
                get("/feeds/all/list/random/{member-id}", memberId)
                        .accept(MediaType.APPLICATION_JSON)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", tokenProvider.createAccessToken(memberId))
                        .content(previousList)
        );
        System.out.println(actions.andReturn().getResponse().getContentAsString());

//        actions
//                .andExpect(status().isOk())
//                .andExpect(content().json(content))
//                .andExpect(jsonPath("$[0].feedId").value(1))
//                .andExpect(jsonPath("$[1].feedId").value(2))
//                .andExpect(jsonPath("$[0].memberInfo.memberId").value(1))
//                .andExpect(jsonPath("$[1].memberInfo.memberId").value(2));
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

    private MemberDto.Info getMemberInfo(long memberId) {
        return MemberDto.Info.builder()
                .memberId(memberId)
                .nickname("사용자 " + memberId)
                .imageURL("http://image.jpg")
                .build();
    }

    private ImageDto getImageDto(long imageId) {
        return ImageDto.builder()
                .imageId(imageId)
                .originalFilename("originalFilename " + imageId)
                .uploadFileURL("http://FeedImage" + imageId + ".jpg")
                .build();
    }

    private FeedCommentDto.Response getFeedCommentDto(long memberId) {
        MemberDto.Info feedCommentMemberInfo = getMemberInfo(memberId);

        return FeedCommentDto.Response.builder()
                .feedCommentsId(memberId)
                .memberInfo(feedCommentMemberInfo)
                .content("feed content " + memberId)
                .createdAt(null)
                .modifiedAt(null)
                .build();
    }

    private FeedDto.Response getOneFeed(long feedId) {
        long memberId = 1L;

        MemberDto.Info feedMemberInfo = getMemberInfo(memberId);
        List<ImageDto> imageDtoList = new ArrayList<>();
        List<FeedCommentDto.Response> feedCommentDtoList = new ArrayList<>();

        for (int i = 1; i <= 2; i++) {
            ImageDto imageDto = getImageDto(i);
            imageDtoList.add(imageDto);
            FeedCommentDto.Response feedCommentDto = getFeedCommentDto(i);
            feedCommentDtoList.add(feedCommentDto);
        }

        return FeedDto.Response.builder()
                .feedId(feedId)
                .memberInfo(feedMemberInfo)
                .images(imageDtoList)
                .content("feed content")
                .likes(1)
                .isLike(false)
                .feedComments(feedCommentDtoList)
                .shareURL("http://localhost:8080/feeds/all/" + feedId + "/0")
                .createdAt(null)
                .modifiedAt(null)
                .build();
    }

    private List<FeedDto.Response> getFeedList(int count) {
        List<FeedDto.Response> responseList = new ArrayList<>();
        for (int i = 1; i <= count; i++) {
            FeedDto.Response response = getOneFeed(i);
            responseList.add(response);
        }
        return responseList;
    }

    private FeedDto.PreviousListIds getPreviousListIds() {
        List<Long> list = new ArrayList<>();
        list.add(1L);
        FeedDto.PreviousListIds idList = new FeedDto.PreviousListIds();
        idList.setPreviousListIds(list);
        return idList;
    }
}