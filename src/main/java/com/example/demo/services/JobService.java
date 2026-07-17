package com.example.demo.services;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.demo.domain.Job;

@Service
public class JobService {

    private final String API_KEY =
            "bc7a919683msh51e8ac79f474a47p1a0e2bjsn724b22e338a7";

    private final String API_HOST =
            "jsearch.p.rapidapi.com";

    public List<Job> searchJobs(
            String title,
            String city,
            String type) {

        List<Job> jobs =
                new ArrayList<>();

        try {

            String query =
                    title + " jobs in " + city;

            String encodedQuery =
                    URLEncoder.encode(
                            query,
                            StandardCharsets.UTF_8);

            String remoteFilter = "";

            // Remote Jobs
            if (type.equalsIgnoreCase(
                    "remote")) {

                remoteFilter =
                        "&remote_jobs_only=true";
            }

            // In Person Jobs
            else if (type.equalsIgnoreCase(
                    "inperson")) {

                remoteFilter =
                        "&remote_jobs_only=false";
            }

            // Hybrid Jobs
            else {

                remoteFilter = "";
            }

            String url =
            		"https://jsearch.p.rapidapi.com/search-v2"
                    + "?query=" + encodedQuery
                    + "&page=1"
                    + "&num_pages=1"
                    + "&country=ca"
                    + remoteFilter;

            RestTemplate restTemplate =
                    new RestTemplate();

            HttpHeaders headers =
                    new HttpHeaders();

            headers.set(
                    "X-RapidAPI-Key",
                    API_KEY);

            headers.set(
                    "X-RapidAPI-Host",
                    API_HOST);

            HttpEntity<String> entity =
                    new HttpEntity<>(headers);

            ResponseEntity<String> response =
                    restTemplate.exchange(
                            url,
                            HttpMethod.GET,
                            entity,
                            String.class);

            System.out.println("========== RAPID API RESPONSE ==========");
            System.out.println(response.getBody());
            System.out.println("========================================");

            JSONObject jsonObject =
                    new JSONObject(response.getBody());

            if (!jsonObject.has("data")) {
                return jobs;
            }

            JSONObject data =
                    jsonObject.getJSONObject("data");

            JSONArray jobsArray =
                    data.getJSONArray("jobs");

            for (int i = 0;
                 i < jobsArray.length();
                 i++) {

                JSONObject obj =
                        jobsArray.getJSONObject(i);

                Job job =
                        new Job();

                job.setTitle(
                        obj.optString(
                                "job_title"));
                job.setCompanyName(
                        obj.optString("employer_name"));
                job.setCity(
                        obj.optString(
                                "job_city"));

                job.setType(
                        obj.optString(
                                "job_employment_type"));
                
                job.setApplyLink(
                        obj.optString("job_apply_link"));

                jobs.add(job);
            }
        } catch (Exception e) {

            e.printStackTrace();
        }

        return jobs;
    }
}