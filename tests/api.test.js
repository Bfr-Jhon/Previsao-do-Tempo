const { buscarCidade } = require("../assets/script/api");

global.fetch = jest.fn();

describe("Testes da função buscarCidade", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Cidade válida retorna dados completos", async () => {
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
          current: {
            temperature_2m: 30,
            relative_humidity_2m: 70,
            windspeed_10m: 10,
            precipitation: 5
          }
        })
      });

    const resultado = await buscarCidade("Rio de Janeiro");

    expect(resultado).toEqual({
      temperatura: 30,
      umidade: 70,
      vento: 10,
      precipitacao: 5
    });
  });

  test("Cidade inexistente lança erro", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] })
    });

    await expect(buscarCidade("CidadeFake"))
      .rejects.toThrow("Cidade não encontrada");
  });

  test("Entrada vazia lança erro", async () => {
    await expect(buscarCidade(""))
      .rejects.toThrow("Cidade não informada");
  });

  test("Erro na API lança erro específico", async () => {
    fetch.mockResolvedValueOnce({
      ok: false
    });

    await expect(buscarCidade("Rio"))
      .rejects.toThrow("Erro na API");
  });

  test("Erro de rede lança erro genérico", async () => {
    fetch.mockRejectedValueOnce(new Error("Erro de rede"));

    await expect(buscarCidade("Rio"))
      .rejects.toThrow("Erro ao buscar dados da API");
  });

});