package project.gestor_de_vagas_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.gestor_de_vagas_api.entities.Candidatura;

import java.util.List;
import java.util.UUID;

public interface CandidaturaRepository extends JpaRepository<Candidatura, Long> {

    List<Candidatura> findByVaga_VagaId(Long vagaId);

    void deleteByUser_UserIdAndVaga_VagaId(UUID userId, Long vagaId);

    void deleteByVaga_VagaId(Long vagaId);

    boolean existsByUser_UserIdAndVaga_VagaId(
            java.util.UUID userId,
            Long vagaId
    );

    List<Candidatura> findByUser_UserId(UUID userId);
}


