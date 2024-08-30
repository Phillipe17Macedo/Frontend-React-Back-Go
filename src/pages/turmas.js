import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Turmas() {
  const [turmas, setTurmas] = useState([]);
  const [professores, setProfessores] = useState([]); // Estado para armazenar os professores
  const [novaTurma, setNovaTurma] = useState({ nome: '', semestre: '', ano: '', professorID: '' });
  const [editMode, setEditMode] = useState(false);
  const [editingTurmaId, setEditingTurmaId] = useState(null);
  const [errors, setErrors] = useState({}); // Estado para armazenar erros de validação

  useEffect(() => {
    axios.get('http://localhost:8080/turmas')
      .then(response => setTurmas(response.data))
      .catch(error => console.log(error));

    axios.get('http://localhost:8080/professores') // Busca os professores
      .then(response => setProfessores(response.data))
      .catch(error => console.log(error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'semestre' && !/^\d*$/.test(value)) {
      return; // Impede entrada de não números no campo semestre
    }

    setNovaTurma({ ...novaTurma, [name]: value });
  };

  const validateForm = () => {
    let formErrors = {};

    if (!novaTurma.nome) formErrors.nome = "O nome da turma é obrigatório";
    if (!novaTurma.semestre) formErrors.semestre = "O semestre é obrigatório";
    if (!novaTurma.ano) formErrors.ano = "O ano é obrigatório";
    if (!novaTurma.professorID) formErrors.professorID = "O professor é obrigatório";

    setErrors(formErrors);

    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Impede o envio se o formulário for inválido

    const turmaData = {
      nome: novaTurma.nome,
      semestre: novaTurma.semestre,
      ano: parseInt(novaTurma.ano, 10),
      professorID: parseInt(novaTurma.professorID, 10)
    };

    axios.post('http://localhost:8080/turmas', turmaData)
      .then(response => {
        setTurmas([...turmas, response.data]);
        setNovaTurma({ nome: '', semestre: '', ano: '', professorID: '' });
      })
      .catch(error => console.log(error));
  };

  const handleSave = () => {
    if (!validateForm()) return; // Impede o envio se o formulário for inválido

    const turmaData = {
      nome: novaTurma.nome,
      semestre: novaTurma.semestre,
      ano: parseInt(novaTurma.ano, 10),
      professorID: parseInt(novaTurma.professorID, 10)
    };

    axios.put(`http://localhost:8080/turmas/${editingTurmaId}`, turmaData)
      .then(response => {
        setTurmas(
          turmas.map(turma =>
            turma.ID === editingTurmaId ? response.data : turma
          )
        );
        setNovaTurma({ nome: '', semestre: '', ano: '', professorID: '' });
        setEditingTurmaId(null);
        setEditMode(false);
      })
      .catch(error => console.log(error));
  };

  const handleEdit = (id) => {
    const turma = turmas.find(t => t.ID === id);
    setNovaTurma({
      nome: turma.Nome,
      semestre: turma.Semestre,
      ano: turma.Ano.toString(),
      professorID: turma.ProfessorID.toString()
    });
    setEditingTurmaId(id);
    setEditMode(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Você tem certeza que deseja remover esta turma?")) {
      axios.delete(`http://localhost:8080/turmas/${id}`)
        .then(() => {
          setTurmas(turmas.filter(turma => turma.ID !== id));
        })
        .catch(error => console.log(error));
    }
  };

  return (
    <div className="container">
      <div className="jumbotron bg-primary text-white p-5 rounded-lg shadow-sm mb-4">
        <h2 className="display-4">Gerenciamento de Turmas</h2>
        <p className="lead">
          Cadastre novas turmas e visualize a lista completa das turmas
          disponíveis.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mb-4 p-4 bg-light rounded-lg shadow"
      >
        <h3 className="mb-3">
          {editMode ? "Editar Turma" : "Cadastrar Nova Turma"}
        </h3>

        <div className="mb-3">
          <label htmlFor="nome" className="form-label">
            Nome da Turma
          </label>
          <input
            type="text"
            className={`form-control ${errors.nome ? "is-invalid" : ""}`}
            name="nome"
            id="nome"
            placeholder="Nome da Turma"
            value={novaTurma.nome}
            onChange={handleChange}
            required
          />
          {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="semestre" className="form-label">
            Semestre
          </label>
          <input
            type="text"
            className={`form-control ${errors.semestre ? "is-invalid" : ""}`}
            name="semestre"
            id="semestre"
            placeholder="Semestre"
            value={novaTurma.semestre}
            onChange={handleChange}
            required
          />
          {errors.semestre && (
            <div className="invalid-feedback">{errors.semestre}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="ano" className="form-label">
            Ano
          </label>
          <input
            type="number"
            className={`form-control ${errors.ano ? "is-invalid" : ""}`}
            name="ano"
            id="ano"
            placeholder="Ano"
            value={novaTurma.ano}
            onChange={handleChange}
            required
          />
          {errors.ano && <div className="invalid-feedback">{errors.ano}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="professorID" className="form-label">
            Professor
          </label>
          <select
            className={`form-control ${errors.professorID ? "is-invalid" : ""}`}
            name="professorID"
            id="professorID"
            value={novaTurma.professorID}
            onChange={handleChange}
            required
          >
            <option value="">Selecione um Professor</option>
            {professores.map((professor) => (
              <option key={professor.ID} value={professor.ID}>
                {professor.Nome}
              </option>
            ))}
          </select>
          {errors.professorID && (
            <div className="invalid-feedback">{errors.professorID}</div>
          )}
        </div>

        <button
          type="button"
          className={`btn ${editMode ? "btn-warning" : "btn-success"} w-100`}
          onClick={editMode ? handleSave : handleSubmit}
        >
          {editMode ? "Salvar" : "Cadastrar"}
        </button>
      </form>

      <h3 className="mb-4">Lista de Turmas</h3>
      <div className="row">
        {turmas.map((turma) => (
          <div key={turma.ID} className="col-md-4">
            <div className="card mb-4 border-0 shadow">
              <div className="card-body">
                <h5 className="card-title text-primary">{turma.Nome}</h5>
                <p className="card-text">
                  <strong>Semestre:</strong> {turma.Semestre}
                </p>
                <p className="card-text">
                  <strong>Ano:</strong> {turma.Ano}
                </p>
                <p className="card-text">
                  <strong>Professor:</strong>{" "}
                  {professores.find((prof) => prof.ID === turma.ProfessorID)
                    ?.Nome || turma.ProfessorID}
                </p>
              </div>
              <button
                onClick={() => handleEdit(turma.ID)}
                className="btn btn-warning mt-2"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(turma.ID)}
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

export default Turmas;