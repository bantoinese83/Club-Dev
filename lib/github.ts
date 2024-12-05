import { Octokit } from '@octokit/rest';

export const getGitHubClient = (accessToken: string) => {
  return new Octokit({ auth: accessToken });
};

export const getRepositories = async (accessToken: string) => {
  const octokit = getGitHubClient(accessToken);
  const { data } = await octokit.repos.listForAuthenticatedUser();
  return data;
};

export const getRecentCommits = async (accessToken: string, repo: string, owner: string) => {
  const octokit = getGitHubClient(accessToken);
  const { data } = await octokit.repos.listCommits({
    owner,
    repo,
    per_page: 5,
  });
  return data;
};

export const createIssue = async (accessToken: string, repo: string, owner: string, title: string, body: string) => {
  const octokit = getGitHubClient(accessToken);
  const { data } = await octokit.issues.create({
    owner,
    repo,
    title,
    body,
  });
  return data;
};

