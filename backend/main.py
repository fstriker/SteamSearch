from sys import platform
from flask import Flask
from elasticsearch import Elasticsearch
from flask.wrappers import Request
from flask_swagger_ui import get_swaggerui_blueprint

es_client = Elasticsearch("http://node-2.hska.io:9200")
app = Flask(__name__)

SWAGGER_URL = '/swagger'
API_URL = '/static/swagger.json'
SWAGGERUI_BLUEPRINT = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        'app_name': "Video Games Sales Search Engine"
    }
)
app.register_blueprint(SWAGGERUI_BLUEPRINT, url_prefix=SWAGGER_URL)

def get_field_distinct(field):
    query = {
        "unique_field": {
            "terms": {
                "field": field
            }
        }
    }
    return query

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
    
@app.route('/api/getPlatformTags', methods=['GET'])
def getPlatTags():
    dist_query = get_field_distinct("Platform")
    result = es_client.search(index="vgsales",aggs=dist_query,size=0)
    return result

@app.route('/api/getGenreTags', methods=['GET'])
def getGenreTags():
    dist_query = get_field_distinct("Genre")
    result = es_client.search(index="vgsales",aggs=dist_query,size=0)
    return result

@app.route('/api/getPublisherTags', methods=['GET'])
def getPublisherTags():
    dist_query = get_field_distinct("Publisher")
    result = es_client.search(index="vgsales",aggs=dist_query,size=0)
    return result

@app.route('/api/search', methods=['GET'])
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

 
