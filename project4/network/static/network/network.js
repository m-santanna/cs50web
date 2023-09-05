document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#following_posts_link').addEventListener('click', () => loadPosts('following'));
    document.querySelector('#all_posts_link').addEventListener('click', () => loadPosts('all_posts'));
    document.querySelector('#create_posts_link').addEventListener('click', createPosts);
    loadPosts('all_posts');
})

function loadPosts(group) {

    document.querySelector('#create_posts_display').style.display = 'none';
    document.querySelector('#posts_display').style.display = 'block';
    
    document.querySelector('#posts_display').innerHTML = '';
    
    fetch(`/posts/${group}`)
    .then(response => response.json())
    .then(posts => {
        console.log(posts);
        
        for (let i of Object.keys(posts)) {
            const post = document.createElement('div');
            post.id = posts[i].id;
            
            const owner = document.createElement('div'); owner.innerHTML = posts[i].owner; owner.className = 'post_owner';
            const text = document.createElement('div'); text.innerHTML = posts[i].text; text.className = 'post_text';
            const timestamp = document.createElement('div'); timestamp.innerHTML = posts[i].timestamp; timestamp.className = 'post_timestamp';
            post.append(owner); post.append(text); post.append(timestamp);
            document.querySelector('#posts_display').append(post);
            
        }
    })
}

function createPosts() {
    document.querySelector('#create_posts_display').style.display = 'block';
    document.querySelector('#posts_display').style.display = 'none';
    
}
