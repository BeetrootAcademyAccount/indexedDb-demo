const request = indexedDB.open("test2Database", 1);
const addBtn = document.querySelector("#add");
const getBtn = document.querySelector("#get");

let db;
let counter = 0;

request.onerror = (event) => {
  console.log("Database error is:", event.target.error);
};

request.onsuccess = (event) => {
  db = event.target.result;
  console.log(db);
  console.log("Database Opened Successfully");
};

request.onupgradeneeded = (event) => {
  db = event.target.result;

  const objectStore = db.createObjectStore("dataStore", {
    keyPath: "id",
    autoIncrement: true,
  });

  objectStore.createIndex("name", "name", { unique: false });

  console.log("Database update complete");
};

addBtn.addEventListener("click", () => {
  const transaction = db.transaction("dataStore", "readwrite");
  const objectStore = transaction.objectStore("dataStore");
  counter++;
  const newData = { name: `Person${counter}` };
  const request = objectStore.add(newData);

  request.onerror = (event) => {
    console.log("Error in adding:", event.target.error);
  };

  request.onsuccess = () => {
    console.log("Data added successfully");
  };
});

getBtn.addEventListener("click", () => {
  const transaction = db.transaction("dataStore", "readonly");
  const objectStore = transaction.objectStore("dataStore");

  const index = objectStore.index("name");

  index.openCursor().onsuccess = (event) => {
    const cursor = event.target.result;

    if (cursor) {
      console.log("ID", cursor.key, "Name:", cursor.value.name);
    } else {
      console.log("No more data");
    }
  };
});
