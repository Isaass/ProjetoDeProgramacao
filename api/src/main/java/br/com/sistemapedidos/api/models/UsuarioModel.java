package br.com.sistemapedidos.api.models;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "usuario")
@Data
public class UsuarioModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome_usuario", nullable = false, unique = true)
    private String nomeUsuario;

    @Column(name = "nome_completo", nullable = false)
    private String nomeCompleto; // Novo campo para o nome completo

    @Column(nullable = false)
    private String senha;

    @Column(nullable = false)
    private String role; // Agora pode ser "Administrador" ou "Cabo de Turma"

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    private List<PedidoModel> pedidos;
}
