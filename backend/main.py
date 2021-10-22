import sys
from api.query import build_Query, test_Query, get_field_distinct
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
        'app_name': "Steam Store"
    }
)
app.register_blueprint(SWAGGERUI_BLUEPRINT, url_prefix=SWAGGER_URL)

INDEX = "steamstoresearch"


@app.route('/')
def index():
    result = es_client.info()
    return result
    
    
# Textfields cant be aggregated
@app.route('/api/getTags', methods=['GET'])
def getPlatTags():
    generated_query = get_field_distinct()
    result = es_client.search(index=INDEX,aggs=generated_query,size=0)
    return result

@app.route('/api/getTest', methods=['GET'])
def getTestRequest():
    generated_query = test_Query()
    result = es_client.search(index=INDEX,query=generated_query)
    return result
    
@app.route('/api/search', methods=['GET'])
def getSearchRequest():
    generated_query = build_Query(request.args)
    result = es_client.search(index=INDEX,query=generated_query)
    return result

if __name__ == "__main__":
    app.run()

 
