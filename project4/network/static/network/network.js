document.addEventListener('DOMContentLoaded', function() {
    
    document.querySelector('#create_posts_display').style.display = 'none';
    document.querySelector('#edit_posts_display').style.display = 'none';
    document.querySelector('#posts_display').style.display = 'none';
    document.querySelector('#user_display').style.display = 'none';
    
    document.querySelector('#following_posts_link').addEventListener('click', () => loadPosts('following'));
    document.querySelector('#all_posts_link').addEventListener('click', () => loadPosts('all_posts'));
    document.querySelector('#create_posts_link').addEventListener('click', createPosts);
    
    const user_username = document.querySelector('#user_link_username').innerHTML;
    document.querySelector('#user_link').addEventListener('click', () => userProfile(user_username));
    
    loadPosts('all_posts');
})


function loadPosts(group) {
    
    document.querySelector('#create_posts_display').style.display = 'none';
    document.querySelector('#edit_posts_display').style.display = 'none';
    document.querySelector('#posts_display').style.display = 'block';
    document.querySelector('#user_display').style.display = 'none';
    
    document.querySelector('#posts_display').innerHTML = '';
    
    if (group === 'all_posts') {

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
                
                // In case the followed users didn't post anything
                if (posts.length === 0) {
                    const message = document.createElement('div');
                    message.innerHTML = "The users you follow haven't posted anything yet!"; message.className = 'error_message';
                    document.querySelector('#posts_display').append(message);
                }
                
                // Rendering the posts
                const user_username = document.querySelector('#user_link_username').innerHTML;

                for (let i of Object.keys(posts)) {
                    const post = document.createElement('div');
                    post.id = posts[i].id;
                    
                    const owner = document.createElement('button'); owner.innerHTML = posts[i].owner; owner.className = `post_owner`;
                    const text = document.createElement('div'); text.innerHTML = posts[i].text; text.className = `post_text`;
                    const timestamp = document.createElement('div'); timestamp.innerHTML = posts[i].timestamp; timestamp.className = `post_timestamp`;
                    
                    const like_count = document.createElement('div'); like_count.innerHTML = `Likes: ${posts[i]['likes'].length}`; like_count.className = `post_like_count`;
                    const like_unlike_btn = document.createElement('button'); like_unlike_btn.id = 'like_btn'; like_unlike_btn.innerHTML = 'Like'; like_unlike_btn.className = 'button-55';
                    
                    for (let j in posts[i]['likes']) {
                        if (user_username === posts[i]['likes'][j]) {
                            like_unlike_btn.id = 'unlike_btn';
                            like_unlike_btn.innerHTML = 'Unlike';
                        }
                    }
                    
                    like_unlike_btn.addEventListener('click', () => {
                        if (like_unlike_btn.id === 'like_btn') {
                            likePostAllPosts(post.id);
                        }
                        else {
                            unlikePostAllPosts(post.id);
                        }
                    })

                    const edit_btn = document.createElement('button'); edit_btn.className = 'edit_post_btn'; edit_btn.style.display = 'none'; edit_btn.innerHTML = 'Edit';
                    const line_br = document.createElement('hr');

                    if (owner.innerHTML === user_username) {
                        edit_btn.style.display = 'block';
                    }
                    edit_btn.addEventListener('click', () => editPost(post.id));
                    owner.addEventListener('click', () => userProfile(owner.innerHTML));

                    post.append(owner); post.append(text); post.append(like_count); post.append(like_unlike_btn); post.append(edit_btn); post.append(timestamp); post.append(line_br);
                    document.querySelector('#posts_display').append(post); 
                }
            }
        })
    }

    else {
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
                
                // In case the followed users didn't post anything
                if (posts.length === 0) {
                    const message = document.createElement('div');
                    message.innerHTML = "The users you follow haven't posted anything yet!"; message.className = 'error_message';
                    document.querySelector('#posts_display').append(message);
                }
                
                // Rendering the posts
                const user_username = document.querySelector('#user_link_username').innerHTML;

                for (let i of Object.keys(posts)) {
                    const post = document.createElement('div');
                    post.id = posts[i].id;
                    
                    const owner = document.createElement('button'); owner.innerHTML = posts[i].owner; owner.className = `post_owner`;
                    const text = document.createElement('div'); text.innerHTML = posts[i].text; text.className = `post_text`;
                    const timestamp = document.createElement('div'); timestamp.innerHTML = posts[i].timestamp; timestamp.className = `post_timestamp`;
                    
                    const like_count = document.createElement('div'); like_count.innerHTML = `Likes: ${posts[i]['likes'].length}`; like_count.className = `post_like_count`;
                    const like_unlike_btn = document.createElement('button'); like_unlike_btn.id = 'like_btn'; like_unlike_btn.innerHTML = 'Like'; like_unlike_btn.className = 'button-55';
                    
                    for (let j in posts[i]['likes']) {
                        if (user_username === posts[i]['likes'][j]) {
                            like_unlike_btn.id = 'unlike_btn';
                            like_unlike_btn.innerHTML = 'Unlike';
                        }
                    }
                    
                    like_unlike_btn.addEventListener('click', () => {
                        if (like_unlike_btn.id === 'like_btn') {
                            likePostFollowing(post.id);
                        }
                        else {
                            unlikePostFollowing(post.id);
                        }
                    })

                    const edit_btn = document.createElement('button'); edit_btn.className = 'edit_post_btn'; edit_btn.style.display = 'none'; edit_btn.innerHTML = 'Edit';
                    const line_br = document.createElement('hr');

                    if (owner.innerHTML === user_username) {
                        edit_btn.style.display = 'block';
                    }
                    edit_btn.addEventListener('click', () => editPost(post.id));
                    owner.addEventListener('click', () => userProfile(owner.innerHTML));

                    post.append(owner); post.append(text); post.append(like_count); post.append(like_unlike_btn); post.append(edit_btn); post.append(timestamp); post.append(line_br);
                    document.querySelector('#posts_display').append(post); 
                }
            }
        })
    }
}


