/**
 * New Memory Trigger
 * 
 * Triggers when a new memory is created for a user.
 * Uses polling to check for new memories.
 */

const perform = async (z, bundle) => {
  const userId = bundle.inputData.user_id || bundle.authData.default_user_id || 'zapier_user';
  
  const response = await z.request({
    url: `https://api.memphora.ai/api/v1/memories/user/${userId}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${bundle.authData.api_key}`,
    },
    params: {
      limit: 20,
    },
  });

  const memories = Array.isArray(response.data) ? response.data : response.data.memories || [];
  
  // Sort by created_at descending and return
  return memories
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .map(mem => ({
      id: mem.id,
      content: mem.content,
      user_id: mem.user_id,
      created_at: mem.created_at,
      updated_at: mem.updated_at,
      metadata: JSON.stringify(mem.metadata || {}),
    }));
};

module.exports = {
  key: 'new_memory',
  noun: 'Memory',
  
  display: {
    label: 'New Memory',
    description: 'Triggers when a new memory is created.',
  },

  operation: {
    type: 'polling',
    
    inputFields: [
      {
        key: 'user_id',
        label: 'User ID',
        type: 'string',
        required: false,
        helpText: 'Watch for new memories for a specific user. Leave empty to use default.',
      },
    ],

    perform: perform,

    sample: {
      id: 'mem_abc123',
      content: 'User mentioned they prefer morning meetings',
      user_id: 'user_123',
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z',
      metadata: '{"source": "slack"}',
    },

    outputFields: [
      { key: 'id', label: 'Memory ID', type: 'string' },
      { key: 'content', label: 'Content', type: 'string' },
      { key: 'user_id', label: 'User ID', type: 'string' },
      { key: 'created_at', label: 'Created At', type: 'datetime' },
      { key: 'updated_at', label: 'Updated At', type: 'datetime' },
      { key: 'metadata', label: 'Metadata (JSON)', type: 'string' },
    ],
  },
};
