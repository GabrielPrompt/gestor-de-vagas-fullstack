package project.gestor_de_vagas_api.config.controller.dto;

import java.time.Instant;

public record MinhaCandidaturaResponseDto(
        Long candidaturaId,
        Long vagaId,
        String tituloVaga,
        String status,
        String feedback,
        String salario,
        String experiencia,
        String modalidade,
        Instant createdAt
) {}
