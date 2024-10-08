document.addEventListener('DOMContentLoaded', function () {
    const dropdown = document.getElementById('dropdownNomes');
    const resultadosDiv = document.getElementById('resultados');
    const resultadoIcon = document.getElementById('resultadoIcon');

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

        const headerRow = document.createElement('tr');
        conteudo[0].forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

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

    // Função para carregar os resultados ao clicar no ícone
    resultadoIcon.addEventListener('click', function (event) {
        event.preventDefault();
        dropdown.style.display = 'block'; // Mostra o dropdown

        // Carrega automaticamente o primeiro nome como exemplo
        const nomeSelecionado = dropdown.options[1].value; // Exemplo: primeiro nome válido
        dropdown.value = nomeSelecionado;

        // Dispara o evento 'change' para carregar os resultados do primeiro nome
        const eventChange = new Event('change');
        dropdown.dispatchEvent(eventChange);
    });

    // Evento que dispara quando um nome é selecionado no dropdown
    dropdown.addEventListener('change', function () {
        const nomeSelecionado = this.value;
        resultadosDiv.innerHTML = ''; // Limpa os resultados anteriores

        const resultados = bam[nomeSelecionado];

        resultados.forEach(resultado => {
            const titulo = document.createElement('h3');
            titulo.textContent = resultado.titulo;
            resultadosDiv.appendChild(titulo);

            const tabela = criarTabela(resultado.conteudo);
            resultadosDiv.appendChild(tabela);
        });
    });
});
