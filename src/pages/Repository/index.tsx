import React from "react";
import { useRouteMatch } from "react-router-dom";

interface IRepositoryParams {
  repository: string;
}

const Repository: React.FC = () => {
  const { params } = useRouteMatch<IRepositoryParams>();

  return <h1>Repository: {params.repository}</h1>;
};

export default Repository;
