package com.social.servicesocial.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "mail_records")
public class MailRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String mailNumber;

    @Column(nullable = false)
    private String subject;

    private String senderName;

    @Column(nullable = false)
    private String receiverSection;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MailDirection direction;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MailStatus status;

    @Column(nullable = false)
    private boolean urgent;

    @Column(nullable = false)
    private LocalDateTime registeredAt;

    @Column(nullable = false)
    private LocalDateTime lastMovementAt;

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        registeredAt = now;
        lastMovementAt = now;
        if (status == null) {
            status = MailStatus.REGISTERED;
        }
    }

    @PreUpdate
    public void preUpdate() {
        lastMovementAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMailNumber() {
        return mailNumber;
    }

    public void setMailNumber(String mailNumber) {
        this.mailNumber = mailNumber;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getReceiverSection() {
        return receiverSection;
    }

    public void setReceiverSection(String receiverSection) {
        this.receiverSection = receiverSection;
    }

    public MailDirection getDirection() {
        return direction;
    }

    public void setDirection(MailDirection direction) {
        this.direction = direction;
    }

    public MailStatus getStatus() {
        return status;
    }

    public void setStatus(MailStatus status) {
        this.status = status;
    }

    public boolean isUrgent() {
        return urgent;
    }

    public void setUrgent(boolean urgent) {
        this.urgent = urgent;
    }

    public LocalDateTime getRegisteredAt() {
        return registeredAt;
    }

    public void setRegisteredAt(LocalDateTime registeredAt) {
        this.registeredAt = registeredAt;
    }

    public LocalDateTime getLastMovementAt() {
        return lastMovementAt;
    }

    public void setLastMovementAt(LocalDateTime lastMovementAt) {
        this.lastMovementAt = lastMovementAt;
    }
}
