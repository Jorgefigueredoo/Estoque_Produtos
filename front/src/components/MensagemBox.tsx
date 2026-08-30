import type { Mensagem } from "../hooks/useMensagem";

interface Props {
  mensagem: Mensagem | null;
}

export function MensagemBox({ mensagem }: Props) {
  if (!mensagem) return null;

  return (
    <div className={`mensagem mensagem--${mensagem.tipo}`} role="status">
      {mensagem.texto}
    </div>
  );
}
