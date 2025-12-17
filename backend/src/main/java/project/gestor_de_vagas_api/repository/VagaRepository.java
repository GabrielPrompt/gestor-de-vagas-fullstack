package project.gestor_de_vagas_api.repository;

import org.hibernate.query.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.gestor_de_vagas_api.entities.Vagas;

@Repository
public interface VagaRepository extends JpaRepository<Vagas, Long> {

}
