(function() {
  
    // Establish Namespaces
    window.Blog = {
        Models: {},
        Collections: {},
        Views: {},
        Routes: {}
    }

    // Template helper
    window.template = function(id) {
        return _.template( $('#' + id).html() );
    }
    
    // Based on example found here: https://github.com/misfist/backbone-cellar/blob/master/tutorial/part3/js/main.js
    
    /*-----------------
    - MODELS
    -----------------*/

    // Individual Post model
    Blog.Models.Post = Backbone.Model.extend({
        defaults: {
            title: '',
            author: '',
            date: '',
            link: '',
            content: '',
            excerpt: '',
            featured_image: '',
            status: 'publish',
            type: 'post'
        },
        idAttribute: 'ID'
    });
  
    /*-----------------
    - COLLECTIONS
    -----------------*/

    // Collection of Post models
    Blog.Collections.Posts = Backbone.Collection.extend({
        model: Blog.Models.Post,
        //url: 'http://dev.thelearningcollective.nyc/wp-json/posts'
        url: 'data/posts.json'
    });
 
    /*-----------------
    - VIEWS
    -----------------*/

    // List View
    Blog.Views.Posts = Backbone.View.extend({
//        tagName: 'ul',
//        className: 'post-list',
        
        initialize: function() {
            
            console.log( 'Called initialize in Blog.Views.Posts' );
            
            this.model.bind('reset', this.render, this);
            var self = this;
            this.model.bind('add', function(post) {
                
                console.log( 'Called this.model.bind in Blog.Views.Posts initialize' );
                
                $(self.el).append( new Blog.Views.PostListItem({
                    model: post
                }).render().el );
                
            });
        },
        
        render: function(event) {
            
            console.log( 'Called render in Blog.Views.Posts' );
            
            _.each(this.model.models, function(post) {
                console.log(this.el);
                $(this.el).append( new Blog.Views.PostListItem({
                    model: post
                }).render().el );
            }, this);
            return this;
        },

    }); 
    
    
    
    // List Item View
    Blog.Views.PostListItem = Backbone.View.extend({
        tagName: 'article',
        className: 'post',
        template: _.template( $('#postListItem').html() ),
        
        initialize: function() {
            
            console.log( 'Called initialize in Blog.Views.PostListItem' );
            
            this.model.bind( 'sync', this.render, this );
            this.model.bind( 'destroy', this.close, this );
        },
        
        render: function(event) {
            
            console.log( 'Called render in Blog.Views.PostListItem' );
            
            $(this.el).html( this.template( this.model.toJSON() ) );
            return this;
        },
        
        close: function() {
            
            console.log( 'Called close in Blog.Views.PostListItem' );
            
            this.el.unbind();
            this.el.remove();
        }
//        events: {
//            //Should I use an event to link to the full post or should I just add to template
//            'click a.post-link': 'getPost',
//            'click a.post-author': 'getAuthor'
//        },
//        getPost: function(event) {
//            //post.fetch();
//            var postID = this.model.get("ID");
//            alert('You clicked post ID ' + postID);
//            console.dir(event);
//        },
//        // Handle author link at some point
//        getAuthor: function(post) {
//            //Strange syntax here
//            var authorName = this.model.get("author").name;
//            console.log(authorName);
//        }
    });
    
   
  
    // Single Post View
    Blog.Views.PostDetail = Backbone.View.extend({
        tagName: 'article',
        className: 'post',
        template: _.template( $('#postDetail').html() ),
        
        initialize: function() {
            this.model.bind('change', this.render, this);
        },
        
        render: function(event) {
            this.$el.html( this.template( this.model.toJSON() ) );
            return this;
        }
    });
  

  /*-----------------
  - INSTANTIATIONS
  -----------------*/
  
 
  /*-----------------
  - RENDER
  -----------------*/
      
    
  /*-----------------
  - ROUTERS
  -----------------*/
  
  Blog.Routes = Backbone.Router.extend({
    routes: {
      '': 'index',
      'posts/:id': 'post',
    },
    index: function() {
        //var postsCollection = new Blog.Collections.Posts({});
        this.postsCollection = new Blog.Collections.Posts();
        var self = this;
        this.postsCollection.fetch({
            success: function(collection, response, options) {
                console.log('this.postsCollection.fetch success called from index route. Success!! Yay!!');
                self.postsList = new Blog.Views.Posts({
                    model: self.postsCollection
                });
                $('#main').html( self.postsList.render().el );
//                
                if (self.requestedId) { 
                    self.post(self.requestedId);
                }
            }
        });
        console.log('Blog.Routes index function');
        console.log("index route has been called..");
    },
    post: function(id) {
        console.log(id);
        if(this.postsCollection) {
            this.post = this.postsCollection.get(id);
            if(this.postView) {
                this.postView.close();
            }
            this.postView = new Blog.Views.PostDetail({
                model: this.post
            });
            $('#main').html( this.postView.render().el );
        } else {
            this.requestedID = id;
            this.list();
        }
        console.log('Blog.Routes post function. This is post ', id);
        console.log("post route has been called..");
    },
  });
    
//    success: function(collection, response, options) {
//      console.log('postsCollection.fetch success called. Success!! Yay!!');
//      // Figure out best way to render
//      $('#main').html( postsView.render().el );
//    },
//    error: function(collection, response, options) {
//      console.log('oh no!');
//      console.error('postsCollection.fetch error: ', options.errorThrown);
//    }
  
  var blogRoutes = new Blog.Routes;
  
//  blogRoutes.on( 'post', function(post) {
//    alert('Get post number ' + post);
//  });
  
  Backbone.history.start();

//End
})();