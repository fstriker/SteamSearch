from elasticsearch_dsl import Search
from elasticsearch_dsl.query import Q

RESULT_SIZE = 200

def get_field_distinct():
    query = {
        "unique_platforms": {
            "terms": {
                "field": "platforms",
                "size": RESULT_SIZE
            }
        },
        "unique_genres": {
            "terms": {
                "field": "genres",
                "size": RESULT_SIZE
            }
        },
        "unique_categories": {
          "terms": {
            "field": "categories",
            "size": RESULT_SIZE
          }
        },
        "unique_publisher": {
          "terms": {
            "field": "publisher",
            "size": RESULT_SIZE
          }
        },
        "unique_developers":{
          "terms":{
            "field": "developer",
            "size": RESULT_SIZE
          }
        },
        "min_price": {
          "min":{
            "field": "price" 
          }
       },
       "max_price":{
         "max":{
           "field":"price"
         }
       }
    }
    return query

#------------------------------
# LEAF -> exists, fuzzy, ids, range, term, terms -> https://www.elastic.co/guide/en/elasticsearch/reference/current/term-level-queries.html
# Search Engine -> interval, match, multi_match, combined_fields -> https://www.elastic.co/guide/en/elasticsearch/reference/current/full-text-queries.html
# Compound Queries (Wrap multiple leaves) -> bool, boosting, dis_max -> https://www.elastic.co/guide/en/elasticsearch/reference/current/compound-queries.html#compound-queries
# Match Queries können fuzziness aktiveren

# Auto Complete
# Einfache Lösung in Form von geringen Aufwand (Eventuell schlechte Ergebnisse und langsam) - https://www.elastic.co/guide/en/elasticsearch/reference/7.2/search-as-you-type.html
# Completion Suggester (Aufwendig, aber schnell) - https://www.elastic.co/guide/en/elasticsearch/reference/6.8/search-suggesters-completion.html
    
def build_Query(es_client,index, args):
  query = Search(using=es_client, index=index)
  
  print(f"Get args: {args}")
  name = args.get('name')
  developer = args.get('developerTags')
  publisher = args.get('publisherTags')
  platforms = args.get('platformTags')
  genres = args.get('genreTags')
  categories = args.get('categorieTags')
  sort = args.get('sort')
  mode = args.get('mode')
  price_start = args.get('price_start')
  price_end = args.get('price_end')
  
  print(f"Args: Name:{name}, developer:{developer}, publisher:{publisher}, Name:{platforms}/n,genres:{genres},categories:{categories},sort:{sort},mode:{mode},/nprice_start:{price_start},price_end:{price_end}")
  
  if developer is not None:
    print("dev")
    query = query.filter('terms', developer=[developer])
    
  if publisher is not None:
    print("pub")
    query = query.filter('terms', publisher=[publisher])
    
  if platforms is not None:
    print("plat")
    platforms_list = platforms.split(',')
    for platform in platforms_list:
      query = query.query(Q('bool',must=[Q('match',platforms=platform)]))
    #query = query.filter('terms', platforms=platforms_list)
    
  if genres is not None:
    print("genres")
    genres_list = genres.split(',')
    for genre in genres_list:
      query = query.query(Q('bool',must=[Q('match',genres=genre)]))
    #query = query.filter('terms', genres=genres_list)
  
  if categories is not None:
    print("categories")
    categories_list = categories.split(',')
    for category in categories_list:
      query = query.query(Q('bool',must=[Q('match',categories=category)]))
    #query = query.filter('terms', categories=categories_list)
    
  if price_start is not None and price_end is not None:
    print("price")
    query = query.filter('range', price={'gte':price_start, 'lte':price_end})
    
  if name is not None:
    print("name")
    query = query.query('match', name=name)
   
  if sort is not None and mode is not None:
    print("sort")
    query = query.sort({sort: {'order': mode}})
  print(query.to_dict())
  return query
  
def build_fuzzy_query(name):
  query = {
    "fuzzy": {
      "name": {
        "value": name,
        "fuzziness": "AUTO"
      }
    }
  }
  return query


# Fuzzy Search for specific term
# GET /vgsales/_search
# {
#   "query": {
#     
#   }
# }
