interface Props {
  total: number;
}

export function Topo({ total }: Props) {
  return (
    <header className="topo">
      <div className="topo__conteudo">
        <div className="topo__titulo">
          <span className="topo__eyebrow">controle de estoque</span>
          <h1>Estoque</h1>
        </div>
        <div className="carimbo" aria-hidden="true">
          <span>
            ITENS EM
            <br />
            ESTOQUE
          </span>
          <strong>{total}</strong>
        </div>
      </div>
    </header>
  );
}
