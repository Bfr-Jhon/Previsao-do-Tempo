const { buscarCidade } = require("../assets/script/api");

global.fetch = jest.fn();

describe("Testes da API de clima", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Cidade válida retorna temperatura", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [{ latitude: -22.9, longitude: -43.2, name: "Rio de Janeiro" }]
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          current_weather: { temperature: 30 }
        })
      });

    const resultado = await buscarCidade("Rio de Janeiro");

    expect(resultado).toEqual({
      cidade: "Rio de Janeiro",
      temperatura: 30
    });
  });

  test("Cidade inválida lança erro", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] })
    });

    await expect(buscarCidade("CidadeFake"))
      .rejects
      .toThrow("Cidade não encontrada");
  });

  test("Entrada vazia", async () => {
    await expect(buscarCidade(""))
      .rejects
      .toThrow("Cidade não informada");
  });

  test("Erro na API", async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    await expect(buscarCidade("Rio"))
      .rejects
      .toThrow("Erro na API de geolocalização");
  });

});