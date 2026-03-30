async function buscarCidade(nomeCidade) {
  if (!nomeCidade || nomeCidade.trim() === "") {
    throw new Error("Cidade não informada");
  }

  try {
    const urlGeo = `https://geocoding-api.open-meteo.com/v1/search?name=${nomeCidade}&count=1&language=pt&format=json`;

    const geoResponse = await fetch(urlGeo);

    if (!geoResponse.ok) {
      throw new Error("Erro na API de geolocalização");
    }

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("Cidade não encontrada");
    }

    const { latitude, longitude, name } = geoData.results[0];

    const urlClima = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

    const climaResponse = await fetch(urlClima);

    if (!climaResponse.ok) {
      throw new Error("Erro na API de clima");
    }

    const climaData = await climaResponse.json();

    if (!climaData.current_weather) {
      throw new Error("Formato inesperado da resposta");
    }

    return {
      cidade: name,
      temperatura: climaData.current_weather.temperature,
    };

  } catch (erro) {
    throw new Error(erro.message || "Erro inesperado");
  }
}

/* 👇 FUNCIONA NO JEST */
if (typeof module !== "undefined") {
  module.exports = { buscarCidade };
}

/* 👇 FUNCIONA NO NAVEGADOR */
if (typeof window !== "undefined") {
  window.buscarCidade = buscarCidade;
}

/* 👇 DOM FICA AQUI (como você pediu) */
if (typeof document !== "undefined") {
  const botao = document.getElementById("buscar");

  if (botao) {
    botao.addEventListener("click", async () => {
      const cidade = document.getElementById("cidade").value;
      const resultado = document.getElementById("resultado");

      try {
        const dados = await buscarCidade(cidade);
        resultado.innerText = `${dados.cidade}: ${dados.temperatura}°C`;
      } catch (erro) {
        resultado.innerText = erro.message;
      }
    });
  }
}