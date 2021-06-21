// const qs = require("qs");

const socket = io();

// socket.on("countUpdated", (count) => {
//   console.log("The count has been updated !", count);
// });

// document.querySelector("#increment").addEventListener("click", () => {
//   console.log("Clicked");

//   socket.emit("increment");
// });

// Elements
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocation = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");
const $sidebar = document.querySelector("#sidebar");

// Templates
const $messageTemp = document.querySelector("#message-temp").innerHTML;
const $locationTemp = document.querySelector("#message-location").innerHTML;
const $sidebarTemp = document.querySelector("#sidebar-template").innerHTML;

// Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
// console.log(username, room);

const autoscroll = function () {
  $messages.scrollTop = $messages.scrollHeight;
  // New message element
  // const $newMsg = $messages.lastElementChild;

  // // Height of the last msg
  // const newMsgStyles = getComputedStyle($newMsg);
  // const newMsgMargin = parseInt(newMsgStyles.marginBottom);
  // const newMsgHeight = $newMsg.offsetHeight + newMsgMargin;
  // console.log(newMsgHeight);

  // // Visible Height
  // const visibleHeight = $messages.offsetHeight;
  // // Height of msgs container
  // const containerHeight = $messages.scrollHeight;
  // // How far have I scrolled?
  // const scrollOffset = $messages.scrollTop + visibleHeight;

  // if (containerHeight - newMsgHeight <= scrollOffset) {
  //   $messages.scrollTop = $messages.scrollHeight;
  // }
};

socket.on("message", (message) => {
  const html = Mustache.render($messageTemp, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm:ss A"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("locationMessage", (urlMessage) => {
  const html = Mustache.render($locationTemp, {
    username: urlMessage.username,
    url: urlMessage.url,
    createdAt: moment(urlMessage.createdAt).format("h:mm:ss A"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render($sidebarTemp, {
    room,
    users,
  });
  $sidebar.innerHTML = html;
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Disable the button
  $messageFormButton.setAttribute("disabled", "disabled");

  const message = e.target.elements.message.value;
  socket.emit("sendMessage", message, (error) => {
    // Enable the button
    $messageFormButton.removeAttribute("disabled");

    $messageFormInput.value = "";
    $messageFormInput.focus();

    if (error) return console.log(error);
    console.log("Message delivered");
  });
});

$sendLocation.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation not supported !");
  }
  $sendLocation.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition((pos) => {
    socket.emit(
      "sendLocation",
      {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      },
      () => {
        $sendLocation.removeAttribute("disabled");

        console.log("Location shared !");
      }
    );
  });
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
