import React, { useState, useEffect } from "react";
import axios from "axios";

function Professores() {
  const [professores, setProfessores] = useState([]);
  const [novoProfessor, setNovoProfessor] = useState({
    nome: "",
    email: "",
    cpf: "",
  });
  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editingProfessorId, setEditingProfessorId] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/professores")
      .then((response) => setProfessores(response.data))
      .catch((error) => console.log(error));
  }, []);

  const handleChange = (e) => {
    setNovoProfessor({ ...novoProfessor, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    if (!novoProfessor.nome) {
      tempErrors["nome"] = "O nome é obrigatório.";
      isValid = false;
    }
    if (!novoProfessor.email) {
      tempErrors["email"] = "O email é obrigatório.";
      isValid = false;
    }

    const cpfRegex = /^[0-9]{11}$/;
    if (!novoProfessor.cpf) {
      tempErrors["cpf"] = "O CPF é obrigatório.";
      isValid = false;
    } else if (!cpfRegex.test(novoProfessor.cpf)) {
      tempErrors["cpf"] = "O CPF deve conter 11 dígitos numéricos.";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      axios
        .post("http://localhost:8080/professores", novoProfessor)
        .then((response) => {
          setProfessores([...professores, response.data]);
          setNovoProfessor({ nome: "", email: "", cpf: "" });
          setErrors({});
        })
        .catch((error) => console.log(error));
    }
  };

  const handleSave = () => {
    if (validate()) {
      axios
        .put(`http://localhost:8080/professores/${editingProfessorId}`, novoProfessor)
        .then((response) => {
          setProfessores(
            professores.map((prof) =>
              prof.ID === editingProfessorId ? response.data : prof
            )
          );
          setNovoProfessor({ nome: "", email: "", cpf: "" });
          setEditingProfessorId(null);
          setEditMode(false);
          setErrors({});
        })
        .catch((error) => console.log(error));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Você tem certeza que deseja remover este professor?")) {
      axios
        .delete(`http://localhost:8080/professores/${id}`)
        .then(() => {
          setProfessores(
            professores.filter((professor) => professor.ID !== id)
          );
        })
        .catch((error) => console.log(error));
    }
  };

  const handleEdit = (id) => {
    const professor = professores.find((prof) => prof.ID === id);
    setNovoProfessor({
      nome: professor.Nome,
      email: professor.Email,
      cpf: professor.CPF,
    });
    setEditingProfessorId(id);
    setEditMode(true);
  };

  return (
    <div className="container">
      <div className="jumbotron bg-primary text-white p-5 rounded-lg shadow-sm mb-4">
        <h2 className="display-4">Gerenciamento de Professores</h2>
        <p className="lead">
          Cadastre novos professores e visualize a lista completa dos docentes.
        </p>
      </div>

      <h3 className="mb-4">
        {editMode ? "Editar Professor" : "Cadastrar Novo Professor"}
      </h3>
      <form className="mb-4 p-4 bg-light rounded-lg shadow">
        <div className="mb-3">
          <label htmlFor="nome" className="form-label">
            Nome
          </label>
          <input
            type="text"
            className={`form-control ${errors.nome ? "is-invalid" : ""}`}
            name="nome"
            id="nome"
            placeholder="Nome"
            value={novoProfessor.nome}
            onChange={handleChange}
            required
          />
          {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            name="email"
            id="email"
            placeholder="Email"
            value={novoProfessor.email}
            onChange={handleChange}
            required
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email}</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="cpf" className="form-label">
            CPF
          </label>
          <input
            type="text"
            className={`form-control ${errors.cpf ? "is-invalid" : ""}`}
            name="cpf"
            id="cpf"
            placeholder="CPF"
            value={novoProfessor.cpf}
            onChange={handleChange}
            required
            maxLength="11"
            pattern="[0-9]*"
          />
          {errors.cpf && <div className="invalid-feedback">{errors.cpf}</div>}
        </div>
        <button
          type="button"
          className={`btn ${editMode ? "btn-warning" : "btn-success"} w-100`}
          onClick={editMode ? handleSave : handleSubmit}
        >
          {editMode ? "Salvar" : "Cadastrar"}
        </button>
      </form>

      <h3 className="mb-4">Lista de Professores</h3>
      <div className="row">
        {professores.map((professor) => (
          <div key={professor.ID} className="col-md-4">
            <div className="card mb-4 border-0 shadow">
              <div className="card-body">
                <h5 className="card-title text-primary">{professor.Nome}</h5>
                <p className="card-text">
                  <strong>Email:</strong> {professor.Email}
                </p>
                <p className="card-text">
                  <strong>CPF:</strong> {professor.CPF}
                </p>
              </div>
              <button
                onClick={() => handleEdit(professor.ID)}
                className="btn btn-warning mt-2"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(professor.ID)}
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

export default Professores;