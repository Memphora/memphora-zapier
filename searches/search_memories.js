/**
 * Search Memories Action
 * 
 * Searches for relevant memories using semantic search.
 * Returns memories that match the query by meaning, not just keywords.
 */

const perform = async (z, bundle) => {
  const userId = bundle.inputData.user_id || bundle.authData.default_user_id || 'zapier_user';
  
  const response = await z.request({
    url: 'https://api.memphora.ai/api/v1/memories/search',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${bundle.authData.api_key}`,
      'Content-Type': 'application/json',
    },
    body: {
      user_id: userId,
      query: bundle.inputData.query,
      limit: bundle.inputData.limit || 5,
    },
  });

  const memories = Array.isArray(response.data) ? response.data : response.data.memories || [];
  
  return memories.map(mem => ({
    id: mem.id,
    content: mem.content,
    user_id: mem.user_id,
    score: mem.score,
    created_at: mem.created_at,
    metadata: JSON.stringify(mem.metadata || {}),
  }));
};

module.exports = {
  key: 'search_memories',
  noun: 'Memory',
  
  display: {
    label: 'Search Memories',
    description: 'Searches for relevant memories using AI-powered semantic search.',
  },

  operation: {
    inputFields: [
      {
        key: 'query',
        label: 'Search Query',
        type: 'string',
        required: true,
        helpText: 'What to search for. Example: "customer preferences" or "previous issues"',
      },
      {
        key: 'user_id',
        label: 'User ID',
        type: 'string',
        required: false,
        helpText: 'Search memories for a specific user. Leave empty to use default.',
      },
      {
        key: 'limit',
        label: 'Max Results',
        type: 'integer',
        required: false,
        default: '5',
        helpText: 'Maximum number of memories to return (1-20)',
      },
    ],

    perform: perform,

    sample: {
      id: 'mem_abc123',
      content: 'Customer prefers email communication over phone calls',
      user_id: 'user_123',
      score: 0.92,
      created_at: '2024-01-15T10:30:00Z',
      metadata: '{"category": "preferences"}',
    },

    outputFields: [
      { key: 'id', label: 'Memory ID', type: 'string' },
      { key: 'content', label: 'Content', type: 'string' },
      { key: 'user_id', label: 'User ID', type: 'string' },
      { key: 'score', label: 'Relevance Score', type: 'number' },
      { key: 'created_at', label: 'Created At', type: 'datetime' },
      { key: 'metadata', label: 'Metadata (JSON)', type: 'string' },
    ],
  },
};
