document.addEventListener('DOMContentLoaded', function () {
    const dropdown = document.getElementById('dropdownNomes');
    const resultadosDiv = document.getElementById('resultados');
    const resultadoIcon = document.getElementById('resultadoIcon');
    const palpiteIcon = document.getElementById('palpiteIcon');

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

    // Função para limpar os resultados e exibir apenas o dropdown e o botão de palpite
    function mostrarPalpiteUI() {
        resultadosDiv.innerHTML = ''; // Limpa os resultados anteriores
        const buttonGerar = document.createElement('button');
        buttonGerar.textContent = 'Gerar Palpite';
        buttonGerar.id = 'gerarPalpite';
        resultadosDiv.appendChild(buttonGerar);
        
        // Evento para gerar o palpite
        buttonGerar.addEventListener('click', gerarPalpite);
    }

    // Função para carregar os resultados ao clicar no ícone "Resultado"
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

    // Evento para exibir o botão "Gerar Palpite" ao clicar no ícone "Palpite"
    palpiteIcon.addEventListener('click', function (event) {
        event.preventDefault();
        mostrarPalpiteUI();
        carregarPalpitesSalvos();
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

    // Função para gerar o palpite com base nos últimos 10 números
    function gerarPalpite() {
        const nomeSelecionado = dropdown.value;
        const resultados = bam[nomeSelecionado];

        // Pega os 10 últimos números da segunda coluna da tabela
        const ultimosDez = resultados[0].slice(-10).map(row => row[1]); 

        const milhar = analisarCasaDecimal(ultimosDez, 0);
        const centena = analisarCasaDecimal(ultimosDez, 1);
        const dezena = analisarCasaDecimal(ultimosDez, 2);
        const unidade = analisarCasaDecimal(ultimosDez, 3);

        // Gera os 30 palpites sem repetição
        const palpites = gerarCombinacoesPalpites(milhar, centena, dezena, unidade);

        // Salva os palpites no localStorage
        localStorage.setItem('palpites', JSON.stringify(palpites));
        localStorage.setItem('ultimosDez', JSON.stringify(ultimosDez));

        // Exibe os palpites gerados
        exibirPalpites(palpites);
    }

    // Função para analisar os números mais frequentes em cada casa decimal
    function analisarCasaDecimal(numeros, casa) {
        const freq = {};
        numeros.forEach(num => {
            const digito = num[casa];
            freq[digito] = (freq[digito] || 0) + 1;
        });
        // Ordena por frequência e retorna os três primeiros mais frequentes
        return Object.keys(freq).sort((a, b) => freq[b] - freq[a]).slice(0, 3);
    }

    // Função para gerar 30 combinações de palpites
    function gerarCombinacoesPalpites(milhar, centena, dezena, unidade) {
        const palpites = new Set(); // Usamos Set para evitar repetições

        while (palpites.size < 30) {
            const palpite = `${milhar[Math.floor(Math.random() * milhar.length)]}${centena[Math.floor(Math.random() * centena.length)]}${dezena[Math.floor(Math.random() * dezena.length)]}${unidade[Math.floor(Math.random() * unidade.length)]}`;
            palpites.add(palpite);
        }

        return Array.from(palpites);
    }

    // Função para exibir os palpites
    function exibirPalpites(palpites) {
        resultadosDiv.innerHTML = ''; // Limpa os resultados anteriores
        const listaPalpites = document.createElement('ul');
        palpites.forEach(palpite => {
            const li = document.createElement('li');
            li.textContent = palpite;
            listaPalpites.appendChild(li);
        });
        resultadosDiv.appendChild(listaPalpites);
    }

    // Função para carregar palpites salvos no localStorage
    function carregarPalpitesSalvos() {
        const palpitesSalvos = JSON.parse(localStorage.getItem('palpites'));
        if (palpitesSalvos) {
            exibirPalpites(palpitesSalvos);
        }
    }
});
