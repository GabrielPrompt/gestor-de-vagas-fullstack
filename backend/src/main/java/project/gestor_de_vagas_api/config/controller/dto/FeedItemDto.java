package project.gestor_de_vagas_api.config.controller.dto;

import java.time.Instant;

public record FeedItemDto(
        Long vagaId,
        String titulo,
        String empresa,
        String localizacao,
        String salario,
        String experiencia,
        String modalidade,
        String criadoPor,
        Instant criadaEm
) {
}
