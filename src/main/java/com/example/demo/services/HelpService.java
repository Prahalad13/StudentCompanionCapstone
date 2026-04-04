package com.example.demo.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.dto.HelpResource;

@Service
public class HelpService {

    public List<HelpResource> getHelpResources(String topic) {

        //String query = topic.replace(" ", "+");
    	    String query = topic.toLowerCase().replace(" ", "+");

        List<HelpResource> resources = new ArrayList<>();

        resources.add(new HelpResource(
                "YouTube Tutorials",
                "https://www.youtube.com/results?search_query=" + query
        ));

        resources.add(new HelpResource(
                "Google Search",
                "https://www.google.com/search?q=" + query
        ));

        resources.add(new HelpResource(
                "Khan Academy",
                "https://www.khanacademy.org/search?page_search_query=" + query
        ));

        resources.add(new HelpResource(
                "GeeksforGeeks",
                "https://www.google.com/search?q=" + query + "+site:geeksforgeeks.org"
        ));

        return resources;
    }
}
