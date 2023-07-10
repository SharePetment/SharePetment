package com.saecdo18.petmily.swagger;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.ApiKey;
import springfox.documentation.service.AuthorizationScope;
import springfox.documentation.service.SecurityReference;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spi.service.contexts.SecurityContext;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.util.List;

@Configuration
@EnableWebMvc
public class SwaggerConfig {
    @Bean
    public InternalResourceViewResolver defaultViewResolver() {
        return new InternalResourceViewResolver();
    }

    @Bean
    public Docket swaggerApi2(){
        return new Docket(DocumentationType.OAS_30)
                .groupName("API 2")
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.saecdo18.petmily.walkmate.controller"))
                .paths(PathSelectors.any())
                .build()
                .apiInfo(mySwaggerInfo());
    }
    @Bean
    public Docket swaggerApi1() {
        return new Docket(DocumentationType.OAS_30)
                .groupName("API 1")
//                .useDefaultResponseMessages(false)
//                .securityContexts(List.of(this.securityContext())) // SecurityContext 설정
//                .securitySchemes(List.of(this.apiKey())) // ApiKey 설정
                .select()
//                .apis(RequestHandlerSelectors.basePackage("com.saecdo18.petmily"))
                .apis(RequestHandlerSelectors.basePackage("com.saecdo18.petmily.member.controller"))
//                .apis(RequestHandlerSelectors.basePackage("com.saecdo18.petmily.feed.controller"))
//                .apis(RequestHandlerSelectors.basePackage("com.saecdo18.petmily.walkmate.controller"))
//                .paths(PathSelectors.any())
//                .apis(RequestHandlerSelectors.any())
                .paths(PathSelectors.any())
                .build()
//                .pathMapping("/api")
                .apiInfo(mySwaggerInfo());
    }
    private SecurityContext securityContext() {
        return SecurityContext.builder()
                .securityReferences(defaultAuth())
                .build();
    }

    private List<SecurityReference> defaultAuth() {
        AuthorizationScope authorizationScope = new AuthorizationScope("global", "accessEverything");
        AuthorizationScope[] authorizationScopes = new AuthorizationScope[1];
        authorizationScopes[0] = authorizationScope;
        return List.of(new SecurityReference("Authorization", authorizationScopes));
    }

    // ApiKey 정의
    private ApiKey apiKey() {
        return new ApiKey("Authorization", "Authorization", "header");
    }

    private ApiInfo mySwaggerInfo() {
        return new ApiInfoBuilder()
                .title("SwaggerTest API")
                .description("SwaggerTest API Docs")
                .build();
    }
}
