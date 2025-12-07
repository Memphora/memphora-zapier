/**
 * Store Conversation Action
 * 
 * Extracts and stores memories from a conversation transcript.
 * Memphora AI automatically identifies important facts to remember.
 */

const perform = async (z, bundle) => {
  const userId = bundle.inputData.user_id || bundle.authData.default_user_id || 'zapier_user';
  
  // Parse conversation - support multiple formats
  let messages = [];
  
  if (bundle.inputData.conversation_json) {
    // JSON format: [{"role": "user", "content": "..."}, ...]
    messages = JSON.parse(bundle.inputData.conversation_json);
  } else if (bundle.inputData.user_message && bundle.inputData.assistant_message) {
    // Simple format: single exchange
    messages = [
      { role: 'user', content: bundle.inputData.user_message },
      { role: 'assistant', content: bundle.inputData.assistant_message },
    ];
  } else if (bundle.inputData.transcript) {
    // Plain text transcript - parse it
    const lines = bundle.inputData.transcript.split('\n').filter(l => l.trim());
    for (const line of lines) {
      const userMatch = line.match(/^(user|customer|human|me):\s*(.+)/i);
      const assistantMatch = line.match(/^(assistant|ai|bot|agent|support):\s*(.+)/i);
      
      if (userMatch) {
        messages.push({ role: 'user', content: userMatch[2].trim() });
      } else if (assistantMatch) {
        messages.push({ role: 'assistant', content: assistantMatch[2].trim() });
      }
    }
  }

  if (messages.length === 0) {
    throw new z.errors.Error(
      'No valid conversation found. Please provide conversation_json, user_message + assistant_message, or transcript.',
      'InputError'
    );
  }

  const response = await z.request({
    url: 'https://api.memphora.ai/api/v1/conversations/extract',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${bundle.authData.api_key}`,
      'Content-Type': 'application/json',
    },
    body: {
      user_id: userId,
      conversation: messages,
      metadata: {
        source: 'zapier',
        zap_id: bundle.meta?.zap?.id || 'unknown',
        platform: bundle.inputData.platform || 'zapier',
      },
    },
  });

  const data = response.data;
  
  return {
    memories_extracted: data.memories?.length || 0,
    memories: data.memories || [],
    user_id: userId,
    message_count: messages.length,
  };
};

module.exports = {
  key: 'store_conversation',
  noun: 'Conversation',
  
  display: {
    label: 'Store Conversation',
    description: 'Extracts and stores important facts from a conversation. AI automatically identifies what to remember.',
  },

  operation: {
    inputFields: [
      {
        key: 'user_id',
        label: 'User ID',
        type: 'string',
        required: false,
        helpText: 'Unique identifier for the user. Leave empty to use default.',
      },
      {
        key: 'conversation_json',
        label: 'Conversation (JSON)',
        type: 'text',
        required: false,
        helpText: 'Full conversation as JSON array: [{"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]',
      },
      {
        key: 'user_message',
        label: 'User Message',
        type: 'text',
        required: false,
        helpText: 'Single user message (use with Assistant Message for simple exchanges)',
      },
      {
        key: 'assistant_message',
        label: 'Assistant Message',
        type: 'text',
        required: false,
        helpText: 'Single assistant response (use with User Message)',
      },
      {
        key: 'transcript',
        label: 'Plain Text Transcript',
        type: 'text',
        required: false,
        helpText: 'Plain text transcript with "User:" and "Assistant:" prefixes',
      },
      {
        key: 'platform',
        label: 'Source Platform',
        type: 'string',
        required: false,
        helpText: 'Where this conversation came from (e.g., "intercom", "zendesk", "slack")',
      },
    ],

    perform: perform,

    sample: {
      memories_extracted: 2,
      memories: [
        {
          id: 'mem_abc123',
          content: 'User prefers dark mode in applications',
        },
        {
          id: 'mem_def456',
          content: 'User works in software development',
        },
      ],
      user_id: 'user_123',
      message_count: 4,
    },

    outputFields: [
      { key: 'memories_extracted', label: 'Memories Extracted', type: 'integer' },
      { key: 'user_id', label: 'User ID', type: 'string' },
      { key: 'message_count', label: 'Messages Processed', type: 'integer' },
    ],
  },
};
