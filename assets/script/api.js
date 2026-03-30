/**
 * @fileoverview Funções responsáveis por buscar dados de clima na API Open-Meteo
 * e integrar com o DOM da aplicação.
 */

/**
 * Busca dados de clima de uma cidade usando a API Open-Meteo.
 *
 * @async
 * @param {string} nomeCidade - Nome da cidade a ser buscada.
 * @returns {Promise<{temperatura: number}>} Objeto contendo a temperatura atual.
 *
 * @throws {Error} Se o nome da cidade estiver vazio.
 * @throws {Error} Se a cidade não for encontrada.
 * @throws {Error} Se houver falha na requisição da API.
 *
 * @example
 * buscarCidade("Rio de Janeiro")
 *   .then(dados => console.log(dados.temperatura))
 *   .catch(erro => console.error(erro.message));
 */
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

    const urlClima = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const respostaClima = await fetch(urlClima);

    if (!respostaClima.ok) {
      throw new Error("Erro na API");
    }

    const dadosClima = await respostaClima.json();

    return {
      temperatura: dadosClima.current_weather.temperature
    };

  } catch (erro) {
    // preserva erros esperados
    if (["Cidade não encontrada", "Cidade não informada", "Erro na API"].includes(erro.message)) {
      throw erro;
    }
    // outros erros caem aqui (ex: rede)
    throw new Error("Erro ao buscar dados da API");
  }
}

/* =======================
   INTEGRAÇÃO COM O DOM
   ======================= */

if (typeof document !== "undefined") {
  const botao = document.getElementById("buscar");

  if (botao) {
    botao.addEventListener("click", async () => {
      const cidade = document.getElementById("cidade").value;
      const resultado = document.getElementById("resultado");

      try {
        const dados = await buscarCidade(cidade);
        resultado.innerText = `Temperatura: ${dados.temperatura}°C`;
      } catch (erro) {
        resultado.innerText = erro.message;
      }
    });
  }
}

module.exports = { buscarCidade };