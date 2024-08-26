import React, { useState, useEffect } from "react";
import axios from "axios";

function Atividades() {
  const [atividades, setAtividades] = useState([]);
  const [novaAtividade, setNovaAtividade] = useState({
    nome: "",
    valor: "",
    data: "",
    turmaID: "",
  });
  const [turmas, setTurmas] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/atividades")
      .then((response) => setAtividades(response.data))
      .catch((error) => console.log(error));

    axios
      .get("http://localhost:8080/turmas")
      .then((response) => setTurmas(response.data))
      .catch((error) => console.log(error));
  }, []);

  const handleChange = (e) => {
    setNovaAtividade({ ...novaAtividade, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const atividadeData = {
      nome: novaAtividade.nome,
      valor: parseFloat(novaAtividade.valor),
      data: novaAtividade.data,
      turmaID: parseInt(novaAtividade.turmaID, 10),
    };

    axios
      .post("http://localhost:8080/atividades", atividadeData)
      .then((response) => {
        setAtividades([...atividades, response.data]);
        setNovaAtividade({ nome: "", valor: "", data: "", turmaID: "" });
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="container">
      <div className="jumbotron bg-primary text-white p-5 rounded-lg shadow-sm mb-4">
        <h2 className="display-4">Gerenciamento de Atividades</h2>
        <p className="lead">Cadastre novas atividades e visualize a lista completa das atividades cadastradas.</p>
      </div>

      <form onSubmit={handleSubmit} className="mb-4 p-4 bg-light rounded-lg shadow" noValidate>
        <h3 className="mb-3">Cadastrar Nova Atividade</h3>
        <div className="mb-3">
          <label htmlFor="nome" className="form-label">
            Nome da Atividade
          </label>
          <input
            type="text"
            className="form-control"
            name="nome"
            id="nome"
            placeholder="Nome da Atividade"
            value={novaAtividade.nome}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="valor" className="form-label">
            Valor
          </label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            name="valor"
            id="valor"
            placeholder="Valor da Atividade"
            value={novaAtividade.valor}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="data" className="form-label">
            Data
          </label>
          <input
            type="date"
            className="form-control"
            name="data"
            id="data"
            value={novaAtividade.data}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="turmaID" className="form-label">
            Turma
          </label>
          <select
            className="form-control"
            name="turmaID"
            id="turmaID"
            value={novaAtividade.turmaID}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Selecione uma Turma
            </option>
            {turmas.map((turma) => (
              <option key={turma.ID} value={turma.ID}>
                {turma.Nome} - {turma.Semestre}/{turma.Ano}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-success w-100">
          Cadastrar
        </button>
      </form>

      <h3 className="mb-3">Lista de Atividades</h3>
      <div className="row">
        {atividades.map((atividade) => (
          <div key={atividade.ID} className="col-md-4">
            <div className="card mb-4 border-0 shadow">
              <div className="card-body">
                <h5 className="card-title text-primary">{atividade.Nome}</h5>
                <p className="card-text"><strong>Valor:</strong> {atividade.Valor} pontos</p>
                <p className="card-text"><strong>Data:</strong> {atividade.Data}</p>
                <p className="card-text">
                  <strong>Turma:</strong> {atividade.Turma ? `${atividade.Turma.Nome} - ${atividade.Turma.Semestre}/${atividade.Turma.Ano}` : "Sem Turma"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Atividades;