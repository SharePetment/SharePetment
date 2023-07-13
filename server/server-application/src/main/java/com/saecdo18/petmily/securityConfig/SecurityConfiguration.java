package com.saecdo18.petmily.securityConfig;


import com.saecdo18.petmily.jwt.JwtAuthenticationFilter;
//import com.saecdo18.petmily.oauth.CustomOAuth2UserService;
import com.saecdo18.petmily.oauth.OAuth2SuccessHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

//    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{

        http
                .csrf().disable()
                .cors()
            .and()

                .headers()
                .frameOptions().disable()
            .and()

                .formLogin().disable()
                .httpBasic().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()

                .authorizeHttpRequests()
                .antMatchers("/","/api/v2/**","/swagger/**",
                        "/oauth/**","/feeds/all/**","/auth/**",
                        "/login/**","/swagger-ui/**","/swagger-ui.html/**","/swagger-resources/**","/v2/api-docs","/v3/api-docs", "/members/nickname-check/**", "/feeds/like/**").permitAll()
                .anyRequest().authenticated();
//            .and()
//
//                .oauth2Login()
//                .userInfoEndpoint()
//                .userService(customOAuth2UserService)
//
//                .and()
//                .successHandler(oAuth2SuccessHandler);
        http.addFilterAfter(jwtAuthenticationFilter, CorsFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource(){
        CorsConfiguration configuration = new CorsConfiguration();
//        configuration.setAllowCredentials(true);
//        configuration.addAllowedOriginPattern("*");
        configuration.addAllowedOrigin("http://localhost:5374");
        configuration.addAllowedOrigin("http://share-petment.s3-website.ap-northeast-2.amazonaws.com");
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**",configuration);

        return source;
    }

}
