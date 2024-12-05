import { Octokit } from '@octokit/rest';
import { Client as NotionClient } from '@notionhq/client';

export const getGitHubClient = (accessToken: string) => {
  return new Octokit({ auth: accessToken });
};

export const createGitHubIssue = async (
  github: Octokit,
  owner: string,
  repo: string,
  title: string,
  body: string
) => {
  return await github.issues.create({ owner, repo, title, body });
};

export const getNotionClient = (accessToken: string) => {
  return new NotionClient({ auth: accessToken });
};

export const createNotionPage = async (
  notion: NotionClient,
  parentId: string,
  title: string,
  content: string
) => {
  return await notion.pages.create({
    parent: { page_id: parentId },
    properties: {
      title: {
        title: [
          {
            type: 'text',
            text: { content: title },
          },
        ],
      },
    },
    children: [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: { content },
            },
          ],
        },
      },
    ],
  });
};