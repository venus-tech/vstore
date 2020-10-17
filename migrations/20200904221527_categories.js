
exports.up = function(knex) {
  return knex.schema.createTableIfNotExists('categories', function(table){
    table.increments();
    table.string('name');
    table.text('description');
    table.timestamps();
  });
};

exports.down = function(knex) {
  
};
