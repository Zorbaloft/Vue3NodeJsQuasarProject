import { defineStore, acceptHMRUpdate } from 'pinia'

export const usePostsStore = defineStore('posts', {
  state: () => ({
    posts: [  
        {
            id: 1 ,
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,.",
            user:'Alex',
            time:'2h',
            usertag:'@alex'
        },
        {
            id: 2 ,
            content: "shorter.",
            user:'Geralt',
            time:'3h',
            usertag:'@alex'
        }
    ]
    }),

    actions: {
        addPost(post){
            this.posts.unshift(post)
        },
        deletePost(id){
            this.posts = this.posts.filter(post => post.id !== id)
        }
      }

  })


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePostsStore, import.meta.hot))
}
