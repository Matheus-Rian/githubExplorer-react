import React, { useEffect, useState } from "react";
import { useRouteMatch, Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Header, RepositoryInfo, Issues } from "./styles";
import api from "../../services/api";
import logoImg from "../../assets/logo.svg";

interface IRepositoryParams {
  repository: string;
}

interface IRepository {
  full_name: string;
  description: string;
  stargazers_count: number;
  open_issues_count: number;
  forks: number;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface IIssue {
  id: number;
  title: string;
  html_url: string;
  user: {
    login: string;
  };
}

const Repository: React.FC = () => {
  const [repository, setRepository] = useState<IRepository | null>(null);
  const [issues, setIssues] = useState<IIssue[]>([]);

  const { params } = useRouteMatch<IRepositoryParams>();

  useEffect(() => {
    api.get(`repos/${params.repository}`).then((response) => {
      setRepository(response.data);
    });

    api.get(`repos/${params.repository}/issues`).then((response) => {
      setIssues(response.data);
    });

    // Outra forma de fazer:
    // async function loadData(): Promise<void> {
    //   const [repository, issues] = await Promise.all([
    //     api.get(`repo/${params.repository}`),
    //     api.get(`repo/${params.repository}/issues`),
    //   ]);

    //   console.log(repository, issues);
    // }

    // loadData();
  }, [params.repository]);

  return (
    <>
      <Header>
        <img src={logoImg} alt="Github Explorer" />
        <Link to="/">
          <FiChevronLeft size={16} />
          Voltar
        </Link>
      </Header>

      {repository && (
        <RepositoryInfo>
          <header>
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
          </header>
          <ul>
            <li>
              <strong>{repository.stargazers_count}</strong>
              <span>Starts</span>
            </li>
            <li>
              <strong>{repository.forks}</strong>
              <span>Forks</span>
            </li>
            <li>
              <strong>{repository.open_issues_count}</strong>
              <span>Issues abertas</span>
            </li>
          </ul>
        </RepositoryInfo>
      )}

      <Issues>
        {issues.map(issue => (
          <a key={issue.id} href={issue.html_url}>
            <div> 
              <strong>{issue.title}</strong>
              <p>{issue.user.login}</p>
            </div>
            <FiChevronRight size={30} />
          </a>
        ))}
      </Issues>
    </>
  );
};

export default Repository;
