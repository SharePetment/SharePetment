package com.saecdo18.petmily.pet.controller;

import com.google.gson.Gson;
import com.saecdo18.petmily.image.dto.ImageDto;
import com.saecdo18.petmily.jwt.TokenProvider;
import com.saecdo18.petmily.member.dto.MemberDto;
import com.saecdo18.petmily.pet.dto.PetDto;
import com.saecdo18.petmily.pet.entity.Pet;
import com.saecdo18.petmily.pet.service.PetService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMultipartHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {"spring.config.name=application-test", "spring.config.location=classpath:/"})
@AutoConfigureMockMvc
class PetControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PetService petService;

    @Autowired
    private TokenProvider tokenProvider;

    @Autowired
    private Gson gson;

    @Test
    void postPet() throws Exception {


        ImageDto imageDto = ImageDto.builder()
                .imageId(1l)
                .originalFilename("웰시코기.png")
                .uploadFileURL("http://s3anjtlrlanjtlrlEkfks")
                .build();

        PetDto.Response response = PetDto.Response.builder()
                .petId(1l)
                .images(imageDto)
                .name("메시")
                .age(5)
                .sex("수컷")
                .species("웰시코기")
                .information("안녕하세용")
                .build();

        given(petService.createPet(Mockito.anyLong(), Mockito.any(PetDto.Post.class))).willReturn(response);

        MockMultipartFile image = new MockMultipartFile("images", "imagefile.jpeg", "image/jpeg", "<<jpeg data>>".getBytes());


        ResultActions getActions =
                mockMvc.perform(multipart("/pets")
                                .file(image)

                                .param("name","메시")
                                .param("age","5")
                                .param("sex","수컷")
                                .param("species","웰시코기")
                                .param("information","안녕하세용")
                                .header("Authorization", tokenProvider.createAccessToken(1))

                        );

        getActions
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value(response.getName()))
                .andExpect(jsonPath("$.age").value(response.getAge()))
                .andExpect(jsonPath("$.images.originalFilename").value(response.getImages().getOriginalFilename()))

        ;
    }

    @Test
    void getPet() throws Exception {
        ImageDto imageDto = ImageDto.builder()
                .imageId(1l)
                .originalFilename("웰시코기.png")
                .uploadFileURL("http://s3anjtlrlanjtlrlEkfks")
                .build();

        PetDto.Response response = PetDto.Response.builder()
                .petId(1l)
                .images(imageDto)
                .name("메시")
                .age(5)
                .sex("수컷")
                .species("웰시코기")
                .information("안녕하세용")
                .build();

        given(petService.getPet(Mockito.anyLong())).willReturn(response);

        ResultActions getActions =
                mockMvc.perform(
                        get("/pets/1")
                                .header("Authorization", tokenProvider.createAccessToken(1))
                                .accept(MediaType.APPLICATION_JSON)
                );

        getActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value(response.getName()));
    }

    @Test
    void patchPet() throws Exception {

        ImageDto imageDto = ImageDto.builder()
                .imageId(1l)
                .originalFilename("웰시코기.png")
                .uploadFileURL("http://s3anjtlrlanjtlrlEkfks")
                .build();

        PetDto.Response response = PetDto.Response.builder()
                .petId(1l)
                .images(imageDto)
                .name("메시")
                .age(5)
                .sex("수컷")
                .species("웰시코기")
                .information("안녕하세용")
                .build();

        given(petService.updatePet(Mockito.anyLong(), Mockito.anyLong(), Mockito.any(PetDto.Patch.class))).willReturn(response);

        MockMultipartFile image = new MockMultipartFile("images", "imagefile.jpeg", "image/jpeg", "<<jpeg data>>".getBytes());

        MockMultipartHttpServletRequestBuilder builder =
                MockMvcRequestBuilders.multipart("/pets/status/1/1");

        builder.with(new RequestPostProcessor() {
            @Override
            public MockHttpServletRequest postProcessRequest(MockHttpServletRequest request) {
                request.setMethod("PATCH");
                return request;
            }
        });

        ResultActions getActions =
                mockMvc.perform(patch("/pets/status/1")
                                .contentType(MediaType.MULTIPART_FORM_DATA_VALUE)
                        .content(image.getBytes())
                        .param("name","메시")
                        .param("age","5")
                        .param("sex","수컷")
                        .param("species","웰시코기")
                        .param("information","안녕하세용")
                        .header("Authorization", tokenProvider.createAccessToken(1))

                );

//                mockMvc.perform(builder
//                        .file(image)
//                        .param("name","메시")
//                        .param("age","5")
//                        .param("sex","수컷")
//                        .param("species","웰시코기")
//                        .param("information","안녕하세용")
//                        .header("Authorization", tokenProvider.createAccessToken(1))
//
//                );

        getActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value(response.getName()))
                .andExpect(jsonPath("$.age").value(response.getAge()))
                .andExpect(jsonPath("$.images.originalFilenam").value(response.getImages().getOriginalFilename()))

        ;
    }

    @Test
    void deletePet() throws Exception {

        mockMvc.perform(delete("/pets/1").header("Authorization", tokenProvider.createAccessToken(1)))

                .andExpect(status().isNoContent());
    }
}