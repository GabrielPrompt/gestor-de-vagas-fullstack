package project.gestor_de_vagas_api.config.controller.dto;

import java.time.Instant;

public record VagaResponseDto(
        Long vagaId,
        String titulo,
        String empresa,
        String localizacao,
        String salario,
        String experiencia,
        String modalidade,
        Instant createdAt
) {}
