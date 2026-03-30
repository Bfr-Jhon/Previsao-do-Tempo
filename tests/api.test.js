const { buscarCidade } = require("../assets/script/api");

global.fetch = jest.fn();

describe("Testes da função buscarCidade", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Cidade válida retorna temperatura", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true, // ✅ necessário
        json: async () => ({
          results: [{ latitude: -22.9, longitude: -43.2 }]
        })
      })
      .mockResolvedValueOnce({
        ok: true, // ✅ necessário
        json: async () => ({
          current_weather: { temperature: 30 }
        })
      });

    const resultado = await buscarCidade("Rio de Janeiro");

    expect(resultado).toEqual({ temperatura: 30 });
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  test("Cidade inexistente lança erro", async () => {
    fetch.mockResolvedValueOnce({
      ok: true, // ✅ necessário para não disparar "Erro na API"
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
      ok: false // simula falha da API
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