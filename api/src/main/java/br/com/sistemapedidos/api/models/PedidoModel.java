package br.com.sistemapedidos.api.models;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "pedido")
@Data
public class PedidoModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "local_id", nullable = false)
    private LocalModel local;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PedidoItemModel> itens; // Relacionamento com os itens do pedido

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private UsuarioModel usuario;

    @Column(nullable = false)
    private LocalDate data; // Campo para armazenar a data de criação do pedido
}
