package br.com.sistemapedidos.api.services;

import br.com.sistemapedidos.api.dtos.EstoqueDTO;
import br.com.sistemapedidos.api.models.EstoqueModel;
import br.com.sistemapedidos.api.repositories.EstoqueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class EstoqueService {

    @Autowired
    private EstoqueRepository estoqueRepository;

    public EstoqueModel adicionarEstoque(EstoqueDTO estoqueDTO) {
        EstoqueModel estoque = new EstoqueModel(estoqueDTO.getProdutoId(), estoqueDTO.getQuantidade());
        return estoqueRepository.save(estoque);
    }

    public Optional<EstoqueModel> obterEstoque(Long id) {
        return estoqueRepository.findById(id);
    }

    public EstoqueModel atualizarEstoque(Long id, EstoqueDTO estoqueDTO) {
        Optional<EstoqueModel> estoqueExistente = estoqueRepository.findById(id);
        if (estoqueExistente.isPresent()) {
            EstoqueModel estoque = estoqueExistente.get();
            estoque.setQuantidade(estoqueDTO.getQuantidade());
            return estoqueRepository.save(estoque);
        } else {
            throw new RuntimeException("Estoque não encontrado.");
        }
    }

    public void removerEstoque(Long id) {
        estoqueRepository.deleteById(id);
    }

    public Optional<EstoqueModel> obterEstoquePorProdutoId(Long produtoId) {
        return Optional.ofNullable(estoqueRepository.findByProdutoId(produtoId));
    }
}
