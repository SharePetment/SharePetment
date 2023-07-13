package com.saecdo18.petmily.feed.controller;

import com.google.gson.Gson;
import com.saecdo18.petmily.feed.dto.FeedCommentDto;
import com.saecdo18.petmily.feed.service.FeedCommentServiceImpl;
import com.saecdo18.petmily.feed.service.FeedServiceImpl;
import com.saecdo18.petmily.jwt.TokenProvider;
import com.saecdo18.petmily.member.dto.MemberDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@SpringBootTest(properties = {"spring.config.name=application-test", "spring.config.location=classpath:/"})
@AutoConfigureMockMvc
class FeedCommentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FeedCommentServiceImpl feedCommentService;

    @Autowired
    private Gson gson;

    @Autowired
    TokenProvider tokenProvider;

    @Test
    @DisplayName("피드 댓글 생성")
    void createComment() throws Exception {
        long memberId = 1L;
        long feedId = 1L;

        FeedCommentDto.Response response = getFeedCommentDto(memberId);
        FeedCommentDto.Post post = FeedCommentDto.Post.builder()
                .feedId(feedId)
                .content("content")
                .build();
        String content = gson.toJson(post);
        String responseContent = gson.toJson(response);
        given(feedCommentService.createComment(any(), Mockito.anyLong())).willReturn(response);

        mockMvc.perform(
                    post("/feeds/comments")
                            .accept(MediaType.APPLICATION_JSON)
                            .contentType(MediaType.APPLICATION_JSON)
                            .header("Authorization", tokenProvider.createAccessToken(memberId))
                            .content(content)
            ).andExpect(status().isCreated())
            .andExpect(content().json(responseContent))
            .andExpect(jsonPath("$.memberInfo.memberId").value(memberId));
    }

    @Test
    @DisplayName("피드 댓글 수정")
    void patchComment() throws Exception {
        long memberId = 1L;
        long commentId = 1L;
        long feedId = 1L;
        FeedCommentDto.Response response = getFeedCommentDto(memberId);
        FeedCommentDto.Patch patch = FeedCommentDto.Patch.builder()
                .feedId(feedId)
                .content("content")
                .build();

        String requestContent = gson.toJson(patch);
        String responseContent = gson.toJson(response);

        given(feedCommentService.updateComment(any(), Mockito.anyLong(), Mockito.anyLong())).willReturn(response);

        mockMvc.perform(
                patch("/feeds/comments/{comment-id}", commentId)
                        .accept(MediaType.APPLICATION_JSON)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", tokenProvider.createAccessToken(memberId))
                        .content(requestContent)
        ).andExpect(status().isOk())
                .andExpect(content().json(responseContent));
    }

    @Test
    @DisplayName("피드 댓글 삭제")
    void deleteComment() throws Exception {
        long commentId = 1L;
        long memberId = 1L;

        doNothing().when(feedCommentService).deleteComment(commentId, memberId);

        mockMvc.perform(
                delete("/feeds/comments/{comment-id}", commentId)
                        .header("Authorization", tokenProvider.createAccessToken(memberId))
        ).andExpect(status().isNoContent());
    }

    private FeedCommentDto.Response getFeedCommentDto(long memberId) {
        MemberDto.Info memberInfo = getMemberInfo(memberId);
        return FeedCommentDto.Response.builder()
                .feedCommentsId(1L)
                .memberInfo(memberInfo)
                .content("content")
                .createdAt(null)
                .modifiedAt(null)
                .build();
    }

    private MemberDto.Info getMemberInfo(long memberId) {
        return MemberDto.Info.builder()
                .memberId(memberId)
                .nickname("사용자 " + memberId)
                .imageURL("http://image.jpg")
                .build();
    }
}