/**
 * Memphora Zapier Integration
 * 
 * Provides actions and triggers for integrating Memphora AI Memory
 * with 6,000+ apps through Zapier automations.
 */

const authentication = require('./authentication');
const storeMemory = require('./creates/store_memory');
const searchMemories = require('./searches/search_memories');
const storeConversation = require('./creates/store_conversation');
const getContext = require('./searches/get_context');
const deleteMemory = require('./creates/delete_memory');
const newMemory = require('./triggers/new_memory');

module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication: authentication,

  // Triggers - What can start a Zap
  triggers: {
    [newMemory.key]: newMemory,
  },

  // Searches - Find existing data
  searches: {
    [searchMemories.key]: searchMemories,
    [getContext.key]: getContext,
  },

  // Creates - Create new data
  creates: {
    [storeMemory.key]: storeMemory,
    [storeConversation.key]: storeConversation,
    [deleteMemory.key]: deleteMemory,
  },

  // Resources (optional, for REST hooks)
  resources: {},

  // Hydrators for deferred data
  hydrators: {},
};
