package project.gestor_de_vagas_api.config.controller;

import jakarta.transaction.Transactional;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import project.gestor_de_vagas_api.config.controller.dto.*;
import project.gestor_de_vagas_api.entities.Role;
import project.gestor_de_vagas_api.entities.Vagas;
import project.gestor_de_vagas_api.repository.CandidaturaRepository;
import project.gestor_de_vagas_api.repository.UserRepository;
import project.gestor_de_vagas_api.repository.VagaRepository;

import java.util.UUID;

@RestController
public class VagaController {

    private final VagaRepository vagaRepository;

    private final UserRepository userRepository;

    private final CandidaturaRepository candidaturaRepository;

    public VagaController(VagaRepository vagaRepository, UserRepository userRepository, CandidaturaRepository candidaturaRepository) {
        this.vagaRepository = vagaRepository;
        this.userRepository = userRepository;
        this.candidaturaRepository = candidaturaRepository;
    }

    @GetMapping("/feed")
    public ResponseEntity<FeedDto> feed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize
    ) {

        var pageRequest = PageRequest.of(
                page,
                pageSize,
                Sort.by(Sort.Direction.DESC, "creationTimestamp")
        );

        var vagasPage = vagaRepository.findAll(pageRequest);

        var feedItems = vagasPage.map(vaga ->
                new FeedItemDto(
                        vaga.getVagaId(),
                        vaga.getTitulo(),
                        vaga.getEmpresa(),
                        vaga.getLocalizacao(),
                        vaga.getSalario(),
                        vaga.getExperiencia(),
                        vaga.getModalidade(),
                        vaga.getUser().getUsername(),
                        vaga.getCreationTimestamp()
                )
        );

        return ResponseEntity.ok(
                new FeedDto(
                        feedItems.getContent(),
                        page,
                        pageSize,
                        vagasPage.getTotalPages(),
                        vagasPage.getTotalElements()
                )
        );
    }

    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    @PostMapping("/vagas")
    public ResponseEntity<Void> createVaga(
            @RequestBody CreateVagaDto dto,
            JwtAuthenticationToken token
    ) {
        var user = userRepository.findById(UUID.fromString(token.getName()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        var vaga = new Vagas();
        vaga.setUser(user);
        vaga.setTitulo(dto.titulo());
        vaga.setEmpresa(dto.empresa());
        vaga.setLocalizacao(dto.localizacao());
        vaga.setSalario(dto.salario());
        vaga.setExperiencia(dto.experiencia());
        vaga.setModalidade(dto.modalidade());

        vagaRepository.save(vaga);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    @PutMapping("/vagas/{vagaId}")
    public ResponseEntity<Void> editVaga(
            @PathVariable Long vagaId,
            @RequestBody EditVagaDto dto
    ) {
        var vaga = vagaRepository.findById(vagaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        vaga.setTitulo(dto.titulo());
        vaga.setEmpresa(dto.empresa());
        vaga.setLocalizacao(dto.localizacao());
        vaga.setSalario(dto.salario());
        vaga.setExperiencia(dto.experiencia());
        vaga.setModalidade(dto.modalidade());

        vagaRepository.save(vaga);

        return ResponseEntity.noContent().build();
    }

    @Transactional
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    @DeleteMapping("/vagas/{id}")
    public ResponseEntity<Void> deleteVaga(@PathVariable Long id) {

        if (!vagaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        candidaturaRepository.deleteByVaga_VagaId(id);
        vagaRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    @GetMapping("/vagas/{id}")
    public ResponseEntity<VagaResponseDto> getVagaById(@PathVariable Long id) {

        var vaga = vagaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        var response = new VagaResponseDto(
                vaga.getVagaId(),
                vaga.getTitulo(),
                vaga.getEmpresa(),
                vaga.getLocalizacao(),
                vaga.getSalario(),
                vaga.getExperiencia(),
                vaga.getModalidade(),
                vaga.getCreationTimestamp()
        );

        return ResponseEntity.ok(response);
    }

}
