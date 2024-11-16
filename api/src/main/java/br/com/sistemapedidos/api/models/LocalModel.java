package br.com.sistemapedidos.api.models;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "local")
@Data
public class LocalModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String endereco;

    @Column(nullable = false)
    private Integer rota;

    @OneToMany(mappedBy = "local", cascade = CascadeType.ALL)
    private List<PedidoModel> pedidos;
}

