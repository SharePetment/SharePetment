package com.saecdo18.petmily.member.controller;

import com.google.gson.Gson;
import com.saecdo18.petmily.member.dto.MemberDto;
import com.saecdo18.petmily.member.service.MemberService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.restdocs.AutoConfigureRestDocs;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.http.MediaType;
import org.springframework.restdocs.payload.JsonFieldType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.util.List;

import static com.saecdo18.petmily.util.ApiDocumentUtils.getRequestPreProcessor;
import static com.saecdo18.petmily.util.ApiDocumentUtils.getResponsePreProcessor;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.startsWith;
import static org.mockito.BDDMockito.given;
import static org.springframework.restdocs.headers.HeaderDocumentation.headerWithName;
import static org.springframework.restdocs.headers.HeaderDocumentation.responseHeaders;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.*;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.restdocs.request.RequestDocumentation.parameterWithName;
import static org.springframework.restdocs.request.RequestDocumentation.pathParameters;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MemberController.class)
@MockBean(JpaMetamodelMappingContext.class)
@AutoConfigureRestDocs
class MemberControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private Gson gson;

    @MockBean
    private MemberService memberService;

//    @Test
//    void getMember() throws Exception {
//        MemberDto.Response responseMember = MemberDto.Response.builder().build();
//        given(memberService.getMember(Mockito.anyLong(),Mockito.anyLong())).willReturn(responseMember);
//
//        ResultActions actions = mockMvc.perform(
//                get("/members/{host-member-id}/{guest-member-id}")
//                        .accept(MediaType.APPLICATION_JSON)
//        ).andExpect(status().isOk())
//                .andDo(document(
//                        "get-answer",
//                        getRequestPreProcessor(),
//                        getResponsePreProcessor(),
//                        pathParameters(
//                                parameterWithName("answer-id").description("답변 식별자")
//                        ),
//                        responseFields(
//                                List.of(
////                                        fieldWithPath("data").type(JsonFieldType.OBJECT).description("결과 데이터"),
//                                        fieldWithPath("answerId").type(JsonFieldType.NUMBER).description("답변 식별자"),
//                                        fieldWithPath("detail").type(JsonFieldType.STRING).description("답변 본문"),
//                                        fieldWithPath("votesCount").type(JsonFieldType.NUMBER).description("답변 추천수"),
//                                        fieldWithPath("solutionStatus").type(JsonFieldType.BOOLEAN).description("답변 채택 유무"),
//                                        fieldWithPath("questionId").type(JsonFieldType.NUMBER).description("답변의 질문 식별자"),
//                                        fieldWithPath("memberId").type(JsonFieldType.NUMBER).description("답변의 회원 식별자"),
//                                        fieldWithPath("comments").type(JsonFieldType.ARRAY).description("댓글(재답변) 리스트"),
//                                        fieldWithPath("comments[].commentId").type(JsonFieldType.NUMBER).description("댓글(재답변) 리스트"),
//                                        fieldWithPath("comments[].commentDetail").type(JsonFieldType.STRING).description("댓글(재답변) 본문"),
//                                        fieldWithPath("comments[].memberId").type(JsonFieldType.NUMBER).description("댓글(재답변) 회원 식별자")
//                                )
//                        )
//                ));
//
//    }

    @Test
    void patchMember() {
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
        MemberDto.NickCheckResponse nickCheckResponse = MemberDto.NickCheckResponse.builder().build();
        given(memberService.checkNickname(Mockito.anyString())).willReturn(nickCheckResponse);
        String nickname = "dkfk";
        // (6) when
        ResultActions actions =
                mockMvc.perform(
                        post("/nickname-check/{nickname}",nickname)
                                .accept(MediaType.APPLICATION_JSON)
                );

        // then
        actions
                .andExpect(status().isOk())
                .andDo(document(       // (7)
                        "post-checkNickname",     // (7-1)
                        getRequestPreProcessor(),      // (7-2)
                        getResponsePreProcessor(),     // (7-3)
                        pathParameters(
                                parameterWithName("nickname").description("확인할 닉네임")

                        ),
                        responseFields(
                                List.of(
                                        fieldWithPath("checkMessage").type(JsonFieldType.STRING).description("답변"),
                                        fieldWithPath("enable").type(JsonFieldType.BOOLEAN).description("답변상태")
                                )
                        )
                ));
    }
}