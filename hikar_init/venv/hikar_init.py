from pymongo import MongoClient


uri = "mongodb://hikar_db:hikar@ds221258.mlab.com:21258/hikar"
client = MongoClient(uri)
db = client['hikar_db']
maps = db.maps

maps.insert({
    "hello": "world"
})
print db.maps.find()
