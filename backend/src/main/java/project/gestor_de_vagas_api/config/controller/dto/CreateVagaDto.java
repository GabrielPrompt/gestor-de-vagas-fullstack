package project.gestor_de_vagas_api.config.controller.dto;

public record CreateVagaDto(
        String titulo,
        String empresa,
        String localizacao,
        String salario,
        String experiencia,
        String modalidade
) {}
