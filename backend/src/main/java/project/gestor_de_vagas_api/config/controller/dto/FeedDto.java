package project.gestor_de_vagas_api.config.controller.dto;

import java.util.List;

public record FeedDto(List<FeedItemDto> feedItens, int page, int pageSize, int totalPages, long totalElements ) {
}
