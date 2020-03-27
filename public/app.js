// Initialize Firebase
const config = {
  apiKey: apiKey,
  authDomain: authDomain,
  databaseURL: databaseURL,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId
};
firebase.initializeApp(config);
const messageAppReference = firebase.database();
$(document).ready(function () {
  $('#message-form').submit(function (event) {
    // by default a form submit reloads the DOM which will subsequently reload all our JS
    // to avoid this we preventDefault()
    event.preventDefault()
    // grab user message input
    const message = $('#message').val()
    // clear message input (for UX purposes)
    $('#message').val('')
    // create a section for messages data in your db
    const messagesReference = messageAppReference.ref('messages');
    // use the set method to save data to the messages
    messagesReference.push({
      message: message,
      votes: 0
    })
  })
  // // on initialization of app (when document is ready) get fan messages
  messageClass.getFanMessages();
});
const messageClass = (function () {
  function getFanMessages() {
    // retrieve messages data when .on() initially executes
    // and when its data updates
    messageAppReference.ref('messages').on('value', function (results) {
      const $messageBoard = $('.message-board')
      const messages = []
      const allMessages = results.val();
      //console.log(allMessages);

      // iterate through results coming from database call; messages
      for (const msg in allMessages) {
        // get method is supposed to represent HTTP GET method
        const message = allMessages[msg].message
        let votes = allMessages[msg].votes
        // create message element
        const $messageListElement = $('<li></li>')
        // create delete element
        const $deleteElement = $('<i class="fa fa-trash pull-right delete"></i>')
        $deleteElement.on('click', function (e) {
          const id = $(e.target.parentNode).data('id')
          deleteMessage(id)
        })


        // create up vote element
        const $upVoteElement = $('<i class="fa fa-thumbs-up pull-right"></i>');
        $upVoteElement.on('click', function (e) {
          const id = $(e.target.parentNode).data('id');
          console.log($upVoteElement);
          updateMessage(id, ++votes);
        });


        // create down vote element
        const $downVoteElement = $('<i class="fa fa-thumbs-down pull-right"></i>')
        $downVoteElement.on('click', function (e) {
          const id = $(e.target.parentNode).data('id')
          //console.log(id);
          updateMessage(id, --votes)
        })
        // add id as data attribute so we can refer to later for updating
        $messageListElement.attr('data-id', msg)
        // add message to li
        $messageListElement.html(message)
        // add delete element
        $messageListElement.append($deleteElement)
        // add voting elements
        $messageListElement.append($upVoteElement)
        $messageListElement.append($downVoteElement)
        // show votes
        $messageListElement.append('<div class="pull-right">' + votes + '</div>')
        // push element to array of messages
        messages.push($messageListElement)
        // remove lis to avoid dupes
        $messageBoard.empty()
        for (let i in messages) {
          $messageBoard.append(messages[i])
        }
      }
    })
  }
  function updateMessage(id, votes) {
    // find message whose objectId is equal to the id we're searching with
    const messageReference = messageAppReference.ref('messages/' + id)
    // update votes property
    messageReference.update({
      votes: votes
    })
  }
  function deleteMessage(id) {
    // find message whose objectId is equal to the id we're searching with
    const messageReference = messageAppReference.ref('messages/' + id)
    messageReference.remove()
  }
  return {
    getFanMessages: getFanMessages
  }
})();
