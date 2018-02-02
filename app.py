from pymongo import MongoClient
import pprint

client = MongoClient()
client = MongoClient("mongodb://test:test@ds221258.mlab.com:21258/hikar")

db = client.hikar

maps = db.maps

for map in maps.find():
	pprint.pprint(map)