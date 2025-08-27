// Your Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyB8ulyJra_vhjIhQS-A_woY-REqHQLpHRc",
  authDomain: "portfolio-chat-c351a.firebaseapp.com",
  projectId: "portfolio-chat-c351a",
  storageBucket: "portfolio-chat-c351a.appspot.com",
  messagingSenderId: "448554927999",
  appId: "1:448554927999:web:5e17f51f0568c7eb82fc4a",
  measurementId: "G-VS77HK27YC"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Audio effects initialization
var sendAudio = new Audio('s.mp3');
var receiveAudio = new Audio('g.mp3');

document.addEventListener("DOMContentLoaded", function() {
  var messageInput = document.getElementById("messageInput");
  var fileInput = document.getElementById("fileInput");
  var chatContainer = document.getElementById("chatContainer");
  var sendButton = document.getElementById("sendButton");
  var usernameContainer = document.getElementById("usernameContainer");
  var usernameInput = document.getElementById("usernameInput");
  var usernameSubmit = document.getElementById("usernameSubmit");
  var username = null;

  // Initially, hide the chat and input containers
  chatContainer.style.display = 'none';
  document.querySelector(".input-container").style.display = 'none';

  function setUsername() {
    var inputUsername = usernameInput.value.trim();
    if (inputUsername !== "") {
      username = inputUsername;
      usernameContainer.style.display = "none";
      chatContainer.style.display = 'block';
      document.querySelector(".input-container").style.display = 'flex';
    }
  }

  usernameSubmit.addEventListener("click", setUsername);
  usernameInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      setUsername();
    }
  });

  sendButton.addEventListener("click", function() {
    var messageContent = messageInput.value.trim();
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const storageRef = firebase.storage().ref('uploads/' + new Date().getTime() + "-" + file.name);
      const uploadTask = storageRef.put(file);
      uploadTask.on('state_changed', null, null, () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          firebase.database().ref("messages").push().set({
            username: username,
            content: messageContent,
            fileUrl: downloadURL,
            fileType: file.type
          });
          messageInput.value = "";
          fileInput.value = "";  // Reset file input
          sendAudio.play();
        });
      });
    } else if (messageContent !== "") {
      firebase.database().ref("messages").push().set({
        username: username,
        content: messageContent
      });
      messageInput.value = "";
      sendAudio.play();
    }
  });

  // Function to process spoilers within a message
  function processSpoilers(message) {
    return message.replace(/\|\|([^|]+)\|\|/g, '<span class="spoiler-text" onclick="revealSpoiler(this)">$1</span>');
  }
  
  // Function to process message content and embed links
  function processMessageContent(message) {
    // Regular expressions to detect different types of links
    const imageRegex = /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i;
    const videoRegex = /\.(mp4|webm|ogg|mov)$/i;
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
    
    // Replace image links with embedded images
    message = message.replace(imageRegex, '<img src="$&" class="embedded-image" />');
    
    // Replace video links with embedded videos
    message = message.replace(videoRegex, '<video src="$&" class="embedded-video" controls />');
    
    // Replace YouTube links with embedded YouTube videos
    message = message.replace(youtubeRegex, '<iframe width="560" height="315" src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>');
    
    return message;
  }

  firebase.database().ref("messages").on("child_added", function(snapshot) {
    var message = snapshot.val();
    var messageElement = document.createElement("div");
    messageElement.classList.add("message");

    var usernameElement = document.createElement("span");
    usernameElement.classList.add("message-username");
    usernameElement.innerText = message.username + ": ";
    messageElement.appendChild(usernameElement);

    var contentElement = document.createElement("span");
    contentElement.classList.add("message-content");
    contentElement.innerHTML = processSpoilers(processMessageContent(message.content));
    messageElement.appendChild(contentElement);

    if (message.fileUrl) {
      if (message.fileType.startsWith('image/')) {
        const imageElement = document.createElement('img');
        imageElement.src = message.fileUrl;
        imageElement.style.maxWidth = "200px"; 
        messageElement.appendChild(imageElement);
      } else if (message.fileType === 'application/pdf') {
        const fileLink = document.createElement('a');
        fileLink.href = message.fileUrl;
        fileLink.innerText = "View File";
        fileLink.target = "_blank";
        messageElement.appendChild(fileLink);
      } 
    }

    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    if (message.username !== username) {
        receiveAudio.play();
    }
  });

  usernameContainer.style.display = "flex";
});

// Function to reveal spoiler text
function revealSpoiler(element) {
    element.style.background = 'none';
    element.style.color = '#DCDDDE';
                                                }
