import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Turmas() {
  const [turmas, setTurmas] = useState([]);
  const [novaTurma, setNovaTurma] = useState({ nome: '', semestre: '', ano: '', professorID: '' });

  useEffect(() => {
    axios.get('http://64.181.160.179:8080/turmas')
      .then(response => setTurmas(response.data))
      .catch(error => console.log(error));
  }, []);

  const handleChange = (e) => {
    setNovaTurma({ ...novaTurma, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const turmaData = {
      nome: novaTurma.nome,
      semestre: novaTurma.semestre,
      ano: parseInt(novaTurma.ano, 10),
      professorID: parseInt(novaTurma.professorID, 10)
    };

    axios.post('http://64.181.160.179:8080/turmas', turmaData)
      .then(response => {
        setTurmas([...turmas, response.data]);
        setNovaTurma({ nome: '', semestre: '', ano: '', professorID: '' });
      })
      .catch(error => console.log(error));
  };

  return (
    <div className="container">
      <div className="jumbotron bg-primary text-white p-5 rounded-lg shadow-sm mb-4">
        <h2 className="display-4">Gerenciamento de Turmas</h2>
        <p className="lead">Cadastre novas turmas e visualize a lista completa das turmas disponíveis.</p>
      </div>

      <form onSubmit={handleSubmit} className="mb-4 p-4 bg-light rounded-lg shadow">
        <h3 className="mb-3">Cadastrar Nova Turma</h3>
        <div className="mb-3">
          <label htmlFor="nome" className="form-label">Nome da Turma</label>
          <input
            type="text"
            className="form-control"
            name="nome"
            id="nome"
            placeholder="Nome da Turma"
            value={novaTurma.nome}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="semestre" className="form-label">Semestre</label>
          <input
            type="text"
            className="form-control"
            name="semestre"
            id="semestre"
            placeholder="Semestre"
            value={novaTurma.semestre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="ano" className="form-label">Ano</label>
          <input
            type="number"
            className="form-control"
            name="ano"
            id="ano"
            placeholder="Ano"
            value={novaTurma.ano}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="professorID" className="form-label">ID do Professor</label>
          <input
            type="number"
            className="form-control"
            name="professorID"
            id="professorID"
            placeholder="ID do Professor"
            value={novaTurma.professorID}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-success w-100">Cadastrar</button>
      </form>

      <h3 className="mb-4">Lista de Turmas</h3>
      <div className="row">
        {turmas.map(turma => (
          <div key={turma.ID} className="col-md-4">
            <div className="card mb-4 border-0 shadow">
              <div className="card-body">
                <h5 className="card-title text-primary">{turma.Nome}</h5>
                <p className="card-text"><strong>Semestre:</strong> {turma.Semestre}</p>
                <p className="card-text"><strong>Ano:</strong> {turma.Ano}</p>
                <p className="card-text"><strong>Professor ID:</strong> {turma.ProfessorID}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Turmas;