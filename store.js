function SuperDiamondStoreConst() {
    this.dbName = 'SUPERDIAMONDSTORE_Storage';
    this.name = 'SuperDiamondStore';
    this.version = 1;
    this.db = null;
    this.async = {
     reload: async function () {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(this.dbName, this.dbVersion);

                request.onerror = () => {
                    console.error('Failed to open database.');
                    reject('Failed to open database.');
                };

                request.onsuccess = () => {
                    this.db = request.result;
                    console.log('Database opened successfully.');
                    this.isInitialized = true;
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
        console.log('Item set successfully.');
    },
    getItem: async function (key) {
        const transaction = this.db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.get(key);

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                if (request.result) {
                    console.log('Item retrieved successfully.');
                    resolve(request.result);
                } else {
                    console.error('Item not found.');
                    reject('Item not found.');
                }
            };

            request.onerror = () => {
                console.error('Failed to retrieve item.');
                reject('Failed to retrieve item.');
            };
        });
    },
    removeItem: async function (key) {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        await store.delete(key);
        console.log('Item removed successfully.');
    },

    clear: async function () {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        await store.clear();
        console.log('Store cleared successfully.');
    }
  }
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
}

const SuperDiamondStore = new SuperDiamondStoreConst();
SuperDiamondStore.sync.reload()
