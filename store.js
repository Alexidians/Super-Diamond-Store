function bindFunctionsToObject(obj, context) {
    // Iterate over all properties of the object
    for (const key in obj) {
        // Check if the property is a function
        if (typeof obj[key] === 'function') {
            // Bind the function to the specified context
            obj[key] = obj[key].bind(context);
        } else if (typeof obj[key] === 'object') {
            // If the property is an object, recursively bind functions in nested objects
            bindFunctionsToObject(obj[key], context);
        }
    }
    return obj;
}

function SuperDiamondStoreConst() {
    this.dbName = 'SUPERDIAMONDSTORE_Storage';
    this.storeName = 'SuperDiamondStore';
    this.version = 1;
    this.db = null;
    this.async = {
     reload: async function () {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(this.dbName, this.dbVersion);

                request.onerror = () => {
                    reject(new Error('Failed to open database.'));
                };

                request.onsuccess = () => {
                    this.db = request.result;
                    this.isInitialized = true;
                    if (!db.objectStoreNames.contains(this.storeName)) {
                        db.createObjectStore(this.storeName);
                    }
                    resolve();
                };

                request.onupgradeneeded = event => {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains(this.storeName)) {
                        db.createObjectStore(this.storeName);
                    }
                };
            });
    },
    setItem: async function (key, value) {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        await store.put(value, key);
    },
    getItem: async function (key) {
        const transaction = this.db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.get(key);

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                if (request.result) {
                    resolve(request.result);
                } else {
                    reject(new Error('Item not found.'));
                }
            };

            request.onerror = () => {
                reject(new Error('Failed to retrieve item.'));
            };
        });
    },
    removeItem: async function (key) {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        await store.delete(key);
    },

    clear: async function () {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        await store.clear();
    }
  }
  this.async = bindFunctionsToObject(this.async, this)
    this.sync = {
     reload: function () {
      var val = null 
     (async () => {
      val = await this.async.reload()
     })();
      return val;  
     },
    setItem: async function (key, value) {
      var val = null 
     (async () => {
      val = await this.async.setItem(key, value)
     })();
     return val;
    },
    getItem: async function (key) {
      var val = null 
     (async () => {
      val = await this.async.reload(key)
     })();
      return val;
    },
    removeItem: async function (key) {
      var val = null 
     (async () => {
      val = await this.async.removeItem(key)
     })();
      return val;  
    },

    clear: async function () {
      var val = null 
     (async () => {
      val = await this.async.clear()
     })();
      return val;  
    }
  }
  this.sync = bindFunctionsToObject(this.sync, this)
}

const SuperDiamondStore = new SuperDiamondStoreConst();
SuperDiamondStore.sync.reload()
