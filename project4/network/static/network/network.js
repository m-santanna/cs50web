document.addEventListener('DOMContentLoaded', function() {

    document.querySelector('#create_posts_display').style.display = 'none';
    document.querySelector('#posts_display').style.display = 'none';
    document.querySelector('#user_display').style.display = 'none';

    document.querySelector('#following_posts_link').addEventListener('click', () => loadPosts('following'));
    document.querySelector('#all_posts_link').addEventListener('click', () => loadPosts('all_posts'));
    document.querySelector('#create_posts_link').addEventListener('click', createPosts);

    const username = document.querySelector('#user_link_username').innerHTML;
    document.querySelector('#user_link').addEventListener('click', () => userProfile(username));

    loadPosts('all_posts');
})

function loadPosts(group) {

    document.querySelector('#create_posts_display').style.display = 'none';
    document.querySelector('#posts_display').style.display = 'block';
    document.querySelector('#user_display').style.display = 'none';
    
    document.querySelector('#posts_display').innerHTML = '';
    
    fetch(`/posts/${group}`)
    .then(response => response.json())
    .then(posts => {

        // If the user doesn't follow anyone
        if (posts['error']) {
            const message = document.createElement('div');
            message.innerHTML = 'Not following anyone yet!'; message.className = 'error_message';
            document.querySelector('#posts_display').append(message);
        }
        else {

            // In case the users followed didn't post anything
            if (posts.length === 0) {
                const message = document.createElement('div');
                message.innerHTML = "The users you follow haven't posted anything yet!"; message.className = 'error_message';
                document.querySelector('#posts_display').append(message);
            }
            
            // Rendering the posts
            for (let i of Object.keys(posts)) {
                const post = document.createElement('div');
                post.id = posts[i].id;
                
                const owner = document.createElement('button'); owner.innerHTML = posts[i].owner; owner.className = 'post_owner';
                const text = document.createElement('div'); text.innerHTML = posts[i].text; text.className = 'post_text';
                const timestamp = document.createElement('div'); timestamp.innerHTML = posts[i].timestamp; timestamp.className = 'post_timestamp';

                owner.addEventListener('click', () => userProfile(owner.innerHTML));

                post.append(owner); post.append(text); post.append(timestamp);
                document.querySelector('#posts_display').append(post); 
            }
        }
    })
}

function createPosts() {
    
    document.querySelector('#user_display').style.display = 'none';
    document.querySelector('#create_posts_display').style.display = 'block';
    document.querySelector('#posts_display').style.display = 'none';
    
    document.querySelector('#new_post_textarea').value = '';
}


function userProfile(username) {
    document.querySelector('#user_display').style.display = 'block';
    document.querySelector('#create_posts_display').style.display = 'none';
    document.querySelector('#posts_display').style.display = 'none';
    
    document.querySelector('#user_display').innerHTML = '';
    
    fetch(`/users/${username}`)
    .then(response => response.json())
    .then(data => {
        posts = data[0]; followers = data[1]; following = data[2]; own_profile = data[3];
        
        // If going to own profile
        if (own_profile) {
            
            const user_followers = document.createElement('div'); user_followers.innerHTML = `Followers: ${followers.length}`;
            const user_following = document.createElement('div'); user_following.innerHTML = `Following: ${following.length}`;
            document.querySelector('#user_display').append(user_followers); document.querySelector('#user_display').append(user_following);
            
            // If there are no posts from the user yet
            if (posts.length === 0) {
                console.log(posts);
                const message = document.createElement('div');
                message.innerHTML = "You didn't post anything yet!"; message.className = 'error_message';
                document.querySelector('#user_display').append(message);
                
            }
            else {
                for (let i in posts) {
                    const post = document.createElement('div');
                    post.id = posts[i]['id'];
                    
                    const owner = document.createElement('div'); owner.innerHTML = posts[i]['owner']; owner.className = 'post_owner';
                    const text = document.createElement('div'); text.innerHTML = posts[i]['text']; text.className = 'post_text';
                    const timestamp = document.createElement('div'); timestamp.innerHTML = posts[i]['timestamp']; timestamp.className = 'post_timestamp';
                    post.append(owner); post.append(text); post.append(timestamp);
                    document.querySelector('#user_display').append(post);
                }
            }
            
        }
        else {
            
            const user_followers = document.createElement('div'); user_followers.innerHTML = `Followers: ${followers.length}`;
            const user_following = document.createElement('div'); user_following.innerHTML = `Following: ${following.length}`;
            document.querySelector('#user_display').append(user_followers); document.querySelector('#user_display').append(user_following);
            
            // If there are no posts from the user yet
            if (posts.length === 0) {
                const message = document.createElement('div');
                message.innerHTML = "This user didn't post anything yet!"; message.className = 'error_message';
                document.querySelector('#user_display').append(message);
            }
            else {
                for (let i in posts) {
                    const post = document.createElement('div');
                    post.id = posts[i]['id'];
                    
                    const owner = document.createElement('div'); owner.innerHTML = posts[i]['owner']; owner.className = 'post_owner';
                    const text = document.createElement('div'); text.innerHTML = posts[i]['text']; text.className = 'post_text';
                    const timestamp = document.createElement('div'); timestamp.innerHTML = posts[i]['timestamp']; timestamp.className = 'post_timestamp';
                    post.append(owner); post.append(text); post.append(timestamp);
                    document.querySelector('#user_display').append(post);
                }
            }
        }
    })
}
