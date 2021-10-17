from sys import platform
from flask import Flask
from elasticsearch import Elasticsearch
from flask.wrappers import Request

es_client = Elasticsearch("http://node-2.hska.io:9200")
app = Flask(__name__)

def buildQuery():
    query = {
        "match":{
            "Name": 'Mario Kart Wii'
        }
    }
    return query

@app.route('/')
def index():
    result = es_client.info()
    return result
    
@app.route('/getPlatformTags', methods=['GET'])
def getPlatTags():
    return "PlatformTags"

@app.route('/getGenreTags', methods=['GET'])
def getGenreTags():
    return "GenreTags"

@app.route('/getPublisherTags', methods=['GET'])
def getPublisherTags():
    return "PublisherTags"

@app.route('/search', methods=['GET'])
def getSearchRequest():
    
    # rank = Request.form['Rank']
    # name = Request.form['Name']
    # plfrm = Request.form['Platform']
    # year = Request.form['Year']
    # genre = Request.form['Genre']
    # publisher = Request.form['Publisher']
    
    constructed_query = buildQuery()
    result = es_client.search(index="vgsales",query=constructed_query)
    return result

if __name__ == "__main__":
    app.run()

 
