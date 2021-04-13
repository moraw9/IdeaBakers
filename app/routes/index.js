export default Ember.Route.extend({
    model: function() {
      return{
      title: 'Grand Old Mansion',
      user: 'Veruca Salt',
      description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. At ducimus consectetur tenetur impedit accusamus aut commodi omnis, nulla similique vel.',
      numberOfKudos: 14,
      imageURL: 'https://ksr-ugc.imgix.net/assets/032/801/830/240a13bc4ad329b1e30e806f6d0d0d19_original.jpg?ixlib=rb-2.1.0&w=680&fit=max&v=1616163012&auto=format&frame=1&q=92&s=51e61d92aa13c2e4b9502d7e06baf37f',
    };
      
  }
});