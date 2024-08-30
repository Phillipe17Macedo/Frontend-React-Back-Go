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
  const [editMode, setEditMode] = useState(false);
  const [editingAtividadeId, setEditingAtividadeId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios
      .get("https://cadastro-escola-production.up.railway.app/atividades")
      .then((response) => setAtividades(response.data))
      .catch((error) => console.log(error));

    axios
      .get("https://cadastro-escola-production.up.railway.app/turmas")
      .then((response) => setTurmas(response.data))
      .catch((error) => console.log(error));
  }, []);

  const handleChange = (e) => {
    setNovaAtividade({ ...novaAtividade, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!novaAtividade.nome) {
      errors.nome = "O nome da atividade é obrigatório.";
      isValid = false;
    }

    if (!novaAtividade.valor) {
      errors.valor = "O valor da atividade é obrigatório.";
      isValid = false;
    } else if (isNaN(parseFloat(novaAtividade.valor))) {
      errors.valor = "O valor da atividade deve ser um número.";
      isValid = false;
    }

    if (!novaAtividade.data) {
      errors.data = "A data da atividade é obrigatória.";
      isValid = false;
    }

    if (!novaAtividade.turmaID) {
      errors.turmaID = "A turma é obrigatória.";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const atividadeData = {
      nome: novaAtividade.nome,
      valor: parseFloat(novaAtividade.valor),
      data: novaAtividade.data,
      turmaID: parseInt(novaAtividade.turmaID, 10),
    };

    if (editMode) {
      axios
        .put(`https://cadastro-escola-production.up.railway.app/atividades/${editingAtividadeId}`, atividadeData)
        .then((response) => {
          setAtividades(
            atividades.map((atividade) =>
              atividade.ID === editingAtividadeId ? response.data : atividade
            )
          );
          setNovaAtividade({ nome: "", valor: "", data: "", turmaID: "" });
          setEditMode(false);
          setEditingAtividadeId(null);
          setErrors({});
        })
        .catch((error) => console.log(error));
    } else {
      axios
        .post("https://cadastro-escola-production.up.railway.app/atividades", atividadeData)
        .then((response) => {
          setAtividades([...atividades, response.data]);
          setNovaAtividade({ nome: "", valor: "", data: "", turmaID: "" });
          setErrors({});
        })
        .catch((error) => console.log(error));
    }
  };

  const handleEdit = (id) => {
    const atividade = atividades.find((a) => a.ID === id);

    // Formatar a data no formato YYYY-MM-DD para o campo de data
    const formattedDate = new Date(atividade.Data).toISOString().split("T")[0];

    setNovaAtividade({
      nome: atividade.Nome,
      valor: atividade.Valor.toString(),
      data: formattedDate,
      turmaID: atividade.TurmaID.toString(),
    });
    setEditingAtividadeId(id);
    setEditMode(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Você tem certeza que deseja remover esta atividade?")) {
      axios
        .delete(`https://cadastro-escola-production.up.railway.app/atividades/${id}`)
        .then(() => {
          setAtividades(atividades.filter((atividade) => atividade.ID !== id));
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div className="container">
      <div className="jumbotron bg-primary text-white p-5 rounded-lg shadow-sm mb-4">
        <h2 className="display-4">Gerenciamento de Atividades</h2>
        <p className="lead">
          Cadastre novas atividades e visualize a lista completa das atividades
          cadastradas.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mb-4 p-4 bg-light rounded-lg shadow"
        noValidate
      >
        <h3 className="mb-3">
          {editMode ? "Editar Atividade" : "Cadastrar Nova Atividade"}
        </h3>
        <div className="mb-3">
          <label htmlFor="nome" className="form-label">
            Nome da Atividade
          </label>
          <input
            type="text"
            className={`form-control ${errors.nome ? "is-invalid" : ""}`}
            name="nome"
            id="nome"
            placeholder="Nome da Atividade"
            value={novaAtividade.nome}
            onChange={handleChange}
            required
          />
          {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="valor" className="form-label">
            Valor
          </label>
          <input
            type="number"
            step="0.01"
            className={`form-control ${errors.valor ? "is-invalid" : ""}`}
            name="valor"
            id="valor"
            placeholder="Valor da Atividade"
            value={novaAtividade.valor}
            onChange={handleChange}
            required
          />
          {errors.valor && (
            <div className="invalid-feedback">{errors.valor}</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="data" className="form-label">
            Data
          </label>
          <input
            type="date"
            className={`form-control ${errors.data ? "is-invalid" : ""}`}
            name="data"
            id="data"
            value={novaAtividade.data}
            onChange={handleChange}
            required
          />
          {errors.data && <div className="invalid-feedback">{errors.data}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="turmaID" className="form-label">
            Turma
          </label>
          <select
            className={`form-control ${errors.turmaID ? "is-invalid" : ""}`}
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
          {errors.turmaID && (
            <div className="invalid-feedback">{errors.turmaID}</div>
          )}
        </div>
        <button
          type="submit"
          className={`btn ${editMode ? "btn-warning" : "btn-success"} w-100`}
        >
          {editMode ? "Salvar" : "Cadastrar"}
        </button>
      </form>

      <h3 className="mb-3">Lista de Atividades</h3>
      <div className="row">
        {atividades.map((atividade) => (
          <div key={atividade.ID} className="col-md-4">
            <div className="card mb-4 border-0 shadow">
              <div className="card-body">
                <h5 className="card-title text-primary">{atividade.Nome}</h5>
                <p className="card-text">
                  <strong>Valor:</strong> {atividade.Valor} pontos
                </p>
                <p className="card-text">
                  <strong>Data:</strong>{" "}
                  {new Date(atividade.Data).toLocaleDateString()}
                </p>
                <p className="card-text">
                  <strong>Turma:</strong>{" "}
                  {atividade.Turma
                    ? `${atividade.Turma.Nome} - ${atividade.Turma.Semestre}/${atividade.Turma.Ano}`
                    : "Sem Turma"}
                </p>
              </div>
              <button
                onClick={() => handleEdit(atividade.ID)}
                className="btn btn-warning mt-2"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(atividade.ID)}
                className="btn btn-danger mt-2"
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Atividades;