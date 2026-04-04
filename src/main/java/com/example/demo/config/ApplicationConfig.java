package com.example.demo.config;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

import com.example.demo.repositories.UserRepository;
import com.example.demo.services.JwtService;

@Configuration
@AllArgsConstructor
public class ApplicationConfig {
	
	private final UserRepository userRepository;
	// find the user in our database by their username (aka their email)
	// or throw an exception if they are not found
	@Bean
	UserDetailsService userDetailsService() {
	    return username -> userRepository.findByEmail(username)
	            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
	}
	// instantiate a bean to authenticate through a database (DAO = Database Access Operations) and with a password encoder
	@Bean
	AuthenticationProvider authenticationProvider(UserDetailsService userDetailsService) {
	    DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService);
	    authProvider.setPasswordEncoder(passwordEncoder());
	    return authProvider;
	}
	// get an instance of our Spring Authentication Manager for use with programmatic authentication
	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
	    return config.getAuthenticationManager();
	}
	// set up our password encoder as BCrypt
	@Bean
	PasswordEncoder passwordEncoder() {
	    return new BCryptPasswordEncoder();
	}
	
	@Bean
	public JwtAuthenticationFilter jwtAuthenticationFilter(JwtService jwtService,
	                                                       UserDetailsService userDetailsService) {
	    return new JwtAuthenticationFilter(jwtService, userDetailsService);
	}


}
