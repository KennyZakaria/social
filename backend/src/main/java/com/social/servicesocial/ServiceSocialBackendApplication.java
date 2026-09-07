package com.social.servicesocial;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class ServiceSocialBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServiceSocialBackendApplication.class, args);
	}

}
