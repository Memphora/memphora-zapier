/**
 * Get Context Action
 * 
 * Retrieves formatted context for AI prompts.
 * Returns a ready-to-use string with relevant memories.
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
      limit: bundle.inputData.limit || 10,
    },
  });

  const memories = Array.isArray(response.data) ? response.data : response.data.memories || [];
  
  // Format context string
  let context = '';
  if (memories.length > 0) {
    const prefix = bundle.inputData.prefix || 'Relevant context from previous conversations:';
    const memoryLines = memories.map(m => `- ${m.content}`).join('\n');
    context = `${prefix}\n${memoryLines}`;
  }

  return [{
    context: context,
    memory_count: memories.length,
    user_id: userId,
    query: bundle.inputData.query,
    has_context: memories.length > 0,
  }];
};

module.exports = {
  key: 'get_context',
  noun: 'Context',
  
  display: {
    label: 'Get Context for AI',
    description: 'Gets formatted context from memories, ready to use in AI prompts.',
  },

  operation: {
    inputFields: [
      {
        key: 'query',
        label: 'Query',
        type: 'string',
        required: true,
        helpText: 'What context to retrieve. Usually the user\'s question or topic.',
      },
      {
        key: 'user_id',
        label: 'User ID',
        type: 'string',
        required: false,
        helpText: 'Get context for a specific user. Leave empty to use default.',
      },
      {
        key: 'limit',
        label: 'Max Memories',
        type: 'integer',
        required: false,
        default: '10',
        helpText: 'Maximum number of memories to include in context',
      },
      {
        key: 'prefix',
        label: 'Context Prefix',
        type: 'string',
        required: false,
        default: 'Relevant context from previous conversations:',
        helpText: 'Text to prepend to the context',
      },
    ],

    perform: perform,

    sample: {
      context: 'Relevant context from previous conversations:\n- User prefers dark mode\n- User works as a software engineer\n- User is interested in AI and machine learning',
      memory_count: 3,
      user_id: 'user_123',
      query: 'user preferences',
      has_context: true,
    },

    outputFields: [
      { key: 'context', label: 'Context', type: 'text' },
      { key: 'memory_count', label: 'Memory Count', type: 'integer' },
      { key: 'user_id', label: 'User ID', type: 'string' },
      { key: 'query', label: 'Query', type: 'string' },
      { key: 'has_context', label: 'Has Context', type: 'boolean' },
    ],
  },
};
