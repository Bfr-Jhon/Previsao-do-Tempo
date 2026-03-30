const { buscarCidade } = require("../assets/script/api");

global.fetch = jest.fn();

describe("Testes API Clima", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ✅ 1. Cidade válida
  test("Cidade válida retorna dados meteorológicos", async () => {

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [{ latitude: -22.9, longitude: -43.2 }]
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          current_weather: { temperature: 30 }
        })
      });

    const resultado = await buscarCidade("Rio");

    expect(resultado).toEqual({ temperatura: 30 });
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  // ❌ 2. Cidade inexistente
  test("Cidade inexistente lança exceção", async () => {

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] })
    });

    await expect(buscarCidade("CidadeFake"))
      .rejects.toThrow("Cidade não encontrada");
  });

  // ❌ 3. Entrada vazia
  test("Entrada vazia retorna erro", async () => {

    await expect(buscarCidade(""))
      .rejects.toThrow("Cidade não informada");
  });

  // ❌ 4. Falha da API
  test("Erro na API gera exceção", async () => {

    fetch.mockResolvedValueOnce({
      ok: false
    });

    await expect(buscarCidade("Rio"))
      .rejects.toThrow("Erro na API de geolocalização");
  });

  // ⚠️ 5. Limite excedido / erro genérico
  test("Erro inesperado da API", async () => {

    fetch.mockRejectedValueOnce(new Error("Timeout"));

    await expect(buscarCidade("Rio"))
      .rejects.toThrow("Timeout");
  });

  // ⚠️ 6. JSON inesperado
  test("Resposta inesperada da API", async () => {

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [{ latitude: 1, longitude: 1 }]
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({})
      });

    await expect(buscarCidade("Rio"))
      .rejects.toThrow("Formato inesperado da resposta");
  });

});