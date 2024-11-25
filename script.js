// Variáveis globais
let saldo = 0.0;
let entradas = 0.0;
let saidas = 0.0;

// Atualiza os valores exibidos na tela
const atualizarDados = () => {
    document.querySelector("#saldo span").textContent = saldo.toFixed(2).replace('.', ',');
    document.querySelector("#entradas span").textContent = entradas.toFixed(2).replace('.', ',');
    document.querySelector("#saidas span").textContent = saidas.toFixed(2).replace('.', ',');
};

// Função para mostrar apenas a área correspondente ao botão clicado
const mostrarArea = (areaId) => {
    const areas = ["pix-area", "pagar-area", "investir-area"];
    areas.forEach((id) => {
        document.getElementById(id).style.display = id === areaId ? "block" : "none";
    });
};

// Exibe a área PIX
document.getElementById("pix").addEventListener("click", () => {
    mostrarArea("pix-area");
});

// Exibe a área Pagar
document.getElementById("pagar").addEventListener("click", () => {
    mostrarArea("pagar-area");
});

// Exibe a área Investir
document.getElementById("investir").addEventListener("click", () => {
    mostrarArea("investir-area");
});

// Alterna entre as abas da Área PIX (Receber e Transferir)
document.getElementById("aba-receber").addEventListener("click", () => {
    document.getElementById("form-receber").style.display = "block";
    document.getElementById("form-transferir").style.display = "none";
    document.getElementById("aba-receber").classList.add("active");
    document.getElementById("aba-transferir").classList.remove("active");
});

document.getElementById("aba-transferir").addEventListener("click", () => {
    document.getElementById("form-receber").style.display = "none";
    document.getElementById("form-transferir").style.display = "block";
    document.getElementById("aba-receber").classList.remove("active");
    document.getElementById("aba-transferir").classList.add("active");
});

// Processa o formulário de "Receber"
document.getElementById("receber-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const cpfCnpj = document.getElementById("cpf-cnpj").value.trim();
    const valor = parseFloat(document.getElementById("valor-receber").value);

    if (!cpfCnpj || isNaN(valor) || valor <= 0) {
        document.getElementById("erro-receber").style.display = "block";
        return;
    }

    saldo += valor;
    entradas += valor;
    atualizarDados();
    adicionarTransacao("Entrada", valor, `Recebido de ${cpfCnpj}`);
    alert(`Transação realizada com sucesso! Valor recebido: R$ ${valor.toFixed(2).replace('.', ',')}`);

    // Limpa os campos
    document.getElementById("cpf-cnpj").value = "";
    document.getElementById("valor-receber").value = "";
    document.getElementById("erro-receber").style.display = "none";
});

// Processa o formulário de "Transferir"
document.getElementById("transferir-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const chavePix = document.getElementById("chave-pix").value.trim();
    const valor = parseFloat(document.getElementById("valor-transferir").value);

    if (!chavePix || isNaN(valor) || valor <= 0) {
        document.getElementById("erro-transferir").style.display = "block";
        return;
    }

    if (valor > saldo) {
        alert("Saldo insuficiente!");
        return;
    }

    saldo -= valor;
    saidas += valor;
    atualizarDados();
    adicionarTransacao("Saída", valor, `Enviado para ${chavePix}`);
    alert(`Transação realizada com sucesso! Valor enviado: R$ ${valor.toFixed(2).replace('.', ',')}`);

    // Limpa os campos
    document.getElementById("chave-pix").value = "";
    document.getElementById("valor-transferir").value = "";
    document.getElementById("erro-transferir").style.display = "none";
});

// Adiciona uma transação à lista
const adicionarTransacao = (tipo, valor, descricao) => {
    const lista = document.querySelector("#lista-transacoes");
    const id = gerarIdUnico();
    const agora = new Date();
    const dataHora = agora.toLocaleString("pt-BR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    const item = document.createElement("div");
    item.classList.add("transacao-item");
    item.innerHTML = `
        <div>
            <strong>${tipo === "Entrada" ? "Recebido" : "Enviado"}</strong> - R$ ${valor.toFixed(2).replace('.', ',')}
        </div>
        <div>
            <small>${descricao}</small>
            <br>
            <small>ID: ${id}</small>
            <br>
            <small>${dataHora}</small>
        </div>
    `;
    lista.appendChild(item);

    // Remove a mensagem inicial "Não constam transações"
    if (lista.children.length > 1 && lista.children[0].textContent === "Não constam transações.") {
        lista.removeChild(lista.firstChild);
    }
};

// Gera um ID único para cada transação
const gerarIdUnico = () => {
    const agora = new Date();
    return `${agora.getFullYear()}${String(agora.getMonth() + 1).padStart(2, '0')}${String(agora.getDate()).padStart(2, '0')}${String(agora.getHours()).padStart(2, '0')}${String(agora.getMinutes()).padStart(2, '0')}${String(agora.getSeconds()).padStart(2, '0')}`;
};

// Inicializa os valores ao carregar a página
atualizarDados();



