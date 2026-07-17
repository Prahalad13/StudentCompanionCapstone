package com.example.demo.web.rest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaController {

    @RequestMapping({
        "/",
        "/login",
        "/register",
        "/dashboard",
        "/dashboard/**"
    })
    public String index() {
        return "forward:/index.html";
    }
}