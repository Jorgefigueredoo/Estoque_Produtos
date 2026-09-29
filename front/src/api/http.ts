/** Erro vindo da própria API (status HTTP fora do 2xx). */
export class ApiError extends Error {}

/** Erro de rede: a API não respondeu (servidor fora do ar, CORS, etc). */
export class RedeError extends Error {
  constructor() {
    super("Não foi possível falar com a API. O servidor está no ar?");
  }
}

// O GlobalExceptionHandler devolve os erros como texto puro
// (ResponseEntity<String>), então aqui se lê com .text() e NÃO com .json().
// Exceções sem handler (ex.: IllegalArgumentException do FornecedorService)
// caem no JSON padrão do Spring, por isso o texto é tentado como JSON também.
async function lerErro(resposta: Response): Promise<ApiError> {
  const texto = await resposta.text().catch(() => "");

  try {
    const json = JSON.parse(texto) as { message?: string };
    if (json.message) return new ApiError(json.message);
  } catch {
    // não era JSON: segue com o texto puro
  }

  return new ApiError(texto || `Erro ${resposta.status}`);
}

export async function requisitar<T>(
  url: string,
  init?: RequestInit,
): Promise<T> {
  let resposta: Response;

  try {
    resposta = await fetch(url, init);
  } catch (erro) {
    console.error("Falha de rede:", erro);
    throw new RedeError();
  }

  if (!resposta.ok) {
    throw await lerErro(resposta);
  }

  // DELETE responde 200 sem corpo, então não dá pra chamar .json() direto.
  const corpo = await resposta.text();
  return (corpo ? JSON.parse(corpo) : undefined) as T;
}

export function comJson(metodo: string, corpo: unknown): RequestInit {
  return {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(corpo),
  };
}
