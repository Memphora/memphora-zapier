/**
 * Store Memory Action
 * 
 * Stores a new memory in Memphora for a specific user.
 * Use this to save important information from any app.
 */

const perform = async (z, bundle) => {
  const userId = bundle.inputData.user_id || bundle.authData.default_user_id || 'zapier_user';
  
  const response = await z.request({
    url: 'https://api.memphora.ai/api/v1/memories',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${bundle.authData.api_key}`,
      'Content-Type': 'application/json',
    },
    body: {
      user_id: userId,
      content: bundle.inputData.content,
      metadata: {
        source: 'zapier',
        zap_id: bundle.meta?.zap?.id || 'unknown',
        ...(bundle.inputData.category && { category: bundle.inputData.category }),
        ...(bundle.inputData.tags && { tags: bundle.inputData.tags.split(',').map(t => t.trim()) }),
        ...(bundle.inputData.custom_metadata && JSON.parse(bundle.inputData.custom_metadata)),
      },
    },
  });

  return response.data;
};

module.exports = {
  key: 'store_memory',
  noun: 'Memory',
  
  display: {
    label: 'Store Memory',
    description: 'Stores a new memory in Memphora. The AI will remember this information.',
  },

  operation: {
    inputFields: [
      {
        key: 'content',
        label: 'Memory Content',
        type: 'text',
        required: true,
        helpText: 'The information to remember. Example: "John prefers email communication"',
      },
      {
        key: 'user_id',
        label: 'User ID',
        type: 'string',
        required: false,
        helpText: 'Unique identifier for the user. Leave empty to use default.',
      },
      {
        key: 'category',
        label: 'Category',
        type: 'string',
        required: false,
        helpText: 'Optional category for organizing memories (e.g., "preferences", "work", "personal")',
      },
      {
        key: 'tags',
        label: 'Tags',
        type: 'string',
        required: false,
        helpText: 'Comma-separated tags (e.g., "important, customer, vip")',
      },
      {
        key: 'custom_metadata',
        label: 'Custom Metadata (JSON)',
        type: 'text',
        required: false,
        helpText: 'Additional metadata as JSON (e.g., {"priority": "high", "source_app": "hubspot"})',
      },
    ],

    perform: perform,

    sample: {
      id: 'mem_abc123',
      user_id: 'user_123',
      content: 'John prefers email communication over phone calls',
      metadata: {
        source: 'zapier',
        category: 'preferences',
      },
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z',
    },

    outputFields: [
      { key: 'id', label: 'Memory ID', type: 'string' },
      { key: 'user_id', label: 'User ID', type: 'string' },
      { key: 'content', label: 'Content', type: 'string' },
      { key: 'created_at', label: 'Created At', type: 'datetime' },
    ],
  },
};
