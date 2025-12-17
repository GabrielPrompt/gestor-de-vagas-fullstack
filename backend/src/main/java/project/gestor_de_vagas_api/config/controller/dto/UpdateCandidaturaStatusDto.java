package project.gestor_de_vagas_api.config.controller.dto;

import project.gestor_de_vagas_api.entities.Candidatura;

public record UpdateCandidaturaStatusDto(
        Candidatura.StatusCandidatura status
) {}
