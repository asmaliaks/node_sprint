var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

var insertDocuments = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    // Insert some documents
    collection.insert([
        {login : 'alex', pass: '5233'}, {login : 'mike', pass: '1111'}, {login : 'sam', pass: '2222'}
    ], function(err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents into the document collection");
        callback(result);
    });
};

var removeDocument = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    // Insert some documents
    collection.remove({ a : 3 }, function(err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("Removed the document with the field a equal to 3");
        callback(result);
    });
};

var updateDocument = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');

    // Update document where a is 2, set b equal to 1
    collection.update({ a : 2 }
        , { $set: { b : 1 } }, function(err, result) {
            assert.equal(err, null);
            assert.equal(1, result.result.n);
            console.log("Updated the document with the field a equal to 2");
            callback(result);
        });
}

var findDocuments = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    // Find some documents
    collection.find({}).toArray(function(err, docs) {
        assert.equal(err, null);
        //assert.equal(3, docs.length);
        console.log("Found the following records");
        console.dir(docs);
        callback(docs);
    });
};

// Connection URL 
var url = 'mongodb://localhost:27017/catalog';
// Use connect method to connect to the Server 
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('users');
    //collection.remove();
    //insertDocuments(db, function() {

        //updateDocument(db, function() {
        //
            findDocuments(db, function() {

                //removeDocument(db, function() {

                db.close();
                //});
            });
        //});
    //});

});



