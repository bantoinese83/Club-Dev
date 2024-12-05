import { Client } from '@elastic/elasticsearch';

async function run() {
  const client = new Client({ node: 'http://localhost:9200' });

  try {
    // Ping the Elasticsearch cluster
    const ping = await client.ping();
    console.log('Elasticsearch cluster is up:', ping);

    // Index a document
    const response = await client.index({
      index: 'my-index',
      document: {
        title: 'Hello, Elasticsearch!',
        content: 'This is a test document.',
      },
    });
    console.log('Document indexed:', response);
  } catch (error) {
    console.error('Error:', error);
  }
}

run().catch(console.error);