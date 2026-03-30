const botao = document.getElementById("buscar");
const resultado = document.getElementById("resultado");

botao.addEventListener("click", () => {
  const cidade = document.getElementById("cidade").value.trim();

  if (!cidade) {
    resultado.innerHTML = "Digite uma cidade válida.";
    return;
  }

  buscarClima(cidade);
});

async function buscarClima(nomeCidade) {
  try {
    // 1️⃣ Geocoding (pegar latitude e longitude)
    const urlGeo = `https://geocoding-api.open-meteo.com/v1/search?name=${nomeCidade}&count=1&language=pt&format=json`;

    const respostaGeo = await fetch(urlGeo);
    const dadosGeo = await respostaGeo.json();

    if (!dadosGeo.results) {
      resultado.innerHTML = "Cidade não encontrada.";
      return;
    }

    const { latitude, longitude, name, country } = dadosGeo.results[0];

    // 2️⃣ Clima atual
    const urlClima = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

    const respostaClima = await fetch(urlClima);
    const dadosClima = await respostaClima.json();

    const temperatura = dadosClima.current_weather.temperature;

    // 3️⃣ Exibir apenas temperatura (requisito)
    resultado.innerHTML = `
      <h2>${name}, ${country}</h2>
      <p>🌡️ Temperatura: <strong>${temperatura}°C</strong></p>
    `;

  } catch (erro) {
    console.error(erro);
    resultado.innerHTML = "Erro ao buscar dados.";
  }
}