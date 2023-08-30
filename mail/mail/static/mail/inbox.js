document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  document.querySelector('#compose-form').onsubmit = compose_submit;
  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

}

// function responsible for dealing with submitting emails
function compose_submit() {
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value
      })
    })
    .then(response => response.json())
    .then(result => {
      load_mailbox('sent');
    });
    return false;
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  
  // Show each email tab
  if (mailbox === 'sent') {
    const view_div = document.querySelector('#emails-view');
    fetch(`/emails/sent`)
    .then(response => response.json())
    .then(emails => {
      for (let i of Object.keys(emails)) {
        const email = document.createElement('div');
        email.id = emails[i].id;
        email.className = 'email_sent';
        console.log(emails[i])
        
        for (const receiver in emails[i].recipients) {
          const recipient = document.createElement('div'); recipient.innerHTML = `To: ${emails[i].recipients[receiver]}`; recipient.className = 'recipients_mailbox';
          const subject = document.createElement('div'); subject.innerHTML = emails[i].subject; subject.className = 'subject_mailbox';
          const timestamp = document.createElement('div'); timestamp.innerHTML = emails[i].timestamp; timestamp.className = 'timestamp_mailbox';
          email.append(recipient); email.append(subject); email.append(timestamp);
          view_div.append(email);
        }

      }
    });
  }
  else {
    const view_div = document.querySelector('#emails-view');
    fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      for (let i of Object.keys(emails)) {
        const email = document.createElement('div');
        email.id = emails[i].id;
        if (emails[i].read) {
          email.className = 'email_read';
        }
        else {
          email.className = 'email_not_read';
        }
        const sender = document.createElement('div'); sender.innerHTML = emails[i].sender; sender.className = 'sender_mailbox';
        const subject = document.createElement('div'); subject.innerHTML = emails[i].subject; subject.className = 'subject_mailbox';
        const timestamp = document.createElement('div'); timestamp.innerHTML = emails[i].timestamp; timestamp.className = 'timestamp_mailbox';
        email.append(sender); email.append(subject); email.append(timestamp);
        view_div.append(email);
      }
    });
  }
}
