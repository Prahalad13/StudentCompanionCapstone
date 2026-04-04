package com.example.demo.web.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.HelpResource;
import com.example.demo.services.HelpService;

@RestController
@RequestMapping("/api/v1/help")
public class HelpController {

    @Autowired
    private HelpService helpService;

//    @GetMapping("/{topic}")
//    public ResponseEntity<List<HelpResource>> getHelp(@PathVariable String topic) {
//        return ResponseEntity.ok(helpService.getHelpResources(topic));
//    }
    @GetMapping("/{topic}")
    public ResponseEntity<List<HelpResource>> getHelp(@PathVariable String topic) {

        List<HelpResource> list = helpService.getHelpResources(topic);

        System.out.println(">>> HELP CALLED FOR: " + topic);
        System.out.println(">>> RESPONSE: " + list);

        return ResponseEntity.ok(list);
    }
}
