package project.gestor_de_vagas_api.config.controller;

import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import project.gestor_de_vagas_api.config.controller.dto.*;
import project.gestor_de_vagas_api.entities.Candidatura;
import project.gestor_de_vagas_api.repository.CandidaturaRepository;
import project.gestor_de_vagas_api.repository.UserRepository;
import project.gestor_de_vagas_api.repository.VagaRepository;

import java.util.List;
import java.util.UUID;

@RestController
public class CandidaturaController {

    private final CandidaturaRepository candidaturaRepository;
    private final VagaRepository vagaRepository;
    private final UserRepository userRepository;

    public CandidaturaController(
            CandidaturaRepository candidaturaRepository,
            VagaRepository vagaRepository,
            UserRepository userRepository
    ) {
        this.candidaturaRepository = candidaturaRepository;
        this.vagaRepository = vagaRepository;
        this.userRepository = userRepository;
    }

    @PreAuthorize("hasAuthority('SCOPE_BASIC')")
    @PostMapping("/vagas/{id}/candidatar")
    public ResponseEntity<Void> candidatar(
            @PathVariable("id") Long vagaId,
            JwtAuthenticationToken token
    ) {

        var userId = UUID.fromString(token.getName());

        var user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        var vaga = vagaRepository.findById(vagaId)
                .orElseThrow(() -> new RuntimeException("Vaga not found"));

        if (candidaturaRepository.existsByUser_UserIdAndVaga_VagaId(userId, vagaId)) {
            return ResponseEntity.status(409).build();
        }

        var candidatura = new Candidatura();
        candidatura.setUser(user);
        candidatura.setVaga(vaga);
        candidatura.setStatus(Candidatura.StatusCandidatura.PENDENTE);

        candidaturaRepository.save(candidatura);

        return ResponseEntity.ok().build();
    }

    @Transactional
    @PreAuthorize("hasAuthority('SCOPE_BASIC')")
    @DeleteMapping("/vagas/{id}/candidatar")
    public ResponseEntity<Void> cancelarCandidatura(
            @PathVariable("id") Long vagaId,
            JwtAuthenticationToken token
    ) {
        UUID userId = UUID.fromString(token.getName());

        if (!candidaturaRepository.existsByUser_UserIdAndVaga_VagaId(userId, vagaId)) {
            return ResponseEntity.notFound().build();
        }

        candidaturaRepository.deleteByUser_UserIdAndVaga_VagaId(userId, vagaId);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    @GetMapping("/vagas/{id}/candidaturas")
    public ResponseEntity<List<CandidaturaResponseDto>> listarCandidaturas(
            @PathVariable("id") Long vagaId
    ) {

        var candidaturas = candidaturaRepository.findByVaga_VagaId(vagaId);

        var response = candidaturas.stream()
                .map(c -> new CandidaturaResponseDto(
                        c.getCandidaturaId(),
                        c.getUser().getUsername(),
                        c.getStatus(),
                        c.getCreatedAt()
                ))
                .toList();

        return ResponseEntity.ok(response);
    }

    @Transactional
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    @PutMapping("/candidaturas/{id}/status")
    public ResponseEntity<Void> atualizarStatus(
            @PathVariable("id") Long candidaturaId,
            @RequestBody UpdateCandidaturaStatusDto dto
    ) {

        var candidaturaOpt = candidaturaRepository.findById(candidaturaId);

        if (candidaturaOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        var candidatura = candidaturaOpt.get();

        if (dto.status() == Candidatura.StatusCandidatura.PENDENTE) {
            return ResponseEntity.badRequest().build();
        }

        candidatura.setStatus(dto.status());
        candidaturaRepository.save(candidatura);

        return ResponseEntity.noContent().build();
    }

    @Transactional
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    @PutMapping("/candidaturas/{id}/feedback")
    public ResponseEntity<Void> atualizarFeedback(
            @PathVariable("id") Long candidaturaId,
            @RequestBody UpdateCandidaturaFeedbackDto dto
    ) {

        var candidatura = candidaturaRepository.findById(candidaturaId)
                .orElseThrow(() -> new RuntimeException("Candidatura não encontrada"));

        if (candidatura.getStatus() == Candidatura.StatusCandidatura.PENDENTE) {
            return ResponseEntity
                    .badRequest()
                    .build();
        }

        candidatura.setFeedback(dto.feedback());
        candidaturaRepository.save(candidatura);

        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAuthority('SCOPE_BASIC')")
    @GetMapping("/candidaturas/minhas")
    public ResponseEntity<List<MinhaCandidaturaResponseDto>> minhasCandidaturas(
            JwtAuthenticationToken token
    ) {

        var userId = UUID.fromString(token.getName());

        var candidaturas = candidaturaRepository.findByUser_UserId(userId);

        var response = candidaturas.stream()
                .map(c -> new MinhaCandidaturaResponseDto(
                        c.getCandidaturaId(),
                        c.getVaga().getVagaId(),
                        c.getVaga().getTitulo(),
                        c.getStatus().name(),
                        c.getFeedback(),
                        c.getVaga().getSalario(),
                        c.getVaga().getExperiencia(),
                        c.getVaga().getModalidade(),
                        c.getCreatedAt()
                ))
                .toList();

        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    @GetMapping("/candidaturas")
    public ResponseEntity<List<CandidaturaAdminResponseDto>> listarTodas() {

        var candidaturas = candidaturaRepository.findAll();

        var response = candidaturas.stream()
                .map(c -> new CandidaturaAdminResponseDto(
                        c.getCandidaturaId(),
                        c.getVaga().getVagaId(),
                        c.getVaga().getTitulo(),
                        c.getVaga().getEmpresa(),
                        c.getUser().getUserId(),
                        c.getUser().getUsername(),
                        c.getStatus().name(),
                        c.getFeedback(),
                        c.getCreatedAt()
                ))
                .toList();

        return ResponseEntity.ok(response);
    }
}
