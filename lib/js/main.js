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
      'posts/:post': 'post'
    },
    index: function() {
      console.log('index router function');
      //$(document.body).append("Index route has been called..");
    },
    post: function() {
      console.log('post router function');
    }
  });
  
  new Blog.Routes;
  Backbone.history.start();
    
  /*-----------------
  - MODELS
  -----------------*/
    
  // Individual Person model
  Blog.Models.Post = Backbone.Model.extend({
    defaults: {
      title: null,
      author: null,
      date: null,
      link: null,
      content: null,
      excerpt: null,
      featured_image: null,
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
    url: 'http://dev.thelearningcollective.nyc/wp-json/posts'
    //url: 'data/posts.json'
  });
 
  /*-----------------
  - VIEWS
  -----------------*/
  
  // Item View
  Blog.Views.Post = Backbone.View.extend({
    tagName: 'article',
    className: 'post',
    template: _.template( $('#postTemplate').html() ),
    render: function() {
      this.$el.html( this.template( this.model.toJSON() ) );
      return this;
    },
    events: {
      'click .post-title': 'showAlert',
    },
    showAlert: function() {
      alert('You clicked the title');
    }
  });

 // List View
  Blog.Views.Posts = Backbone.View.extend({
    tagName: 'main',
    className: 'post-list',
    render: function() {
      this.collection.each(function(post) {
        var postView = new Blog.Views.Post({
          model: post
        });
        this.$el.append( postView.render().el );
      // Adding this is an underscore helper that also you to specify the value of this. Eliminates the need for things like that = this
      }, this);
      return this;
    }
  });
  
  /*-----------------
  - INSTANTIATIONS
  -----------------*/
  
  // Declare instance of Collection
  // Array of objects
  // This manual array of objects renders as expected
 
  // When trying to load from an external file, it doesn't render :(
  var postsCollection = new Blog.Collections.Posts({});
  
  // This fetch function doesn't work. 
  // http://stackoverflow.com/questions/20591083/backbone-populate-collection-from-external-json/20592207#20592207
  postsCollection.fetch({
    success: function(collection, response, options) {
      console.log('Success!! Yay!!');
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