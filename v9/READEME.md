RESTFUL ROUTES

name        url      verb               desc.
===============================================================
INDEX     /dogs       GET        Display a list of all dogs
NEW       /dogs/new   GET        Displays form to make a new dog
GREATE    /dogs       POST       Add new dog to DB   
SHOW      /dogs/:id   GET        Shows info about one dog



REST(Representational state transfer) - a mapping between HTTP routes and CRUD

CREATE
READ        /allBlogs
UPDATE      /updateBlog/:id
DESTROY     /destroyBlog/:id
