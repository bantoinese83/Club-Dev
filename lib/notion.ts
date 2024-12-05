import {Client} from '@notionhq/client';

export const getNotionClient = (accessToken: string) => {
    return new Client({auth: accessToken});
};

export const getNotionPages = async (accessToken: string) => {
    const notion = getNotionClient(accessToken);
    const {results} = await notion.search({
        filter: {property: 'object', value: 'page'},
    });
    return results;
};

export const createNotionPage = async (accessToken: string, title: string, content: string) => {
    const notion = getNotionClient(accessToken);
    return await notion.pages.create({
        parent: {type: 'page_id', page_id: process.env.NOTION_PARENT_PAGE_ID!},
        properties: {
            title: {
                title: [
                    {
                        text: {
                            content: title,
                        },
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
                            text: {
                                content,
                            },
                        },
                    ],
                },
            },
        ],
    });
}