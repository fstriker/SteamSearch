import sys
from flask import Flask, request
from elasticsearch import Elasticsearch
from flask_swagger_ui import get_swaggerui_blueprint
from flask_cors import CORS

es_client = Elasticsearch(["http://node-1.hska.io:9200/","http://node-2.hska.io:9200"])
app = Flask(__name__)
cors = CORS(app)

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

def buildQuery(args):
    for x in args:
       print(args[x])
    
    # GET /vgsales/_search
    # {
    #   "query": {
    #     "fuzzy": {
    #       "Name": {
    #         "value": "Manrio",
    #         "fuzziness": "AUTO"
    #       }
    #     }
    #   }
    # }
       
    query = {
        "match":{
            "Name": "Mario"
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

@app.route('/api/getYearTags', methods=['GET'])
def getYearTags():
    dist_query = get_field_distinct("Year")
    result = es_client.search(index="vgsales",aggs=dist_query,size=0)
    return result

@app.route('/api/search', methods=['GET'])
def getSearchRequest():
    constructed_query = buildQuery(request.args)
    result = es_client.search(index="vgsales",query=constructed_query)
    return result

if __name__ == "__main__":
    app.run()

 
