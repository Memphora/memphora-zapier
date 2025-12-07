/**
 * Delete Memory Action
 * 
 * Deletes a specific memory by ID.
 * Use this to remove outdated or incorrect information.
 */

const perform = async (z, bundle) => {
  const response = await z.request({
    url: `https://api.memphora.ai/api/v1/memories/${bundle.inputData.memory_id}`,
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${bundle.authData.api_key}`,
    },
  });

  return {
    deleted: true,
    memory_id: bundle.inputData.memory_id,
    message: 'Memory successfully deleted',
  };
};

module.exports = {
  key: 'delete_memory',
  noun: 'Memory',
  
  display: {
    label: 'Delete Memory',
    description: 'Deletes a specific memory by its ID.',
  },

  operation: {
    inputFields: [
      {
        key: 'memory_id',
        label: 'Memory ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the memory to delete (e.g., from a previous search)',
      },
    ],

    perform: perform,

    sample: {
      deleted: true,
      memory_id: 'mem_abc123',
      message: 'Memory successfully deleted',
    },

    outputFields: [
      { key: 'deleted', label: 'Deleted', type: 'boolean' },
      { key: 'memory_id', label: 'Memory ID', type: 'string' },
      { key: 'message', label: 'Message', type: 'string' },
    ],
  },
};
