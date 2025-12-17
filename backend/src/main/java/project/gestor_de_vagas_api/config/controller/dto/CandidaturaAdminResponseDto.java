package project.gestor_de_vagas_api.config.controller.dto;

import java.time.Instant;
import java.util.UUID;

public record CandidaturaAdminResponseDto(
        Long candidaturaId,
        Long vagaId,
        String tituloVaga,
        String nomeEmpresa,
        UUID userId,
        String nomeUsuario,
        String status,
        String feedback,
        Instant createdAt
) {
}
