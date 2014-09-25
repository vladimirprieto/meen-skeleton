var get = Ember.get, set = Ember.set;

Ember.PaginationMixin = Ember.Mixin.create({

  pages: function() {

    var availablePages = this.get('availablePages'),
    pages = [],
    page;

    for (i = 0; i < availablePages; i++) {
      page = i + 1;
      pages.push({ page_id: page.toString() });
    }

    return pages;

  }.property('availablePages'),

  currentPage: function() {

    return parseInt(this.get('selectedPage'), 10) || 1;

  }.property('selectedPage'),

  nextPage: function() {

    var nextPage = parseInt(this.get('currentPage')) + 1;

    if (nextPage > 0) 
        return nextPage;
    else
        return this.get('currentPage');

  }.property('currentPage'),

  prevPage: function() {

    var prevPage = this.get('currentPage') - 1;

    if (prevPage > 0) {
        return prevPage;
    }else{
        return this.get('currentPage');
    }

  }.property('currentPage'),

  availablePages: function() {
    return Math.ceil((this.store.metadataFor(this.get('model').type).total / this.get('itemsPerPage')) || 1);

  }.property('content.length'),

  paginatedContent: function() {

    var selectedPage = this.get('selectedPage') || 1;
    var upperBound = (selectedPage * this.get('itemsPerPage'));
    var lowerBound = (selectedPage * this.get('itemsPerPage')) - this.get('itemsPerPage');
    var models = this.get('content');

    return models.slice(lowerBound, upperBound);

  }.property('selectedPage', 'content.@each')

});

App.PeliculasController = Ember.ArrayController.extend(Ember.PaginationMixin, {        
    contentLoaded: false,     
    actions: {      
	    selectPage: function (number) {
          this.set('currentPage',number);
	        var limit = this.get('limit');
	        var self = this;
          if(number == 1) number = 0;

	        self.set('contentLoaded', false);

	        this.get('store').findQuery('pelicula',{limit : this.get('itemsPerPage'), offset: number*20 }).then(function (result) {          
	            self.set('model', result);
	            //self.set('contentLoaded', true);
	        });    
	    }
    }   
});

App.PeliculaController = Ember.ObjectController.extend({
	actions: {
		guardar: function(){
			this.get('model').save();
			this.set('editando', false);
			this.transitionToRoute('peliculas');
		},
		eliminar: function(){
			var pelicula = this.get('model');
			pelicula.destroyRecord();
			this.transitionToRoute('peliculas');
		},
    volver: function(){
      this.transitionToRoute('peliculas');
    }
	}
});

App.AgregarPeliculaController = Ember.ObjectController.extend({
	content: {},
	actions: {
		guardar: function(){
			var pelicula = this.store.createRecord('pelicula',{
				nombre : this.get('nombre'),
				pais : this.get('pais'),
				autor : this.get('autor'),
				director : this.get('director')
			});
			pelicula.save().then();

			this.transitionToRoute('peliculas');
		},
		cancelar: function(){
			this.transitionToRoute('peliculas');
		}
	}
});