function userProfile(username) {
    
    const user_username = document.querySelector('#user_link_username').innerHTML;
    document.querySelector('#user_display').style.display = 'block';
    document.querySelector('#create_posts_display').style.display = 'none';
    document.querySelector('#edit_posts_display').style.display = 'none';
    document.querySelector('#posts_display').style.display = 'none';
    
    document.querySelector('#user_display').innerHTML = '';
    
    fetch(`/users/${username}`)
    .then(response => response.json())
    .then(data => {
        const posts = data[0]; const followers = data[1]; const following = data[2]; const own_profile = data[3];
        
        // If going to own profile 
        if (own_profile) {
            
            const user_followers = document.createElement('div'); user_followers.innerHTML = `Followers: ${followers.length}`;
            const user_following = document.createElement('div'); user_following.innerHTML = `Following: ${following.length}`;
            const line_br_follow_info = document.createElement('hr');

            document.querySelector('#user_display').append(user_followers); document.querySelector('#user_display').append(user_following); document.querySelector('#user_display').append(line_br_follow_info); 
            
            // If there are no posts from the user yet
            if (posts.length === 0) {     
                const message = document.createElement('div');
                message.innerHTML = "You didn't post anything yet!"; message.className = 'error_message';
                document.querySelector('#user_display').append(message);      
            }
            else {
                for (let i in posts) {
                    const post = document.createElement('div');
                    post.id = posts[i]['id'];

                    const owner = document.createElement('div'); owner.innerHTML = posts[i]['owner']; owner.className = `post_owner_div`;
                    const text = document.createElement('div'); text.innerHTML = posts[i]['text']; text.className = `post_text`;
                    const timestamp = document.createElement('div'); timestamp.innerHTML = posts[i]['timestamp']; timestamp.className = `post_timestamp`;
                    const edit_btn = document.createElement('button'); edit_btn.className = 'edit_post_btn'; edit_btn.style.display = 'block'; edit_btn.innerHTML = 'Edit';
                    const like_count = document.createElement('div'); like_count.innerHTML = `Likes: ${posts[i]['likes'].length}`; like_count.className = `post_like_count`;
                    const like_unlike_btn = document.createElement('button'); like_unlike_btn.id = 'like_btn'; like_unlike_btn.className = 'button-55'; like_unlike_btn.innerHTML = 'Like';
                    
                    for (let j in posts[i]['likes']) {
                        if (user_username === posts[i]['likes'][j]) {
                            like_unlike_btn.id = 'unlike_btn';
                            like_unlike_btn.innerHTML = 'Unlike';
                        }
                    }

                    like_unlike_btn.addEventListener('click', () => {
                        if (like_unlike_btn.id === 'like_btn') {
                            likePostUserProfile(post.id, username);
                        }
                        else {
                            unlikePostUserProfile(post.id, username);
                        }
                    })
                    edit_btn.addEventListener('click', () => editPost(post.id));
                    const line_br = document.createElement('hr');

                    post.append(owner); post.append(text); post.append(like_count); post.append(like_unlike_btn); post.append(edit_btn); post.append(timestamp); post.append(line_br);
                    document.querySelector('#user_display').append(post);
                }
            }    
        }
        else {
            
            const user_followers = document.createElement('div'); user_followers.innerHTML = `Followers: ${followers.length}`;
            const user_following = document.createElement('div'); user_following.innerHTML = `Following: ${following.length}`;
            
            document.querySelector('#user_display').append(user_followers); document.querySelector('#user_display').append(user_following); 
            
            const follow_unfollow_btn = document.createElement('button'); follow_unfollow_btn.className = 'button-55';
            follow_unfollow_btn.id = 'follow_btn';
            follow_unfollow_btn.innerHTML = 'Follow';
            
            for (let i in followers) {
                if (user_username === followers[i]['follower']) {
                    follow_unfollow_btn.id = 'unfollow_btn';
                    follow_unfollow_btn.innerHTML = 'Unfollow';
                }
            }
            
            follow_unfollow_btn.addEventListener('click', () => {
                if (follow_unfollow_btn.id === 'follow_btn') {
                    follow(username);
                }
                else {
                    unfollow(username);
                }
            })

            const line_br_follow_info = document.createElement('hr');
            document.querySelector('#user_display').append(follow_unfollow_btn);
            document.querySelector('#user_display').append(line_br_follow_info); 
            
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
                    
                    const owner = document.createElement('div'); owner.innerHTML = posts[i]['owner']; owner.className = `post_owner_div`;
                    const text = document.createElement('div'); text.innerHTML = posts[i]['text']; text.className = `post_text`;
                    const timestamp = document.createElement('div'); timestamp.innerHTML = posts[i]['timestamp']; timestamp.className = `post_timestamp`;
                    const like_count = document.createElement('div'); like_count.innerHTML = `Likes: ${posts[i]['likes'].length}`; like_count.className = `post_like_count`;
                    const like_unlike_btn = document.createElement('button'); like_unlike_btn.id = 'like_btn'; like_unlike_btn.className = 'button-55'; like_unlike_btn.innerHTML = 'Like';
                    const line_br = document.createElement('hr');

                    for (let j in posts[i]['likes']) {
                        if (user_username === posts[i]['likes'][j]) {
                            like_unlike_btn.id = 'unlike_btn';
                            like_unlike_btn.innerHTML = 'Unlike';
                        }
                    }
                    
                    like_unlike_btn.addEventListener('click', () => {
                        if (like_unlike_btn.id === 'like_btn') {
                            likePostUserProfile(post.id, username);
                        }
                        else {
                            unlikePostUserProfile(post.id, username);
                        }
                    })
                    
                    post.append(owner); post.append(text); post.append(like_count); post.append(like_unlike_btn); post.append(timestamp); post.append(line_br);
                    document.querySelector('#user_display').append(post);
                }
            }
        }
    })
}


