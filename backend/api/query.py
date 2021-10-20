def get_field_distinct():
    query = {
        "unique_platforms": {
            "terms": {
                "field": "platforms",
                "size": 3
            }
        },
        "unique_genres": {
            "terms": {
                "field": "genres",
                "size": 500
            }
        },
        "unique_categories": {
          "terms": {
            "field": "categories",
            "size": 500
          }
        },
        "unique_publisher": {
          "terms": {
            "field": "publisher",
            "size": 500
          }
        },
        "unique_developers":{
          "terms":{
            "field": "developer",
            "size": 500
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

def build_Query(args):
    query = {
        "match":{
            "Name": "Counter"
        }
    }
    
    
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

    #return query