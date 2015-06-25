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
        this.postsCollection.fetch();
        console.log('Blog.Routes index function');
        alert("index route has been called..");
    },
    post: function(id) {
        if(this.postsCollection) {
            this.post = this.postsCollection.get(id);
            if() {}
        } else {
            this.requestedID = id;
            this.list();
        }
      console.log('Blog.Routes post function. This is post ', id);
      alert("post route has been called..");
    },
  });
  
  var blogRoutes = new Blog.Routes;
  
//  blogRoutes.on( 'post', function(post) {
//    alert('Get post number ' + post);
//  });
  
  Backbone.history.start();
    
  /*-----------------
  - MODELS
  -----------------*/
    
  // Individual Person model
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
  
  // Collection needs to refer to Model
  Blog.Collections.Posts = Backbone.Collection.extend({
    model: Blog.Models.Post,
    //url: 'http://dev.thelearningcollective.nyc/wp-json/posts'
    url: 'data/posts.json'
  });
 
  /*-----------------
  - VIEWS
  -----------------*/
  
  // List Item View
  Blog.Views.PostListItem = Backbone.View.extend({
    tagName: 'article',
    className: 'post',
    template: _.template( $('#postListItem').html() ),
    render: function() {
      this.$el.html( this.template( this.model.toJSON() ) );
      return this;
    },
    events: {
      //Should I use an event to link to the full post or should I just add to template
      'click a.post-link': 'getPost',
      'click a.post-author': 'getAuthor'
    },
    getPost: function(event) {
      //post.fetch();
      var postID = this.model.get("ID");
      alert('You clicked post ID ' + postID);
      //console.dir(event);
      var model = 
      
      // Should I instantiate Blog.Views.PostDetail for this item (model) and render it? Or, is that supposed to be managed through the router somehow? I'm confused.
//      var postDetailView = new Blog.Views.PostDetail({
//        model: post
//      });
//      $('#main').html( postDetailView.render().el )
//      this.$el.append( postDetailView.render().el );
    },
    // Handle author link at some point
    getAuthor: function(post) {
      //Strange syntax here
      var authorName = this.model.get("author").name;
      console.log(authorName);
    }
  });

 // List View
  Blog.Views.Posts = Backbone.View.extend({
    tagName: 'main',
    className: 'post-list',
    render: function() {
      this.collection.each(function(post) {
        var postListView = new Blog.Views.PostListItem({
          model: post
        });
        this.$el.append( postListView.render().el );
      // Adding this is an underscore helper that also you to specify the value of this. Eliminates the need for things like that = this
      }, this);
      return this;
    }
  });

  // Detail Item View
  Blog.Views.PostDetail = Backbone.View.extend({
    tagName: 'article',
    className: 'post',
    template: _.template( $('#postDetail').html() ),
    render: function() {
      this.$el.html( this.template( this.model.toJSON() ) );
      return this;
    }
  });
  

  /*-----------------
  - INSTANTIATIONS
  -----------------*/
  
  // Declare instance of Collection
  var postsCollection = new Blog.Collections.Posts({});
  
  // This fetch function doesn't work. 
  // http://stackoverflow.com/questions/20591083/backbone-populate-collection-from-external-json/20592207#20592207
  postsCollection.fetch({
    success: function(collection, response, options) {
      console.log('postsCollection.fetch success called. Success!! Yay!!');
      // Figure out best way to render
      $('#main').html( postsView.render().el );
    },
    error: function(collection, response, options) {
      console.log('oh no!');
      console.error('postsCollection.fetch error: ', options.errorThrown);
    }
  });
  
  // Declare instance of Blog.Views.People which refers to the instance of the Blog.Collection.People Collection  peopleCollection
  var postsView = new Blog.Views.Posts({
    collection: postsCollection
  });
  
  /*-----------------
  - RENDER
  -----------------*/
  
  //$('#container').append( postsView.render().el );
  // Not using `append` because I want to overwrite "Loading"
  //$('#container').html( postsView.render().el );

//End
})();