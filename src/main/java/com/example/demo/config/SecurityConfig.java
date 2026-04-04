package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;


@Configuration
@EnableWebSecurity
@AllArgsConstructor
@SecurityScheme(
	    name = "Bearer Authentication",
	    type = SecuritySchemeType.HTTP,
	    bearerFormat = "JWT",
	    scheme = "bearer",
	    in = SecuritySchemeIn.HEADER
	)
public class SecurityConfig {
	
	private JwtAuthenticationFilter jwtAuthenticationFilter;
	private AuthenticationProvider authenticationProvider;
	
	
	// remove this 2 to let error be 403 instead of 401
	
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
	    return http
	            .csrf(csrf -> csrf.disable())
	            .cors(cors -> {}) 
	            .exceptionHandling(ex -> ex
	                .authenticationEntryPoint(authenticationEntryPoint())
	            )
	            .authorizeHttpRequests(auth -> auth
	                    .requestMatchers("/api/v1/auth/**").permitAll()
	                    .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
	                    .requestMatchers("/api/v1/students/**").authenticated()
	                    .anyRequest().permitAll()
	            )
	            .sessionManagement(session ->
	                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
	            .authenticationProvider(authenticationProvider)
	            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
	            .build();
	}
	
	@Bean
	public AuthenticationEntryPoint authenticationEntryPoint() {
	    return (request, response, authException) -> {
	        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
	        response.setContentType("application/json");
	        response.getWriter().write("{\"error\": \"Invalid email or password\"}");
	    };
	}


	

}