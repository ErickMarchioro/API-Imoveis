class Imovel {
    constructor(id, titulo, descricao, endereco, cidade, estado, cep,
                tipo, quartos, banheiros, precoPorNoite, disponivel,
                idProprietario, imageUrls = []) {
        this.id = id; 
        this.titulo = titulo;
        this.descricao = descricao;
        this.endereco = endereco;
        this.cidade = cidade;
        this.estado = estado;
        this.cep = cep;
        this.tipo = tipo; 
        this.quartos = quartos;
        this.banheiros = banheiros;
        this.precoPorNoite = precoPorNoite;
        this.disponivel = disponivel;
        this.idProprietario = idProprietario; 
        this.imageUrls = imageUrls;
        this.dataCriacao = new Date(); 
    }

    static build(json) {
        return new Imovel(
            json.id,
            json.titulo,
            json.descricao,
            json.endereco,
            json.cidade,
            json.estado,
            json.cep,
            json.tipo,
            json.quartos,
            json.banheiros,
            json.precoPorNoite,
            json.disponivel,
            json.idProprietario,
            json.imageUrls
        );
    }
}

export default Imovel;