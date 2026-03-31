async function buscarCidade(nomeCidade) {
  if (!nomeCidade || nomeCidade.trim() === "") {
    throw new Error("Cidade não informada");
  }

  try {
    const urlGeo = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(nomeCidade)}&count=1&language=pt&format=json`;
    const respostaGeo = await fetch(urlGeo);

    if (!respostaGeo.ok) throw new Error("Erro na API");

    const dadosGeo = await respostaGeo.json();

    if (!dadosGeo.results || dadosGeo.results.length === 0) {
      throw new Error("Cidade não encontrada");
    }

    const { latitude, longitude, name, country } = dadosGeo.results[0];

    const urlClima = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,windspeed_10m`;
    const respostaClima = await fetch(urlClima);

    if (!respostaClima.ok) throw new Error("Erro na API");

    const dadosClima = await respostaClima.json();

    return {
      temperatura: dadosClima.current.temperature_2m,
      umidade: dadosClima.current.relative_humidity_2m,
      vento: dadosClima.current.windspeed_10m,
      precipitacao: dadosClima.current.precipitation,
      nomeCidade: name,
      pais: country,
    };

  } catch (erro) {
    const known = ["Cidade não encontrada", "Cidade não informada", "Erro na API"];
    if (known.includes(erro.message)) throw erro;
    throw new Error("Erro ao buscar dados da API");
  }
}

/* ================= DOM ================= */

if (typeof document !== "undefined") {

  /* --- Theme toggle --- */
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon   = document.getElementById("theme-icon");
  const themeLabel  = document.getElementById("theme-label");

  const savedTheme = localStorage.getItem("tema") || "light";
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeIcon.textContent  = "☀️";
    themeLabel.textContent = "Claro";
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    themeIcon.textContent  = isDark ? "☀️" : "🌙";
    themeLabel.textContent = isDark ? "Claro" : "Escuro";
    localStorage.setItem("tema", isDark ? "dark" : "light");
  });

  /* --- Search --- */
  const botao         = document.getElementById("buscar");
  const resultadoDiv  = document.getElementById("resultado");
  const resultSection = document.getElementById("result-section");
  const searchSection = document.getElementById("search-section");
  const cidadeInput   = document.getElementById("cidade");

  function showLoading() {
    resultadoDiv.innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
        <p>buscando dados...</p>
      </div>`;
  }

  function showResult(dados) {
    const agora = new Date().toLocaleString("pt-BR", {
      day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
    });

    resultadoDiv.innerHTML = "";

    resultSection.style.display = "block";
    resultSection.innerHTML = `
      <div class="result-card">
        <div class="city-name">${dados.nomeCidade}${dados.pais ? `, ${dados.pais}` : ""}</div>
        <div class="timestamp">Atualizado em ${agora}</div>

        <div class="temp-display">${dados.temperatura}<span>°C</span></div>

        <div class="divider"></div>

        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-icon">💧</span>
            <span class="stat-value">${dados.umidade}%</span>
            <span class="stat-label">Umidade</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">💨</span>
            <span class="stat-value">${dados.vento}</span>
            <span class="stat-label">km/h</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">🌧️</span>
            <span class="stat-value">${dados.precipitacao}</span>
            <span class="stat-label">mm</span>
          </div>
        </div>

        <button class="btn-back" id="btn-voltar">← Nova busca</button>
      </div>`;

    searchSection.style.display = "none";

    document.getElementById("btn-voltar").addEventListener("click", () => {
      resultSection.style.display = "none";
      resultSection.innerHTML = "";
      searchSection.style.display = "block";
      cidadeInput.value = "";
      cidadeInput.focus();
    });
  }

  function showError(msg) {
    resultadoDiv.innerHTML = `
      <div class="error-msg">
        <span>⚠️</span>
        <span>${msg}</span>
      </div>`;
  }

  async function handleBusca() {
    const cidade = cidadeInput.value.trim();
    showLoading();
    try {
      const dados = await buscarCidade(cidade);
      showResult(dados);
    } catch (erro) {
      showError(erro.message);
    }
  }

  if (botao) {
    botao.addEventListener("click", handleBusca);
  }

  cidadeInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleBusca();
  });
}

/* ---- Export para testes ---- */
if (typeof module !== "undefined") {
  module.exports = { buscarCidade };
}