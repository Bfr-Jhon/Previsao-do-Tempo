async function buscarCidade(nomeCidade) {
  if (!nomeCidade || nomeCidade.trim() === "") {
    throw new Error("Cidade não informada");
  }

  try {
    const urlGeo = `https://geocoding-api.open-meteo.com/v1/search?name=${nomeCidade}&count=1&language=pt&format=json`;
    const respostaGeo = await fetch(urlGeo);

    if (!respostaGeo.ok) {
      throw new Error("Erro na API");
    }

    const dadosGeo = await respostaGeo.json();

    if (!dadosGeo.results || dadosGeo.results.length === 0) {
      throw new Error("Cidade não encontrada");
    }

    const { latitude, longitude } = dadosGeo.results[0];

    // 🔥 NOVA API MAIS COMPLETA
    const urlClima = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,windspeed_10m`;

    const respostaClima = await fetch(urlClima);

    if (!respostaClima.ok) {
      throw new Error("Erro na API");
    }

    const dadosClima = await respostaClima.json();

    return {
      temperatura: dadosClima.current.temperature_2m,
      umidade: dadosClima.current.relative_humidity_2m,
      vento: dadosClima.current.windspeed_10m,
      precipitacao: dadosClima.current.precipitation
    };

  } catch (erro) {
    if (["Cidade não encontrada", "Cidade não informada", "Erro na API"].includes(erro.message)) {
      throw erro;
    }

    throw new Error("Erro ao buscar dados da API");
  }
}

/* ================= DOM ================= */

if (typeof document !== "undefined") {
  const botao = document.getElementById("buscar");

  if (botao) {
    botao.addEventListener("click", async () => {
      const cidade = document.getElementById("cidade").value;
      const resultado = document.getElementById("resultado");

      resultado.innerHTML = "⏳ Carregando...";

      try {
        const dados = await buscarCidade(cidade);

        resultado.innerHTML = `
          <div class="card">
            <h2>${cidade}</h2>
            <p>🌡️ ${dados.temperatura}°C</p>
            <p>💧 Umidade: ${dados.umidade}%</p>
            <p>💨 Vento: ${dados.vento} km/h</p>
            <p>🌧️ Precipitação: ${dados.precipitacao} mm</p>
          </div>
        `;
      } catch (erro) {
        resultado.innerHTML = `<p>${erro.message}</p>`;
      }
    });
  }
}

module.exports = { buscarCidade };