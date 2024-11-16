package br.com.sistemapedidos.api.controllers;

import br.com.sistemapedidos.api.dtos.EstoqueDTO;
import br.com.sistemapedidos.api.models.EstoqueModel;
import br.com.sistemapedidos.api.services.EstoqueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/estoque")
public class EstoqueController {

    @Autowired
    private EstoqueService estoqueService;

    @PostMapping
    public ResponseEntity<EstoqueModel> adicionarEstoque(@RequestBody EstoqueDTO estoqueDTO) {
        EstoqueModel novoEstoque = estoqueService.adicionarEstoque(estoqueDTO);
        return ResponseEntity.ok(novoEstoque);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EstoqueModel> obterEstoque(@PathVariable Long id) {
        Optional<EstoqueModel> estoque = estoqueService.obterEstoque(id);
        return estoque.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<EstoqueModel> atualizarEstoque(@PathVariable Long id, @RequestBody EstoqueDTO estoqueDTO) {
        try {
            EstoqueModel estoqueAtualizado = estoqueService.atualizarEstoque(id, estoqueDTO);
            return ResponseEntity.ok(estoqueAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removerEstoque(@PathVariable Long id) {
        estoqueService.removerEstoque(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/produto/{produtoId}")
    public ResponseEntity<EstoqueModel> obterEstoquePorProdutoId(@PathVariable Long produtoId) {
        Optional<EstoqueModel> estoque = estoqueService.obterEstoquePorProdutoId(produtoId);
        return estoque.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}
