package br.com.sistemapedidos.api.controllers;

import br.com.sistemapedidos.api.dtos.ProdutoDTO;
import br.com.sistemapedidos.api.services.ProdutoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    @PostMapping
    public ResponseEntity<ProdutoDTO> criarProduto(@RequestBody ProdutoDTO produtoDTO) {
        ProdutoDTO novoProduto = produtoService.criarProduto(produtoDTO);
        return ResponseEntity.ok(novoProduto);
    }

    @GetMapping
    public ResponseEntity<List<ProdutoDTO>> listarProdutos() {
        List<ProdutoDTO> produtos = produtoService.listarProdutos();
        return ResponseEntity.ok(produtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProdutoDTO> obterProdutoPorId(@PathVariable Long id) {
        ProdutoDTO produto = produtoService.obterProdutoPorId(id);
        return ResponseEntity.ok(produto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProdutoDTO> atualizarProduto(@PathVariable Long id, @RequestBody ProdutoDTO produtoDTO) {
        ProdutoDTO produtoAtualizado = produtoService.atualizarProduto(id, produtoDTO);
        return ResponseEntity.ok(produtoAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarProduto(@PathVariable Long id) {
        produtoService.deletarProduto(id);
        return ResponseEntity.noContent().build();
    }
}
