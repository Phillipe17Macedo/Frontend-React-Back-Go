import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [novoAluno, setNovoAluno] = useState({ nome: '', matricula: '', turma: '' });
  const [turmas, setTurmas] = useState([]);
  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editingAlunoId, setEditingAlunoId] = useState(null);

  useEffect(() => {
    axios.get('https://cadastro-escola-production.up.railway.app/alunos')
      .then(response => setAlunos(response.data))
      .catch(error => console.log(error));

    axios.get('https://cadastro-escola-production.up.railway.app/turmas')
      .then(response => setTurmas(response.data))
      .catch(error => console.log(error));
  }, []);

  const handleChange = (e) => {
    setNovoAluno({ ...novoAluno, [e.target.name]: e.target.value });
  };

  const handleTurmaChange = (e) => {
    setNovoAluno({ ...novoAluno, turma: parseInt(e.target.value, 10) });
  };

  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    if (!novoAluno.nome) {
      tempErrors["nome"] = "O nome é obrigatório.";
      isValid = false;
    }
    if (!novoAluno.matricula) {
      tempErrors["matricula"] = "A matrícula é obrigatória.";
      isValid = false;
    } else if (!/^\d+$/.test(novoAluno.matricula)) {
      tempErrors["matricula"] = "A matrícula deve conter apenas números.";
      isValid = false;
    }
    if (!novoAluno.turma) {
      tempErrors["turma"] = "A turma é obrigatória.";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      axios.post('https://cadastro-escola-production.up.railway.app/alunos', novoAluno)
        .then(response => {
          setAlunos([...alunos, response.data]);
          setNovoAluno({ nome: '', matricula: '', turma: '' });
          setErrors({});
          alert("Aluno cadastrado com sucesso!");
        })
        .catch(error => console.log(error));
    }
  };

  const handleSave = () => {
    if (validate()) {
      axios.put(`https://cadastro-escola-production.up.railway.app/alunos/${editingAlunoId}`, novoAluno)
        .then((response) => {
          setAlunos(alunos.map((aluno) =>
            aluno.ID === editingAlunoId ? response.data : aluno
          ));
          setNovoAluno({ nome: '', matricula: '', turma: '' });
          setEditingAlunoId(null);
          setEditMode(false);
          setErrors({});
          alert("Dados do aluno atualizados com sucesso!");
        })
        .catch(error => console.log(error));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Você tem certeza que deseja remover este aluno?")) {
      axios.delete(`https://cadastro-escola-production.up.railway.app/alunos/${id}`)
        .then(() => {
          setAlunos(alunos.filter(aluno => aluno.ID !== id));
          alert("Aluno removido com sucesso!");
        })
        .catch(error => console.log(error));
    }
  };

  const handleEdit = (id) => {
    const aluno = alunos.find(a => a.ID === id);
    setNovoAluno({
      nome: aluno.Nome,
      matricula: aluno.Matricula,
      turma: aluno.Turmas.length > 0 ? aluno.Turmas[0].ID : ''
    });
    setEditingAlunoId(id);
    setEditMode(true);
  };

  return (
    <div className="container">
      <div className="jumbotron bg-primary text-white p-5 rounded-lg shadow-sm mb-4">
        <h2 className="display-4">Gerenciamento de Alunos</h2>
        <p className="lead">Cadastre novos alunos e visualize a lista completa dos alunos cadastrados.</p>
      </div>

      <form className="mb-4 p-4 bg-light rounded-lg shadow" noValidate>
        <h3 className="mb-3">{editMode ? "Editar Aluno" : "Cadastrar Novo Aluno"}</h3>
        <div className="mb-3">
          <label htmlFor="nome" className="form-label">Nome do Aluno</label>
          <input
            type="text"
            className={`form-control ${errors.nome ? "is-invalid" : ""}`}
            name="nome"
            id="nome"
            placeholder="Nome do Aluno"
            value={novoAluno.nome}
            onChange={handleChange}
            required
          />
          {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="matricula" className="form-label">Matrícula</label>
          <input
            type="text"
            className={`form-control ${errors.matricula ? "is-invalid" : ""}`}
            name="matricula"
            id="matricula"
            placeholder="Matrícula"
            value={novoAluno.matricula}
            onChange={handleChange}
            required
            pattern="\d*"
          />
          {errors.matricula && <div className="invalid-feedback">{errors.matricula}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="turma" className="form-label">Turma</label>
          <select
            className={`form-control ${errors.turma ? "is-invalid" : ""}`}
            name="turma"
            id="turma"
            value={novoAluno.turma}
            onChange={handleTurmaChange}
            required
          >
            <option value="">Selecione uma Turma</option>
            {turmas.map(turma => (
              <option key={turma.ID} value={turma.ID}>
                {turma.Nome} - {turma.Semestre}/{turma.Ano}
              </option>
            ))}
          </select>
          {errors.turma && <div className="invalid-feedback">{errors.turma}</div>}
        </div>
        <button
          type="button"
          className={`btn ${editMode ? "btn-warning" : "btn-success"} w-100`}
          onClick={editMode ? handleSave : handleSubmit}
        >
          {editMode ? "Salvar" : "Cadastrar"}
        </button>
      </form>

      <h3 className="mb-4">Lista de Alunos</h3>
      <div className="row">
        {alunos.map(aluno => (
          <div key={aluno.ID} className="col-md-4">
            <div className="card mb-4 border-0 shadow">
              <div className="card-body">
                <h5 className="card-title text-primary">{aluno.Nome}</h5>
                <p className="card-text"><strong>Matrícula:</strong> {aluno.Matricula}</p>
                <p className="card-text"><strong>Turma:</strong> {aluno.Turmas.length > 0 ? `${aluno.Turmas[0].Nome} - ${aluno.Turmas[0].Semestre}/${aluno.Turmas[0].Ano}` : "Nenhuma turma atribuída"}</p>
              </div>
              <button onClick={() => handleEdit(aluno.ID)} className="btn btn-warning mt-2">Editar</button>
              <button onClick={() => handleDelete(aluno.ID)} className="btn btn-danger mt-2">Remover</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Alunos;