package com.example.demo.services;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.example.demo.domain.Assessment;
import com.example.demo.repositories.AssessmentRepository;

@Service
public class ReminderService {

    @Autowired
    private AssessmentRepository repo;

    /**
     * Runs every day at 9 AM
     */
    @Scheduled(cron = "0 0 9 * * *")
    public void sendReminders() {

        List<Assessment> upcoming = repo.findByDueDateAfter(LocalDate.now());

        for (Assessment a : upcoming) {

            long days = ChronoUnit.DAYS.between(LocalDate.now(), a.getDueDate());

            if (days <= 2) {
                System.out.println("Reminder: " + a.getTitle() + " due in " + days + " days");
            }
        }
    }
}