function createPosts() {
    
    document.querySelector('#user_display').style.display = 'none';
    document.querySelector('#create_posts_display').style.display = 'block';
    document.querySelector('#edit_posts_display').style.display = 'none';
    document.querySelector('#posts_display').style.display = 'none';
    
    document.querySelector('#new_post_textarea').value = '';
}
function follow(username) {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    fetch(`/follow/${username}`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken,
        },
    })
    .then(user => {
        userProfile(username);
    });
}
function unfollow(username) {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    fetch(`/unfollow/${username}`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken,
        },
    })
    .then(user => {
        userProfile(username);
    })
}
function editPost(postID) {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    document.querySelector('#user_display').style.display = 'none';
    document.querySelector('#create_posts_display').style.display = 'none';
    document.querySelector('#edit_posts_display').style.display = 'block';
    document.querySelector('#posts_display').style.display = 'none';

    document.querySelector('#edit_post_textarea').value = document.querySelector(`.post${postID}_text`).innerHTML;
    document.querySelector('#edit_post_submit').addEventListener('click', () => {
        fetch(`edit/${postID}`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({
                'text': document.querySelector('#edit_post_textarea').value,
            })
        })
        .then(response => {
            loadPosts('all_posts');
        })
    })
}
function likePostAllPosts(postID) {
    console.log('liked');
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    fetch(`/like/${postID}`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken,
        },
    })
    .then(response => {
        loadPosts('all_posts');
    });
}
function unlikePostAllPosts(postID) {
    console.log('unliked');
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    fetch(`/unlike/${postID}`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken,
        },
    })
    .then(response => {
        loadPosts('all_posts');
    });
}
function likePostFollowing(postID) {
    console.log('liked');
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    fetch(`/like/${postID}`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken,
        },
    })
    .then(response => {
        loadPosts('following');
    });
}
function unlikePostFollowing(postID) {
    console.log('unliked');
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    fetch(`/unlike/${postID}`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken,
        },
    })
    .then(response => {
        loadPosts('following');
    });

}
function likePostUserProfile(postID, username) {
    console.log('liked');
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    fetch(`/like/${postID}`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken,
        },
    })
    .then(response => {
        userProfile(username);
    });
}
function unlikePostUserProfile(postID, username) {
    console.log('liked');
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    fetch(`/unlike/${postID}`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken,
        },
    })
    .then(response => {
        userProfile(username);
    });
}