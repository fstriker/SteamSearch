import sys
from api.query import build_Query, get_field_distinct, build_fuzzy_query
from flask import Flask, request
from elasticsearch import Elasticsearch
from flask_swagger_ui import get_swaggerui_blueprint
from flask_cors import CORS
from elasticsearch_dsl import Search
import json

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

#INDEX = "steamstoresearch"
#INDEX = "steamgames"
INDEX = "steamauto"


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
    
@app.route('/api/search', methods=['GET'])
def getSearchRequest():
    print(request.args)
    print(len(request.args))
    
    if len(request.args) == 1:
        for arg in request.args:
            if arg == 'name':
                generated_query = build_fuzzy_query(request.args[arg])
                result = es_client.search(index=INDEX,query=generated_query)
                return result
                      
    start = request.args.get("from")
    if start is None:
        start = 0
    else:
        start = int(start)
        
    end = start + 15  
    generated_query = build_Query(es_client, INDEX, request.args)
    generated_query = generated_query[start:end]
    es_response = generated_query.execute()
    return es_response.to_dict()

@app.route('/api/all', methods=['GET'])
def getAll():
    query = { 
        'match_all': {}
    }
    result = es_client.search(index=INDEX,query=query)
    return result

@app.route('/api/suggestor', methods=['GET'])
def getSuggestRequest():
    name = request.args.get('name')
    query = Search(using=es_client, index=INDEX)
    s = query.suggest('Autocomplete', name, completion={'field': 'suggest'})
    result = s.execute()
    return result.to_dict()


if __name__ == "__main__":
    app.run()

 
# developer = request.args.get("developer")
    # name = request.args.get("name")
    # platforms = request.args.get("platforms")
    # genres = request.args.get("genres")
    # publisher = request.args.get("publisher")
    # categories = request.args.get("categories")
    # print(f"Received: developer: {developer}, /n name: {name}, /n platforms: {platforms},/n genres: {genres},/n publisher: {publisher},/n categories: {categories}")
    