package com.saecdo18.petmily.walkmate.controller;


import com.saecdo18.petmily.jwt.TokenProvider;
import com.saecdo18.petmily.member.dto.MemberDto;
import com.saecdo18.petmily.member.service.MemberService;
import com.saecdo18.petmily.walkmate.dto.WalkMateDto;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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

    @Test
    void getWalkByWalkId() throws Exception{

        WalkMateDto.Response response = WalkMateDto.Response.builder()
                .title("제목1")
                .content("내용1")
                .build();

        given(walkMateService.findWalkByWalkId(Mockito.anyLong())).willReturn(response);

        ResultActions getActions =
                mockMvc.perform(
                        get("/walkmates/bywalk/{walk-id}", 1L)
                                .accept(MediaType.APPLICATION_JSON)
                                .header("Authorization", tokenProvider.createAccessToken(1L))
                );

        getActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value(response.getTitle()))
                .andExpect(jsonPath("$.content").value(response.getContent()));
    }

}
