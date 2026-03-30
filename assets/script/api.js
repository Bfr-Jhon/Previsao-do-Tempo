const botao = document.getElementById("buscar");
const resultado = document.getElementById("resultado");
const body = document.body;

botao.addEventListener("click", () => {
  const cidade = document.getElementById("cidade").value.trim();

  if (!cidade) {
    resultado.innerHTML = "⚠️ Digite uma cidade válida.";
    return;
  }

  buscarClima(cidade);
});

async function buscarClima(nomeCidade) {
  try {
    resultado.innerHTML = "⏳ Buscando...";

    // 1️⃣ GEOCODING
    const urlGeo = `https://geocoding-api.open-meteo.com/v1/search?name=${nomeCidade}&count=1&language=pt&format=json`;

    const respostaGeo = await fetch(urlGeo);

    if (!respostaGeo.ok) {
      throw new Error("Erro na API de geolocalização");
    }

    const dadosGeo = await respostaGeo.json();

    if (!dadosGeo.results) {
      resultado.innerHTML = "❌ Cidade não encontrada.";
      return;
    }

    const { latitude, longitude, name, country } = dadosGeo.results[0];

    // 2️⃣ CLIMA
    const urlClima = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

    const respostaClima = await fetch(urlClima);

    if (!respostaClima.ok) {
      throw new Error("Erro na API de clima");
    }

    const dadosClima = await respostaClima.json();

    const clima = dadosClima.current_weather;

    // 3️⃣ TRATAMENTO DOS DADOS
    const temperatura = clima.temperature;
    const codigo = clima.weathercode;
    const isDay = clima.is_day;
    const data = new Date(clima.time);

    // 🌤️ descrição + ícone
    const descricaoClima = traduzirClima(codigo);
    const icone = pegarIcone(codigo);

    // 📅 data formatada
    const dataFormatada = data.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    // 🌙 modo claro/escuro
    if (isDay === 0) {
      body.style.background = "#1e293b"; // escuro
    } else {
      body.style.background = "linear-gradient(to bottom, #4facfe, #00f2fe)";
    }

    // 4️⃣ EXIBIÇÃO
    resultado.innerHTML = `
      <h2>${name}, ${country}</h2>
      <p>📅 ${dataFormatada}</p>
      <i class="wi ${icone}" style="font-size:40px;"></i>
      <p>${descricaoClima}</p>
      <p>🌡️ <strong>${temperatura}°C</strong></p>
    `;

  } catch (erro) {
    console.error(erro);

    resultado.innerHTML = `
      ❌ Erro ao buscar dados.<br>
      Verifique sua conexão ou tente novamente.
    `;
  }
}

// 🌤️ Traduz código da API
function traduzirClima(codigo) {
  const mapa = {
    0: "Céu limpo",
    1: "Principalmente limpo",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Nevoeiro",
    48: "Nevoeiro com gelo",
    51: "Garoa leve",
    61: "Chuva leve",
    63: "Chuva moderada",
    65: "Chuva forte",
    71: "Neve leve",
    80: "Pancadas de chuva",
    95: "Tempestade"
  };

  return mapa[codigo] || "Clima desconhecido";
}

// 🌤️ Ícones (Weather Icons)
function pegarIcone(codigo) {
  const mapa = {
    0: "wi-day-sunny",
    1: "wi-day-sunny",
    2: "wi-day-cloudy",
    3: "wi-cloudy",
    45: "wi-fog",
    48: "wi-fog",
    51: "wi-sprinkle",
    61: "wi-rain",
    63: "wi-rain",
    65: "wi-rain-wind",
    71: "wi-snow",
    80: "wi-showers",
    95: "wi-thunderstorm"
  };

  return mapa[codigo] || "wi-na";
}