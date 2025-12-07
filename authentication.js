/**
 * Memphora API Key Authentication
 * 
 * Users authenticate with their Memphora API key from
 * https://memphora.ai/dashboard
 */

const testAuth = async (z, bundle) => {
  const response = await z.request({
    url: 'https://api.memphora.ai/api/v1/health',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${bundle.authData.api_key}`,
    },
  });

  if (response.status === 401) {
    throw new z.errors.Error(
      'Invalid API key. Please check your Memphora API key.',
      'AuthenticationError',
      401
    );
  }

  // Return user info for connection label
  return {
    status: 'authenticated',
    message: 'Successfully connected to Memphora',
  };
};

module.exports = {
  type: 'custom',
  
  fields: [
    {
      key: 'api_key',
      label: 'API Key',
      type: 'string',
      required: true,
      helpText: 'Your Memphora API key. Get it from [memphora.ai/dashboard](https://memphora.ai/dashboard)',
    },
    {
      key: 'default_user_id',
      label: 'Default User ID',
      type: 'string',
      required: false,
      default: 'zapier_user',
      helpText: 'Default user ID for storing memories. Can be overridden per action.',
    },
  ],

  test: testAuth,

  connectionLabel: (z, bundle) => {
    return `Memphora (${bundle.authData.default_user_id || 'zapier_user'})`;
  },
};
