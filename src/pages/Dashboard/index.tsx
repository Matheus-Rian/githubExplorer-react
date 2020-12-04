import React, { useState, useEffect, FormEvent } from "react";
import { Link } from 'react-router-dom';
import api from "../../services/api";
import { FiChevronRight } from "react-icons/fi";
import { Title, Form, Repositories, Error } from "./styles";
import logoImg from "../../assets/logo.svg";

interface IRepository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState("");
  const [inputError, setInputError] = useState("");

  const [repositories, setRepositories] = useState<IRepository[]>(() => {
    const storagedRepositories = localStorage.getItem("@GithubExplorer:repositories");

    if(storagedRepositories) {
      return JSON.parse(storagedRepositories);
    } 

    return []
  });

  useEffect(() => {
    localStorage.setItem("@GithubExplorer:repositories", JSON.stringify(repositories));
  }, [repositories]);

  async function handleAddRepository(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    if (!newRepo) {
      setInputError("Digite o autor/nome do repositório");
      return;
    }

    try {
      // Consumir API do github
      const response = await api.get<IRepository>(`repos/${newRepo}`);

      // Adição de um novo repositório
      const repository = response.data;

      // Salvar novo repositório no estado
      setRepositories([...repositories, repository]);
      setNewRepo("");
      setInputError("");
    } catch (error) {
      setInputError("Erro na busca do repositório");
    }
  }

  return (
    <>
      <img src={logoImg} alt="Github Explorer" />
      <Title>Explore repositórios no Github</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          value={newRepo}
          onChange={(e) => setNewRepo(e.target.value)}
          placeholder="Digite o nome do repositório"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map((repository) => (
          <Link key={repository.full_name} to={`/repositories/${repository.full_name}`}>
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={30} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
