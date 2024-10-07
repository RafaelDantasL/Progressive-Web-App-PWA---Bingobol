// Função para buscar e carregar dados do site externo
async function carregarDados() {
    try {
        // URL do site de onde os dados serão carregados (exemplo fictício)
        const url = 'https://exemplo.com/dados'; // Substitua com a URL real

        // Fazendo uma solicitação para o site
        const response = await fetch(url);
        const text = await response.text();

        // Criando um elemento temporário para manipular o conteúdo da página
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');

        // Selecionando as tabelas do site original
        const tabela1 = doc.querySelector('table#tabela1'); // Ajuste o seletor conforme a estrutura do site original
        const tabela2 = doc.querySelector('table#tabela2'); // Ajuste o seletor conforme a estrutura do site original

        // Inserindo as tabelas na página local
        document.getElementById('tabela1').innerHTML = tabela1.innerHTML;
        document.getElementById('tabela2').innerHTML = tabela2.innerHTML;

    } catch (error) {
        console.error('Erro ao carregar os dados:', error);
    }
}

// Chamando a função quando a página é carregada
window.onload = carregarDados;
