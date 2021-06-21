const users = [];

const addUser = function ({ id, username, room }) {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  //Validation
  if (!username || !room) {
    return {
      error: "Username and Room are required !",
    };
  }
  // Existing already
  const existingUser = users.find((user) => {
    return user.username === username && user.room === room;
  });
  if (existingUser) {
    return {
      error: "Username in use !",
    };
  }

  // Store User
  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = function (id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = function (id) {
  const user = users.find((user) => user.id === id);
  return user;
};

const getUsersInRoom = function (room) {
  room = room.trim().toLowerCase();
  return users.filter((user) => user.room === room);
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
