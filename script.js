document.addEventListener('DOMContentLoaded', function () {
    // Seleciona o dropdown e a área onde os resultados serão exibidos
    const dropdown = document.getElementById('dropdownNomes');
    const resultadosDiv = document.getElementById('resultados');

    // Preenche o dropdown com os nomes (chaves do objeto `bam`)
    Object.keys(bam).forEach(nome => {
        const option = document.createElement('option');
        option.value = nome;
        option.textContent = nome;
        dropdown.appendChild(option);
    });

    // Função para criar uma tabela
    function criarTabela(conteudo) {
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        // Cabeçalho da tabela
        const headerRow = document.createElement('tr');
        conteudo[0].forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        // Corpo da tabela
        conteudo.slice(1).forEach(rowData => {
            const row = document.createElement('tr');
            rowData.forEach(cellData => {
                const td = document.createElement('td');
                td.textContent = cellData;
                row.appendChild(td);
            });
            tbody.appendChild(row);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        return table;
    }

    // Evento que dispara quando um nome é selecionado no dropdown
    dropdown.addEventListener('change', function () {
        const nomeSelecionado = this.value;
        resultadosDiv.innerHTML = ''; // Limpa os resultados anteriores

        // Obtém os dados correspondentes ao nome selecionado
        const resultados = bam[nomeSelecionado];

        resultados.forEach(resultado => {
            // Cria um título para cada conjunto de dados
            const titulo = document.createElement('h3');
            titulo.textContent = resultado.titulo;
            resultadosDiv.appendChild(titulo);

            // Cria a tabela de dados
            const tabela = criarTabela(resultado.conteudo);
            resultadosDiv.appendChild(tabela);
        });
    });
});
