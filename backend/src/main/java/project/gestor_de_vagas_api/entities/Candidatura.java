package project.gestor_de_vagas_api.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "tb_candidaturas")
public class Candidatura {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "candidatura_id")
    private Long candidaturaId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "vaga_id", nullable = false)
    private Vagas vaga;

    public enum StatusCandidatura {
        PENDENTE,
        APROVADO,
        REPROVADO
    }

    @Enumerated(EnumType.STRING)
    private StatusCandidatura status;

    @Column(length = 1000)
    private String feedback;

    @CreationTimestamp
    private Instant createdAt;

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public Long getCandidaturaId() {
        return candidaturaId;
    }

    public void setCandidaturaId(Long candidaturaId) {
        this.candidaturaId = candidaturaId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Vagas getVaga() {
        return vaga;
    }

    public void setVaga(Vagas vaga) {
        this.vaga = vaga;
    }

    public StatusCandidatura getStatus() {
        return status;
    }

    public void setStatus(StatusCandidatura status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

}


