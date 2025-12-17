package project.gestor_de_vagas_api.config.controller.dto;

import project.gestor_de_vagas_api.entities.Candidatura;

import java.time.Instant;

public record CandidaturaResponseDto(
        Long candidaturaId,
        String username,
        Candidatura.StatusCandidatura status,
        Instant createdAt
) {}
