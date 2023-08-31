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
  document.querySelector('#email-display').style.display = 'none';
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
  document.querySelector('#email-display').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  
  // Show sent emails
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
        // Open the clicked email
        email.addEventListener('click', () => load_email(email.id, mailbox));
      }
    });
  }
  // Show emails received/archived
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

        // Open the clicked email
        email.addEventListener('click', () => load_email(email.id, mailbox));
      }
    });
  }
}


function load_email(email_id, mailbox) {

   // Show the email and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-display').style.display = 'block';
  document.querySelector('#email-display').innerHTML = '';

  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email => {
    const email_display = document.querySelector('#email-display');
    const email_info = document.createElement('div');
    const email_body = document.createElement('div');
    const subject = document.createElement('div'); subject.innerHTML = email.subject; subject.className = 'subject_email';
    const sender = document.createElement('div'); sender.innerHTML = `From: ${email.sender}`; sender.className = 'sender_email';
    const timestamp = document.createElement('div'); timestamp.innerHTML = `${email.timestamp}`; timestamp.className = 'timestamp_email';
    const body = document.createElement('div'); body.innerHTML = `${email.body}`; body.className = 'body_email';
    const recipient = document.createElement('div'); recipient.className = 'recipient_email'; recipient.innerHTML = 'To: ';
    const reply = document.createElement('button'); reply.className = 'btn btn-sm btn-outline-primary'; reply.id = 'reply'; reply.innerHTML = 'Reply';
    const archive = document.createElement('button'); archive.className = 'btn btn-sm btn-outline-primary';

    if (mailbox === 'sent') {
      archive.style.display = 'none';
    }
    if (email.archived) {
       archive.id = 'unarchive'; archive.innerHTML = 'Unarchive';
    }
    else {
      archive.id = 'archive'; archive.innerHTML = 'Archive';
    }

    reply.addEventListener('click', () => reply_email(email_id))

    archive.addEventListener('click', () => {
      if (archive.id === 'archive') {
        archive_email(email_id);
      }
      else {
        unarchive_email(email_id);
      }
    })

    for (let i in email.recipients) {
      recipient.append(email.recipients[i]);
    }
    email_info.append(subject); email_info.append(sender); email_info.append(recipient); email_info.append(timestamp); email_info.append(reply); email_info.append(archive);
    email_display.append(email_info); email_display.append(document.createElement('hr'));
    email_body.append(body); email_display.append(email_body);
  });

  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true
    })
  });
}

function archive_email(email_id) {
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: true
    })
  })
  .then(email => {
    
    load_mailbox('archive');
  });
}

function unarchive_email(email_id) {
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: false
    })
  })
  .then(email => {
    
    load_mailbox('inbox');
  })
}

function reply_email(email_id) {
  console.log('replied');
}