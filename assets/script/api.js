async function buscarCidade(nomeCidade) {

  if (!nomeCidade || nomeCidade.trim() === "") {
    throw new Error("Cidade não informada");
  }

  const urlGeo = `https://geocoding-api.open-meteo.com/v1/search?name=${nomeCidade}&count=1&language=pt&format=json`;

  const geoResponse = await fetch(urlGeo);

  if (!geoResponse.ok) {
    throw new Error("Erro na API de geolocalização");
  }

  const geoData = await geoResponse.json();

  if (!geoData.results || geoData.results.length === 0) {
    throw new Error("Cidade não encontrada");
  }

  const { latitude, longitude } = geoData.results[0];

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
    temperatura: climaData.current_weather.temperature
  };
}

module.exports = { buscarCidade };