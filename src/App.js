import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Professores from './pages/professores';
import Turmas from './pages/turmas';
import Alunos from './pages/alunos';
import Atividades from './pages/atividades';
import Notas from './pages/notas';

function Home() {
  return (
    <div className="jumbotron bg-dark text-white p-5 rounded-lg shadow-sm text-center">
      <h1 className="display-4">Bem-vindo ao Cadastro-Escola!</h1>
      <p className="lead">Gerencie professores, turmas, alunos, atividades e notas de forma simples e eficiente.</p>
      <hr className="my-4" style={{ borderColor: '#6c757d' }} />
      <p className="mb-5">Atalhos das funcionalidades abaixo para começar a usar o sistema:</p>
      <div className="row text-center">
        <div className="col-md-4">
          <div className="card mb-4 h-100 border-primary shadow">
            <div className="card-body">
              <i className="bi bi-person-badge display-1 text-primary"></i>
              <h5 className="card-title mt-3">Professores</h5>
              <p className="card-text">Cadastre e visualize os professores da escola.</p>
              <Link to="/professores" className="btn btn-primary btn-block">Gerenciar Professores</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-4 h-100 border-success shadow">
            <div className="card-body">
              <i className="bi bi-people display-1 text-success"></i>
              <h5 className="card-title mt-3">Turmas</h5>
              <p className="card-text">Gerencie as turmas e atribua professores.</p>
              <Link to="/turmas" className="btn btn-success btn-block">Gerenciar Turmas</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-4 h-100 border-info shadow">
            <div className="card-body">
              <i className="bi bi-person display-1 text-info"></i>
              <h5 className="card-title mt-3">Alunos</h5>
              <p className="card-text">Cadastre alunos e associe-os a turmas.</p>
              <Link to="/alunos" className="btn btn-info btn-block">Gerenciar Alunos</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-4 h-100 border-warning shadow">
            <div className="card-body">
              <i className="bi bi-calendar-event display-1 text-warning"></i>
              <h5 className="card-title mt-3">Atividades</h5>
              <p className="card-text">Crie atividades para as turmas e defina os valores.</p>
              <Link to="/atividades" className="btn btn-warning btn-block">Gerenciar Atividades</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-4 h-100 border-danger shadow">
            <div className="card-body">
              <i className="bi bi-journal-check display-1 text-danger"></i>
              <h5 className="card-title mt-3">Notas</h5>
              <p className="card-text">Registre as notas dos alunos nas atividades.</p>
              <Link to="/notas" className="btn btn-danger btn-block">Gerenciar Notas</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App" style={{ backgroundColor: '#f8f9fa' }}>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">Cadastro-Escola</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/professores"><i className="bi bi-person-badge"></i> Professores</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/turmas"><i className="bi bi-people"></i> Turmas</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/alunos"><i className="bi bi-person"></i> Alunos</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/atividades"><i className="bi bi-calendar-event"></i> Atividades</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/notas"><i className="bi bi-journal-check"></i> Notas</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="container mt-4">
          <Routes>
            <Route path="/professores" element={<Professores />} />
            <Route path="/turmas" element={<Turmas />} />
            <Route path="/alunos" element={<Alunos />} />
            <Route path="/atividades" element={<Atividades />} />
            <Route path="/notas" element={<Notas />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;