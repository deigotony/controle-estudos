document.getElementById('form-estudo').addEventListener('submit', async (e) => {
    e.preventDefault();

    const dados = {
        data: document.getElementById('data').value,
        enem: document.getElementById('enem').value,
        obmep1: document.getElementById('obmep1').value,
        obmep2: document.getElementById('obmep2').value,
        tempo: document.getElementById('tempo').value
    };

    const resposta = await fetch('/salvar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });

    if (resposta.ok) {
        alert("Sessão salva!");
        e.target.reset();
    }
});

const btnConferir = document.getElementById('btn-conferir');
const containerHistorico = document.getElementById('tabela-historico');

btnConferir.addEventListener('click', async () => {
    try {
        const resposta = await fetch('/historico');
        const dados = await resposta.json();

        if (dados.length === 0) {
            containerHistorico.innerHTML = "<p style='padding:20px; text-align:center;'>Nenhum registro encontrado.</p>";
            return;
        }

        let html = `
            <table>
                <thead>
                    <tr>
                        <th>DATA</th>
                        <th>ENEM</th>
                        <th>OBMEP 1</th>
                        <th>OBMEP 2</th>
                        <th>TEMPO</th>
                    </tr>
                </thead>
                <tbody>
        `;

        dados.forEach(sessao => {
            // Formata a data de AAAA-MM-DD para DD/MM
            const dataObj = new Date(sessao.data_estudo);
            const dataFormatada = dataObj.toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'});

            html += `
                <tr>
                    <td>${dataFormatada}</td>
                    <td>${sessao.questoesENEM}</td>
                    <td>${sessao.questoesOBMEP1}</td>
                    <td>${sessao.questoesOBMEP2}</td>
                    <td>${sessao.tempo_estudo_minutos}m</td>
                </tr>
            `;
        });

        html += "</tbody></table>";
        containerHistorico.innerHTML = html;

    } catch (erro) {
        console.error(erro);
        alert("Erro ao carregar dados.");
    }
});