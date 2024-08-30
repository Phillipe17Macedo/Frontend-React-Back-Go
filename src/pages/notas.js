import React, { useState, useEffect } from "react";
import axios from "axios";

function Notas() {
  const [notas, setNotas] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [notaInput, setNotaInput] = useState({
    valor: "",
    alunoID: "",
    atividadeID: "",
  });
  const [selectedTurma, setSelectedTurma] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editingNotaId, setEditingNotaId] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/notas")
      .then((response) => setNotas(response.data))
      .catch((error) => console.log("Erro ao buscar notas:", error));

    axios
      .get("http://localhost:8080/turmas")
      .then((response) => setTurmas(response.data))
      .catch((error) => console.log(error));
  }, []);

  const handleTurmaChange = (e) => {
    const turmaID = e.target.value;
    setSelectedTurma(turmaID);

    axios
      .get(`http://localhost:8080/atividades?turma_id=${turmaID}`)
      .then((response) => setAtividades(response.data))
      .catch((error) => console.log(error));

    axios
      .get(`http://localhost:8080/alunos?turma_id=${turmaID}`)
      .then((response) => setAlunos(response.data))
      .catch((error) => console.log(error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'valor') {
      setNotaInput({ ...notaInput, [name]: parseFloat(value) });
    } else if (name === 'alunoID' || name === 'atividadeID') {
      setNotaInput({ ...notaInput, [name]: parseInt(value, 10) });
    } else {
      setNotaInput({ ...notaInput, [name]: value });
    }
  };

  const validateForm = () => {
    let errors = [];
    
    if (!selectedTurma) {
      errors.push("A turma é obrigatória.");
    }
    if (!notaInput.atividadeID) {
      errors.push("A atividade é obrigatória.");
    }
    if (!notaInput.alunoID) {
      errors.push("O aluno é obrigatório.");
    }
    if (!notaInput.valor) {
      errors.push("A nota é obrigatória.");
    } else if (isNaN(notaInput.valor)) {
      errors.push("A nota deve ser um número.");
    }

    if (errors.length > 0) {
      setErrorMessage(errors.join(" "));
      return false;
    }
    
    setErrorMessage("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (editMode) {
      axios
        .put(`http://localhost:8080/notas/${editingNotaId}`, { valor: notaInput.valor })
        .then((response) => {
          setNotas(
            notas.map((nota) => (nota.ID === editingNotaId ? response.data : nota))
          );
          setNotaInput({ valor: "", alunoID: "", atividadeID: "" });
          setEditMode(false);
          setEditingNotaId(null);
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            setErrorMessage(error.response.data.error);
          } else {
            setErrorMessage("Ocorreu um erro ao editar a nota.");
          }
        });
    } else {
      axios
        .post("http://localhost:8080/notas", notaInput)
        .then((response) => {
          setNotas([...notas, response.data]);
          setNotaInput({ valor: "", alunoID: "", atividadeID: "" });
          setErrorMessage("");
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            setErrorMessage(error.response.data.error);
          } else {
            setErrorMessage("Ocorreu um erro ao cadastrar a nota.");
          }
        });
    }
  };

  const handleEdit = (id) => {
    const nota = notas.find((n) => n.ID === id);
  
    const turmaRelacionada = turmas.find((turma) => turma.ID === nota.Atividade.TurmaID);
    setSelectedTurma(turmaRelacionada.ID);
  
    axios
      .get(`http://localhost:8080/atividades?turma_id=${turmaRelacionada.ID}`)
      .then((response) => {
        setAtividades(response.data);
        setNotaInput({
          valor: nota.Valor.toString(),
          alunoID: nota.AlunoID.toString(),
          atividadeID: nota.AtividadeID.toString(),
        });
      })
      .catch((error) => console.log(error));
  
    axios
      .get(`http://localhost:8080/alunos?turma_id=${turmaRelacionada.ID}`)
      .then((response) => {
        setAlunos(response.data);
        setEditingNotaId(id);
        setEditMode(true);
      })
      .catch((error) => console.log(error));
  };

  const handleDelete = (id) => {
    if (window.confirm("Você tem certeza que deseja remover esta nota?")) {
      axios
        .delete(`http://localhost:8080/notas/${id}`)
        .then(() => {
          setNotas(notas.filter((nota) => nota.ID !== id));
        })
        .catch((error) => {
          setErrorMessage("Ocorreu um erro ao remover a nota.");
        });
    }
  };

  return (
    <div className="container">
      <div className="jumbotron bg-primary text-white p-5 rounded-lg shadow-sm mb-4">
        <h2 className="display-4">Cadastro de Notas</h2>
        <p className="lead">Selecione uma turma, escolha uma atividade e atribua notas aos alunos.</p>
      </div>

      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-4 p-4 bg-light rounded-lg shadow" noValidate>
        <h3 className="mb-3">{editMode ? "Editar Nota" : "Cadastrar Nova Nota"}</h3>
        <div className="mb-3">
          <label htmlFor="turma" className="form-label">Turma</label>
          <select
            className="form-control"
            name="turma"
            id="turma"
            value={selectedTurma}
            onChange={handleTurmaChange}
            required
          >
            <option value="" disabled>Selecione uma Turma</option>
            {turmas.map((turma) => (
              <option key={turma.ID} value={turma.ID}>{turma.Nome} - {turma.Semestre}/{turma.Ano}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="atividadeID" className="form-label">Atividade</label>
          <select
            className="form-control"
            name="atividadeID"
            id="atividadeID"
            value={notaInput.atividadeID}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Selecione uma Atividade</option>
            {atividades.map((atividade) => (
              <option key={atividade.ID} value={atividade.ID}>{atividade.Nome} - Valor Máximo: {atividade.Valor} pontos</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="alunoID" className="form-label">Aluno</label>
          <select
            className="form-control"
            name="alunoID"
            id="alunoID"
            value={notaInput.alunoID}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Selecione um Aluno</option>
            {alunos.map((aluno) => (
              <option key={aluno.ID} value={aluno.ID}>{aluno.Nome} - Matrícula: {aluno.Matricula}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="valor" className="form-label">Nota</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            name="valor"
            id="valor"
            placeholder="Valor da Nota"
            value={notaInput.valor}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-success w-100">
          {editMode ? "Salvar" : "Cadastrar"}
        </button>
      </form>

      <h3 className="mb-3">Notas Cadastradas</h3>
      <div className="row">
        {notas.map((nota) => (
          <div key={nota.ID} className="col-md-4">
            <div className="card mb-4 shadow-sm border-0">
              <div className="card-body">
                <h5 className="card-title text-primary">Aluno: {nota.Aluno.Nome}</h5>
                <p className="card-text"><strong>Nota:</strong> {nota.Valor}</p>
                <p className="card-text"><strong>Atividade:</strong> {nota.Atividade.Nome}</p>
              </div>
              <button onClick={() => handleEdit(nota.ID)} className="btn btn-warning mt-2">Editar</button>
              <button onClick={() => handleDelete(nota.ID)} className="btn btn-danger mt-2">Remover</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notas;