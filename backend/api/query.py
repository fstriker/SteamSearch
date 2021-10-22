RESULT_SIZE = 500

def get_field_distinct():
    query = {
        "unique_platforms": {
            "terms": {
                "field": "platforms"
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
       }
    }
    return query

def test_Query():
    query = {
        "match":{
            "Name": "Tomb Raider"
        }
    }
#------------------------------
# LEAF -> exists, fuzzy, ids, range, term, terms -> https://www.elastic.co/guide/en/elasticsearch/reference/current/term-level-queries.html
# Search Engine -> interval, match, multi_match, combined_fields -> https://www.elastic.co/guide/en/elasticsearch/reference/current/full-text-queries.html
# Compound Queries (Wrap multiple leaves) -> bool, boosting, dis_max -> https://www.elastic.co/guide/en/elasticsearch/reference/current/compound-queries.html#compound-queries
# Match Queries können fuzziness aktiveren

# Auto Complete
# Einfache Lösung in Form von geringen Aufwand (Eventuell schlechte Ergebnisse und langsam) - https://www.elastic.co/guide/en/elasticsearch/reference/7.2/search-as-you-type.html
# Completion Suggester (Aufwendig, aber schnell) - https://www.elastic.co/guide/en/elasticsearch/reference/6.8/search-suggesters-completion.html

# Position 1
# Geht is not None?
# Limit 10.000 Elemente, danch sollte search_after verwendet werden.
# Quelle: https://www.elastic.co/guide/en/elasticsearch/reference/current/paginate-search-results.html
def query_paginate(pag_from, result_size):
  query_string = ""
  if pag_from is not None:
    query_string.join(f'"from": {pag_from},\n')
  if result_size is not None:
    query_string.join(f'"size":{result_size},\n') 
  return query_string


# Position 2
# sort_order = "asc" or "desc"
# Erweiterbar: - Dict als Eingabe verwenden und iterieren
# Erweiterbar: - Komplexere Sortierungen wie bspw. {"price" : {"order" : "asc", "mode" : "avg"}}
# mode -> min, max, sum, avg, median
# Quelle: https://www.elastic.co/guide/en/elasticsearch/reference/current/sort-search-results.html
def query_sort(sort_order, field):
  query_string = f'"sort" : ['
  query_string.join(f'{"{field}": "{sort_order}"}')
  query_string.join(f'],')
  return query_string
    
def build_Query(args):

    # query = {
    #     "match":{
    #         "Name": "Counter"
    #     }
    # }
 
    return query

# Fuzzy Search for specific term
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

# Search for term directly