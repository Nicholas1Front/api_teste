const itemsRepository = require('./items_repository');

/**
 * Service responsável por gerenciar as regras de negócio relacionadas aos itens.
 * 
 * Aqui ficam centralizadas as validações e regras antes de acessar o repository,
 * garantindo que os dados estejam corretos antes de serem persistidos ou consultados
 * no banco de dados.
 * 
 * Responsabilidades:
 * - Criar itens
 * - Atualizar itens
 * - Remover itens
 * - Buscar itens com filtros
 * - Listar todos os itens
 */
class ItemsService{

    /**
     * Cria um novo item no sistema.
     * 
     * Antes da criação, verifica se já existe um item com o mesmo nome
     * para evitar duplicidade.
     * 
     * @param {Object} itemData - Dados do item a ser criado
     * @param {string} itemData.name - Nome do item
     * @param {string} itemData.description - Descrição do item
     * @param {number} itemData.price - Preço do item
     * @param {number} itemData.quantity - Quantidade disponível em estoque
     * 
     * @returns {Object} item criado
    */
    async createItem(itemData){

        // Verifica se já existe um item com o mesmo nome
        const existingItem = await itemsRepository.find({ name : itemData.name});

        // Caso já exista, impede a criação para evitar duplicidade
        if(existingItem.length > 0){
            throw new Error('Item with the same name already exists');
        }

        // Cria o item no banco de dados através do repository
        const item = await itemsRepository.create({
            name : itemData.name,
            description : itemData.description,
            price : itemData.price,
            quantity_available : itemData.quantity
        });

        // Retorna o item criado
        return item;
    }

    /**
     * Atualiza os dados de um item existente.
     * 
     * Primeiro valida se o item realmente existe no banco,
     * depois executa a atualização.
     * 
     * @param {Object} params
     * @param {number|string} params.itemId - ID do item a ser atualizado
     * @param {Object} params.itemData - Novos dados do item
     * 
     * @returns {Object} item atualizado
    */
    async updateItem({
        itemId,
        itemData
    }){

        // Busca o item para verificar se ele existe
        const existingItem = await itemsRepository.find({ id : itemId });

        // Caso não exista, lança erro
        if(existingItem.length === 0){
            throw new Error('Item not found');
        }

        // Atualiza o item no banco
        const item = await itemsRepository.update({
            id : itemId,
            itemData : itemData
        });

        // Retorna o item atualizado
        return item;
    }

    /**
     * Remove um item do sistema.
     * 
     * Antes de remover, verifica se o item existe no banco.
     * 
     * @param {number|string} id - ID do item
     * 
     * @returns {boolean} true se o item foi removido com sucesso
    */
    async deleteItem(id){

        // Verifica se o item existe
        const existingItem = await itemsRepository.find({ id });

        // Caso não exista, lança erro
        if(existingItem.length === 0){
            throw new Error('Item not found');
        }

        // Executa a exclusão no banco de dados
        await itemsRepository.delete(id);

        // Retorna true indicando sucesso
        return true;
    }

    /**
     * Busca itens aplicando filtros específicos.
     * 
     * Os filtros são opcionais e podem incluir:
     * id, nome, descrição ou preço.
     * 
     * @param {Object} filters - Filtros de busca
     * 
     * @returns {Array<Object>} lista de itens encontrados
    */
    async findItems(filters){

        // Busca itens no banco aplicando os filtros informados
        const items = await itemsRepository.find({
            id : filters.id,
            name : filters.name,
            description : filters.description,
            price : filters.price
        });

        // Retorna os itens encontrados
        return items;
    }

    /*
     * Retorna todos os itens cadastrados no sistema.
     * 
     * @returns {Array<Object>} lista completa de itens
    */
    async findAllItems(){

        // Busca todos os itens no banco
        const items = await itemsRepository.findAll();

        // Retorna a lista de itens
        return items;
    }
}

module.exports = new ItemsService();