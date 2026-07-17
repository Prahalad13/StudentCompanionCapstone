package com.example.demo.services;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.demo.domain.Job;

@Service
public class JobService {

    @Value("${adzuna.app.id}")
    private String appId;

    @Value("${adzuna.app.key}")
    private String appKey;

    private final RestTemplate restTemplate;

    public JobService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<Job> searchJobs(String title, String city, String type) {

        List<Job> jobs = new ArrayList<>();

        try {

            StringBuilder url = new StringBuilder(
                    "https://api.adzuna.com/v1/api/jobs/ca/search/1");

            url.append("?app_id=").append(appId);
            url.append("&app_key=").append(appKey);
            url.append("&results_per_page=20");

            if (title != null && !title.isBlank()) {
                url.append("&what=")
                        .append(URLEncoder.encode(title, StandardCharsets.UTF_8));
            }

            if (city != null && !city.isBlank()) {
                url.append("&where=")
                        .append(URLEncoder.encode(city, StandardCharsets.UTF_8));
            }

            ResponseEntity<String> response =
                    restTemplate.getForEntity(url.toString(), String.class);

            System.out.println("========== ADZUNA RESPONSE ==========");
            System.out.println(response.getBody());
            System.out.println("=====================================");

            JSONObject jsonObject =
                    new JSONObject(response.getBody());

            if (!jsonObject.has("results")) {
                return jobs;
            }

            JSONArray jobsArray =
                    jsonObject.getJSONArray("results");

            for (int i = 0; i < jobsArray.length(); i++) {

                JSONObject obj =
                        jobsArray.getJSONObject(i);

                Job job = new Job();

                // Job title
                job.setTitle(
                        obj.optString("title", ""));

                // Company
                JSONObject company =
                        obj.optJSONObject("company");

                if (company != null) {
                    job.setCompanyName(
                            company.optString("display_name", ""));
                } else {
                    job.setCompanyName("");
                }

                // Location
                JSONObject location =
                        obj.optJSONObject("location");

                if (location != null) {
                    job.setCity(
                            location.optString("display_name", ""));
                } else {
                    job.setCity("");
                }

                // Employment Type
                String contractType =
                        obj.optString("contract_type", "");

                String contractTime =
                        obj.optString("contract_time", "");

                String jobType = "";

                if (!contractTime.isBlank()) {
                    jobType = contractTime;
                }

                if (!contractType.isBlank()) {

                    if (!jobType.isBlank()) {
                        jobType += " - ";
                    }

                    jobType += contractType;
                }

                job.setType(jobType);

                // Apply URL
                job.setApplyLink(
                        obj.optString("redirect_url", ""));

                // Optional filtering by type
                if (type != null && !type.isBlank() && !type.equalsIgnoreCase("all")) {

	                	if (!job.getType().toLowerCase().contains(type.toLowerCase())) {
	                	    continue;
	                	}
                }

                jobs.add(job);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return jobs;
    }
}