// Autodesk Forge configuration
module.exports = {
    // Set environment variables or hard-code here
    credentials: {
        client_id: '49FkrIoZFbuRA64ORi63YpE6djBWJz8M',
        client_secret: 'kypZruU2hH3TKscA',
        callback_url: process.env.FORGE_CALLBACK_URL
    },
    scopes: {
        // Required scopes for the server-side application
        internal: ['bucket:create', 'bucket:read', 'data:read', 'data:create', 'data:write'],
        // Required scope for the client-side viewer
        public: ['viewables:read']
    }
};

/**
 * 
 * var client_id = "wvgQAtFgPT6c8VYkwwLfxQmucS2jTEfn";
  
  var client_secret = "XyYVpQLxohRKeWxo";
 * 
 * client_id: 'wiqmJHyYf6k9WYYYUrNregL0ezHvWGrg',
        client_secret: 'hcJSO40TQkuOWksk',
 * 90Wu7ak6vUw5tqAvk1O1cbXmhs1mmcwb
 * K3574a6981557400
 * 
 * 56giYd0ObF2YcG5qYJ3le74kUIZHLtGW
 * m7Js0ytjyo92Fwz7
 * 
 * 
 *  client_id: '90Wu7ak6vUw5tqAvk1O1cbXmhs1mmcwb',
        client_secret: 'K3574a6981557400',
 * 
 *    client_id: 'wvgQAtFgPT6c8VYkwwLfxQmucS2jTEfn',
        client_secret: 'XyYVpQLxohRKeWxo',
 * module.exports = {
    // Set environment variables or hard-code here
    credentials: {
        client_id: 'dZy0vjqPBdftXU3ZJkkoBsEqDyV4PAIG',
        client_secret: 'GhiWY2skdzfG0ugH',
        callback_url: process.env.FORGE_CALLBACK_URL
    },
    scopes: {
        // Required scopes for the server-side application
        internal: ['bucket:create', 'bucket:read', 'data:read', 'data:create', 'data:write'],
        // Required scope for the client-side viewer
        public: ['viewables:read']
    }
};

 * 
 * 
 */