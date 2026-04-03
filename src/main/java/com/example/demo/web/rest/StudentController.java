package com.example.demo.web.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.domain.Student;
import com.example.demo.domain.User;
import com.example.demo.repositories.UserRepository;
import com.example.demo.services.StudentService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/v1/students")
@SecurityRequirement(name = "Bearer Authentication")
public class StudentController {

    @Autowired
    private StudentService studentService;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Student> getAll() {
        return studentService.findAll();
    }

//    @PostMapping
//    public Student save(@RequestBody Student s) {
//        return service.save(s);
//    }
    
 // CREATE STUDENT FOR LOGGED-IN USER
    @PostMapping
    public ResponseEntity<?> createStudent(@RequestBody Student student, Authentication auth) {

        String email = auth.getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        // Prevent multiple students per user
        if (studentService.findByUser(user).isPresent()) {
            return ResponseEntity.badRequest().body("Student already exists for this user");
        }

        student.setUser(user);
        Student saved = studentService.save(student);

        return ResponseEntity.ok(saved);
    }
    
// // CHECK IF LOGGED-IN USER ALREADY HAS A STUDENT
//    @GetMapping("/me")
//    public ResponseEntity<Student> getMyStudent(Authentication auth) {
//        String email = auth.getName();
//        User user = userRepository.findByEmail(email).orElseThrow();
//
//        return studentService.findByUserId(user.getId())
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.noContent().build());
//    }
    @GetMapping("/me")
    public ResponseEntity<?> getMyStudent(Authentication auth) {

        String email = auth.getName();
        System.out.println("AUTH EMAIL 👉 " + email);

        User user = userRepository.findByEmail(email).orElseThrow();

        return studentService.findByUser(user) // ✅ correct
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.ok(null)); // ✅ no 204
    }
     
    
}
