import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [novoAluno, setNovoAluno] = useState({ nome: '', matricula: '', turmas: [] });
  const [turmas, setTurmas] = useState([]);

  useEffect(() => {
    axios.get('http://64.181.160.179:8080/alunos')
      .then(response => setAlunos(response.data))
      .catch(error => console.log(error));

    axios.get('http://64.181.160.179:8080/turmas')
      .then(response => setTurmas(response.data))
      .catch(error => console.log(error));
  }, []);

  const handleChange = (e) => {
    setNovoAluno({ ...novoAluno, [e.target.name]: e.target.value });
  };

  const handleTurmasChange = (e) => {
    const selectedTurmas = Array.from(e.target.selectedOptions, option => parseInt(option.value, 10));
    setNovoAluno({ ...novoAluno, turmas: selectedTurmas });
  };  

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://64.181.160.179:8080/alunos', novoAluno)
      .then(response => {
        setAlunos([...alunos, response.data]);
        setNovoAluno({ nome: '', matricula: '', turmas: [] });
      })
      .catch(error => console.log(error));
  };

  return (
    <div className="container">
      <div className="jumbotron bg-primary text-white p-5 rounded-lg shadow-sm mb-4">
        <h2 className="display-4">Gerenciamento de Alunos</h2>
        <p className="lead">Cadastre novos alunos e visualize a lista completa dos alunos cadastrados.</p>
      </div>

      <form onSubmit={handleSubmit} className="mb-4 p-4 bg-light rounded-lg shadow" noValidate>
        <h3 className="mb-3">Cadastrar Novo Aluno</h3>
        <div className="mb-3">
          <label htmlFor="nome" className="form-label">Nome do Aluno</label>
          <input
            type="text"
            className="form-control"
            name="nome"
            id="nome"
            placeholder="Nome do Aluno"
            value={novoAluno.nome}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="matricula" className="form-label">Matrícula</label>
          <input
            type="text"
            className="form-control"
            name="matricula"
            id="matricula"
            placeholder="Matrícula"
            value={novoAluno.matricula}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="turmas" className="form-label">Turmas</label>
          <select
            multiple
            className="form-control"
            name="turmas"
            id="turmas"
            value={novoAluno.turmas}
            onChange={handleTurmasChange}
            required
          >
            {turmas.map(turma => (
              <option key={turma.ID} value={turma.ID}>
                {turma.Nome} - {turma.Semestre}/{turma.Ano}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-success w-100">Cadastrar</button>
      </form>

      <h3 className="mb-4">Lista de Alunos</h3>
      <div className="row">
        {alunos.map(aluno => (
          <div key={aluno.ID} className="col-md-4">
            <div className="card mb-4 border-0 shadow">
              <div className="card-body">
                <h5 className="card-title text-primary">{aluno.Nome}</h5>
                <p className="card-text"><strong>Matrícula:</strong> {aluno.Matricula}</p>
                <p className="card-text"><strong>Turmas:</strong> {aluno.Turmas.map(t => `${t.Nome} `).join(', ')}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Alunos;